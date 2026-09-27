$filePath = "index.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

$newInitiateCode = @"
                    initiateSearch: function (req) {
                        // ZERO-TRUST POLICY: Fetch source-of-truth from server before any UI/DB action
                        db.collection('active_gps').get().then(snap => {
                            // The Kill-Switch: If snap.empty is true, nobody is online in the real database
                            if (snap.empty) {
                                // Wipe local cache to resolve any "ghost" volunteer issues
                                this.data.active_gps = [];
                                this.renderCounters();
                                document.getElementById('modal-searching').style.display = 'none';
                                alert("В данный момент нет доступных волонтёров. Попробуйте позже.");
                                return;
                            }

                            // STAIRCASE: Only if volunteers exist, we proceed to create the request
                            this.activeRequestForUser = req.id;
                            
                            // Update local cache so searching logic is synchronized
                            const existingIdx = this.data.requests.findIndex(r => r.id === req.id);
                            if (existingIdx >= 0) this.data.requests[existingIdx] = req;
                            else this.data.requests.push(req);

                            // Final Step: Write to Firestore, THEN show UI, THEN start loop
                            db.collection('requests').doc(String(req.id)).set(req).then(() => {
                                document.getElementById('modal-searching').style.display = 'flex';
                                this.findVolunteerLoop(req.id, 0);
                            });
                        }).catch(err => {
                            console.error("Firestore Verification Error:", err);
                            alert("Ошибка связи с сервером. Повторите попытку.");
                        });
                    },
"@

$newLoopCode = @"
                    findVolunteerLoop: function (reqId, idx) {
                        const req = this.data.requests.find(r => r.id === reqId);
                        if (!req || req.status !== 'Searching') return;

                        // ZERO-TRUST: If the global pool is empty, stop recursion immediately
                        if (this.data.active_gps.length === 0) {
                            document.getElementById('modal-searching').style.display = 'none';
                            alert("Поиск остановлен: в сети не осталось волонтёров.");
                            return;
                        }

                        // Filter available volunteers: must be online AND not in declined list
                        let candidates = this.data.active_gps.filter(v =>
                            !(req.declined_vols || []).includes(v.email));

                        if (req.lat && candidates.length > 0) {
                            candidates = candidates.sort((a, b) =>
                                (Math.abs(req.lat - a.lat) + Math.abs(req.lng - a.lng)) -
                                (Math.abs(req.lat - b.lat) + Math.abs(req.lng - b.lng)));
                        }

                        if (candidates.length === 0 || idx >= candidates.length) {
                            const el = document.getElementById('search-status-details');
                            if (el) el.innerText = candidates.length === 0
                                ? "Нет доступных волонтёров. Повтор через 8с..."
                                : "Все волонтёры заняты. Повтор через 8с...";
                            setTimeout(() => this.findVolunteerLoop(reqId, 0), 8000);
                            return;
                        }

                        const candidate = candidates[idx];
                        db.collection('requests').doc(String(reqId)).update({
                            current_target_email: candidate.email,
                            status: 'Searching'
                        });
                        req.current_target_email = candidate.email;

                        document.getElementById('search-status-details').innerText = `Оповещаем: ${candidate.name}...`;

                        const formattedDetails = (req.type === 'SOS') ? "🚨 EMERGENCY SOS!" : `Standard request. Details: ${req.details}`;
                        const mapLink = (req.lat && req.lng) ? `https://www.google.com/maps?q=${req.lat},${req.lng}` : "No GPS Data";
                        
                        emailjs.send(this.serviceID, "template_wb5j0ce", {
                            email: candidate.email, vol_name: candidate.name,
                            user_phone: req.phone, request_details: formattedDetails, google_maps_link: mapLink
                        });

                        let ticks = 120; // 60s timeout
                        const timer = setInterval(() => {
                            const freshReq = this.data.requests.find(r => r.id === reqId);
                            if (!freshReq) { clearInterval(timer); return; }
                            if (freshReq.status === 'Accepted') { clearInterval(timer); return; }
                            if (freshReq.status === 'Skipped') {
                                clearInterval(timer);
                                db.collection('requests').doc(String(reqId)).update({ status: 'Searching', current_target_email: null });
                                this.findVolunteerLoop(reqId, 0);
                                return;
                            }
                            ticks--;
                            if (ticks <= 0) {
                                clearInterval(timer);
                                // Move to next candidate
                                this.findVolunteerLoop(reqId, idx + 1);
                            }
                        }, 500);
                    },
"@

# Regex for initiateSearch
$patternInit = '(?m)^\s+initiateSearch: function\s*\(req\)\s*\{[\s\S]*?\},'
# Regex for findVolunteerLoop
$patternLoop = '(?m)^\s+findVolunteerLoop: function\s*\(reqId, idx\)\s*\{[\s\S]*?\},'

if ($content -match $patternInit -and $content -match $patternLoop) {
    $content = [regex]::Replace($content, $patternInit, $newInitiateCode)
    $content = [regex]::Replace($content, $patternLoop, $newLoopCode)
    [System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
    Write-Output "SUCCESS: initiateSearch and findVolunteerLoop updated with UTF8."
} else {
    Write-Output "ERROR: Could not find blocks with regex."
}
