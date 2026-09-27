$newCode = @"
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

$filePath = "index.html"
if (Test-Path $filePath) {
    $content = Get-Content $filePath -Raw
    # Regex to find the initiateSearch function block and replace it
    # We match from the function start up to the closing brace and comma
    $pattern = '(?m)^\s+initiateSearch: function\s*\(req\)\s*\{[\s\S]*?\},'
    if ($content -match $pattern) {
        $content = [regex]::Replace($content, $pattern, $newCode)
        [System.IO.File]::WriteAllText($filePath, $content)
        Write-Output "SUCCESS: initiateSearch updated."
    } else {
        Write-Output "ERROR: Could not find initiateSearch block with regex."
    }
} else {
    Write-Output "ERROR: index.html not found in current directory."
}
