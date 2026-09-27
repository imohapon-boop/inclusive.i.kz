<script>
            // ==========================================
            // FIREBASE INITIALIZATION
            // ==========================================
            const firebaseConfig = {
                apiKey: "AIzaSyAd5ItVrwHNYlmQOmZ9x6q5HXtnszYzEqQ",
                authDomain: "qolday-app.firebaseapp.com",
                projectId: "qolday-app",
                storageBucket: "qolday-app.firebasestorage.app",
                messagingSenderId: "487310633029",
                appId: "1:487310633029:web:c6bc1895fca1ef40969b2c"
            };
            firebase.initializeApp(firebaseConfig);
            const db = firebase.firestore();

            // ==========================================
            // STRICT VALIDATION (unchanged)
            // ==========================================
            const validateInput = () => {
                const nameEl = document.getElementById('v-name');
                const phoneEl = document.getElementById('v-phone');
                const nameErr = document.getElementById('v-name-error');
                const phoneErr = document.getElementById('v-phone-error');
                const btn = document.getElementById('btn-reg-submit');
                let valid = true;
                if (nameEl.value.length > 0 && !/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(nameEl.value)) {
                    nameErr.style.display = 'block'; nameEl.classList.add('has-error'); valid = false;
                } else { nameErr.style.display = 'none'; nameEl.classList.remove('has-error'); }
                if (phoneEl.value.length > 0 && !/^\+\d{11}$/.test(phoneEl.value)) {
                    phoneErr.style.display = 'block'; phoneEl.classList.add('has-error'); valid = false;
                } else { phoneErr.style.display = 'none'; phoneEl.classList.remove('has-error'); }
                if (nameEl.value === "" || phoneEl.value === "") valid = false;
                btn.disabled = !valid;
            };

            const badgesData = {
                count_1: { title: "Первый шаг", desc: "Выполнено 1 задание", icon: "fas fa-shoe-prints" },
                count_5: { title: "Пятерка", desc: "Выполнено 5 заданий", icon: "fas fa-hand-paper" },
                count_10: { title: "Десятка", desc: "Выполнено 10 заданий", icon: "fas fa-hands-helping" },
                count_25: { title: "Опытный", desc: "Выполнено 25 заданий", icon: "fas fa-medal" },
                count_50: { title: "Мастер", desc: "Выполнено 50 заданий", icon: "fas fa-award" },
                count_100: { title: "Сотник", desc: "Выполнено 100 заданий", icon: "fas fa-star" },
                count_250: { title: "Легенда города", desc: "Выполнено 250 заданий", icon: "fas fa-crown" },

                speed_react: { title: "Быстрая реакция", desc: "Принял заявку в течение 60 сек после публикации", icon: "fas fa-bolt" },
                speed_1h: { title: "Спринтер", desc: "Выполнил задание быстрее чем за 1 час", icon: "fas fa-stopwatch" },
                speed_30m: { title: "Молния", desc: "Выполнил задание быстрее чем за 30 минут", icon: "fas fa-bolt" },
                speed_15m: { title: "Телепорт", desc: "Выполнил задание быстрее чем за 15 минут", icon: "fas fa-space-shuttle" },
                speed_streak: { title: "Пунктуальность", desc: "5 заданий подряд без отмен", icon: "fas fa-clock" },
                speed_first: { title: "Первый в очереди", desc: "Стал первым волонтером в заявке, где нужно > 1 человека", icon: "fas fa-sort-numeric-up-alt" },
                speed_triple: { title: "Всегда готов", desc: "Выполнил 3 разных заявки за один календарный день", icon: "fas fa-calendar-check" },

                sos_1: { title: "Первая помощь", desc: "Выполнил 1 SOS-заявку", icon: "fas fa-ambulance" },
                sos_5: { title: "На страже", desc: "Выполнил 5 SOS-заявок", icon: "fas fa-shield-alt" },
                sos_10: { title: "Хранитель", desc: "Выполнил 10 SOS-заявок", icon: "fas fa-user-shield" },
                sos_fast: { title: "Секунда до...", desc: "Принял SOS-заявку менее чем за 30 секунд", icon: "fas fa-fighter-jet" },
                sos_night: { title: "Вне очереди", desc: "Выполнил SOS-заявку в ночное время (22:00 - 06:00)", icon: "fas fa-moon" },
                sos_loyal: { title: "Безотказный", desc: "0 отмен по принятым SOS-заявкам за всё время", icon: "fas fa-heartbeat" },

                team_pair: { title: "Напарник", desc: "Выполнил задание в паре", icon: "fas fa-user-friends" },
                team_group: { title: "Сила в единстве", desc: "Выполнил задание в группе (3+ волонтера)", icon: "fas fa-users" },
                team_10: { title: "Душа компании", desc: "Выполнил 10 заданий в составе команд", icon: "fas fa-comments" },
                team_last: { title: "Замыкающий", desc: "Стал последним волонтером, закрывшим слот", icon: "fas fa-door-closed" },
                team_rating: { title: "Командный игрок", desc: "Получил 5.0 от напарников", icon: "fas fa-handshake" },

                spec_pharm: { title: "Аптекарь", desc: "5 выполненных заявок Аптека/Медикаменты", icon: "fas fa-pills" },
                spec_hosp: { title: "Госпитальер", desc: "5 выполненных заявок Медицина", icon: "fas fa-hospital" },
                spec_shop: { title: "Шоппер", desc: "5 выполненных заявок из категории 'ТЦ/Магазины'", icon: "fas fa-shopping-cart" },
                spec_nav: { title: "Навигатор", desc: "Помог в сопровождении 5 раз", icon: "fas fa-map-marked-alt" },
                spec_multi: { title: "Универсал", desc: "Есть хотя бы по 1 выполненной заявке в каждой категории", icon: "fas fa-tools" },

                time_night: { title: "Ночной дозор", desc: "Выполнил задание в период 23:00 - 05:00", icon: "fas fa-moon" },
                time_morning: { title: "Ранняя пташка", desc: "Выполнил задание в период 05:00 - 08:00", icon: "fas fa-sun" },
                time_weekend: { title: "Герой выходного дня", desc: "5 выполненных заявок в Сб/Вс", icon: "fas fa-calendar-day" },
                time_week_streak: { title: "Неделя в строю", desc: "Минимум 1 задание каждый день в течение недели", icon: "fas fa-calendar-week" },
                time_month: { title: "Месяц в строю", desc: "30 дней с момента регистрации", icon: "fas fa-calendar-alt" },
                time_veteran: { title: "Старожил", desc: "Выполнил задание спустя 6 месяцев после регистрации", icon: "fas fa-history" },

                rate_streak: { title: "Любимец народа", desc: "10 оценок '5 звезд' подряд", icon: "fas fa-award" },
                rate_perfect: { title: "Безупречный", desc: "Рейтинг 5.0 при > 20 заданий", icon: "fas fa-gem" },
                rate_feedback: { title: "Золотое сердце", desc: "Получил большой текстовый отзыв", icon: "fas fa-heart" },
                rate_top: { title: "Топ волонтер", desc: "Вошел в ТОП-3 общего рейтинга города", icon: "fas fa-trophy" }
            };

            const app = {
                data: { volunteers: [], requests: [], active_gps: [] },
                user: null, geoId: null, serviceID: "service_wav07tx",
                tempCode: null, tempRegData: null, isOnline: false,
                currentRating: 0, rateVolEmail: null,
                _unsubscribers: [], matchPoll: null, pendingReqId: null,
                activeTaskId: null, activeRequestForUser: null, pendingReviewReqId: null,

                evaluateAchievements: function (vol, req, updatedRatings, allRequests) {
                    const earned = vol.earnedAchievements || [];
                    const add = (id) => { if (!earned.includes(id)) earned.push(id); };

                    // Ensure basic arrays exist
                    const ratings = updatedRatings || [];
                    const reqHistory = allRequests.filter(r => (r.volunteersJoined || []).includes(vol.email) && r.status === 'completed');
                    const completedCount = reqHistory.length;

                    // Count badges
                    if (completedCount >= 1) add("count_1");
                    if (completedCount >= 5) add("count_5");
                    if (completedCount >= 10) add("count_10");
                    if (completedCount >= 25) add("count_25");
                    if (completedCount >= 50) add("count_50");
                    if (completedCount >= 100) add("count_100");
                    if (completedCount >= 250) add("count_250");

                    // Speed / Time context matches against current request
                    if (req && req.startTime && req.endTime) {
                        const mins = (req.endTime - req.startTime) / 60000;
                        if (mins < 60) add("speed_1h");
                        if (mins < 30) add("speed_30m");
                        if (mins < 15) add("speed_15m");

                        const acceptDelay = (req.startTime - (req.createdAt && req.createdAt.seconds ? req.createdAt.seconds * 1000 : req.createdAt || req.startTime)) / 1000;
                        if (acceptDelay > 0 && acceptDelay < 60) add("speed_react");

                        // Teams
                        const volsJoined = req.volunteersJoined || [];
                        if (volsJoined.length === 2) add("team_pair");
                        if (volsJoined.length >= 3) add("team_group");
                        if (volsJoined.length > 1 && volsJoined[volsJoined.length - 1] === vol.email) add("team_last");
                        if (volsJoined.length > 1 && volsJoined[0] === vol.email) add("speed_first");

                        // Night/Morning
                        const hour = new Date(req.endTime).getHours();
                        if (hour >= 23 || hour < 5) add("time_night");
                        if (hour >= 5 && hour < 8) add("time_morning");
                        const day = new Date(req.endTime).getDay();
                        if (day === 0 || day === 6) {
                            const weekendReqs = reqHistory.filter(r => {
                                if (!r.endTime) return false;
                                const d = new Date(r.endTime).getDay(); return d === 0 || d === 6;
                            });
                            if (weekendReqs.length >= 5) add("time_weekend");
                        }
                    }

                    // SOS
                    const sosHistory = reqHistory.filter(r => r.type === 'SOS');
                    if (sosHistory.length >= 1) add("sos_1");
                    if (sosHistory.length >= 5) add("sos_5");
                    if (sosHistory.length >= 10) add("sos_10");
                    if (req && req.type === 'SOS') {
                        const acceptDelay = (req.startTime - (req.createdAt && req.createdAt.seconds ? req.createdAt.seconds * 1000 : req.createdAt || req.startTime)) / 1000;
                        if (acceptDelay > 0 && acceptDelay < 30) add("sos_fast");
                        const hour = new Date(req.endTime).getHours();
                        if (hour >= 22 || hour < 6) add("sos_night");
                        add("sos_loyal"); // Approximated
                    }

                    // Categories
                    const cPharm = reqHistory.filter(r => r.type === 'Продукты/Аптека');
                    const cNav = reqHistory.filter(r => r.type === 'Сопровождение');
                    const cWheel = reqHistory.filter(r => r.type === 'Помощь с коляской');
                    const cOther = reqHistory.filter(r => r.type === 'Другое');

                    if (cPharm.length >= 5) add("spec_pharm");
                    if (cNav.length >= 5) add("spec_nav");
                    if (cPharm.length >= 1 && cNav.length >= 1 && cWheel.length >= 1 && cOther.length >= 1) add("spec_multi");

                    // Teams history
                    const teamReqs = reqHistory.filter(r => (r.volunteersJoined || []).length > 1);
                    if (teamReqs.length >= 10) add("team_10");

                    // Ratings
                    if (ratings.length > 0) {
                        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                        if (avg >= 5.0 && completedCount > 20) add("rate_perfect");

                        let streak = 0;
                        for (let i = ratings.length - 1; i >= 0; i--) {
                            if (ratings[i] === 5) streak++; else break;
                        }
                        if (streak >= 10) add("rate_streak");

                        if (req && (req.volunteersJoined || []).length > 1 && ratings[ratings.length - 1] === 5) add("team_rating");
                    }

                    // Triple day check
                    if (completedCount >= 3) {
                        const latestDay = new Date(reqHistory[reqHistory.length - 1].endTime).toDateString();
                        const sameDayReqs = reqHistory.filter(r => new Date(r.endTime).toDateString() === latestDay);
                        if (sameDayReqs.length >= 3) add("speed_triple");
                    }

                    return earned;
                },

                renderAchievements: function () {
                    const grid = document.getElementById('achievements-grid');
                    if (!grid || !this.user) return;

                    const earned = this.user.earnedAchievements || [];
                    let html = '';

                    Object.keys(badgesData).forEach(id => {
                        const badge = badgesData[id];
                        const isUnlocked = earned.includes(id);
                        const cssClass = isUnlocked ? 'badge-unlocked' : 'badge-locked';

                        html += `
                        <div class="badge-card ${cssClass}">
                            <i class="${badge.icon}"></i>
                            <div class="badge-tooltip">
                                <strong>${badge.title}</strong><br>
                                <span style="font-size:0.7rem; color:#ccc;">${badge.desc}</span>
                            </div>
                        </div>
                    `;
                    });

                    grid.innerHTML = html;
                },

                showAchievementToast: function (badgeId) {
                    const badge = badgesData[badgeId];
                    if (!badge) return;

                    const container = document.getElementById('toast-container');
                    if (!container) return;

                    const toast = document.createElement('div');
                    toast.className = 'toast-notification';
                    toast.innerHTML = `
                    <div style="background: rgba(255,255,255,0.2); width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                        <i class="${badge.icon}" style="font-size: 1.2rem; color: gold;"></i>
                    </div>
                    <div>
                        <div style="font-size: 0.8rem; color: #ccc;">🏆 Достижение разблокировано!</div>
                        <div style="font-weight: bold; font-size: 1rem;">${badge.title}</div>
                    </div>
                `;

                    container.appendChild(toast);

                    setTimeout(() => {
                        toast.style.animation = 'fadeOutRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
                        setTimeout(() => toast.remove(), 400);
                    }, 5000);
                },

                showPublicProfile: function (email, event) {
                    console.log("CLICK DETECTED for ID:", email);
                    if (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    }

                    const vol = this.data.volunteers.find(v => v.email === email);
                    if (!vol) {
                        alert("Профиль волонтера не найден.");
                        return;
                    }

                    document.getElementById('pub-profile-name').innerText = vol.name || 'Волонтёр';

                    const avg = (vol.ratings && vol.ratings.length) ? (vol.ratings.reduce((a, b) => a + b, 0) / vol.ratings.length).toFixed(1) : '0.0';
                    document.getElementById('pub-profile-rating').innerHTML = `${avg} <i class="fas fa-star" style="color: #4B0082;"></i>`;
                    document.getElementById('pub-profile-count').innerText = vol.helpCount || 0;

                    const grid = document.getElementById('pub-profile-badges');
                    const earned = vol.earnedAchievements || [];
                    let html = '';

                    Object.keys(badgesData).forEach(id => {
                        const badge = badgesData[id];
                        const isUnlocked = earned.includes(id);
                        const cssClass = isUnlocked ? 'badge-unlocked' : 'badge-locked';

                        html += `
                        <div class="badge-card ${cssClass}" style="width: 40px; height: 40px;">
                            <i class="${badge.icon}" style="font-size: 1rem;"></i>
                            <div class="badge-tooltip">
                                <strong>${badge.title}</strong><br>
                                <span style="font-size:0.7rem; color:#ccc;">${badge.desc}</span>
                            </div>
                        </div>
                    `;
                    });

                    grid.innerHTML = html;

                    // Popover positioning logic
                    const modal = document.getElementById('modal-public-profile');
                    const card = document.getElementById('pub-profile-card');
                    modal.style.display = 'block';

                    if (event && event.target) {
                        const rect = event.target.getBoundingClientRect();
                        let top = rect.top + window.scrollY;
                        let left = rect.right + 15; // default to the right

                        // Check if it goes off screen on the right
                        if (left + 320 > window.innerWidth) {
                            // Place it below instead
                            left = Math.max(10, rect.left - 160 + (rect.width / 2));
                            top = rect.bottom + 10 + window.scrollY;
                        }

                        // Mobile centering fallback
                        if (window.innerWidth < 600) {
                            left = (window.innerWidth - 320) / 2;
                            top = window.scrollY + 100;
                        }

                        card.style.left = left + 'px';
                        card.style.top = top + 'px';
                    } else {
                        // Fallback to center
                        card.style.left = (window.innerWidth - 320) / 2 + 'px';
                        card.style.top = window.scrollY + 100 + 'px';
                    }
                },

                init: function () {
                    this.setupListeners();
                    this.initVoiceAssistant(); // Initialize Dual-Mode Voice NLP

                    // Event Listeners
                    const toggle = document.getElementById('toggle-online-btn');
                    if (toggle) toggle.addEventListener('click', () => this.toggleOnline());
                    const nameEl = document.getElementById('v-name');
                    const phoneEl = document.getElementById('v-phone');
                    if (nameEl) nameEl.addEventListener('input', validateInput);
                    if (phoneEl) phoneEl.addEventListener('input', validateInput);

                    // Set min datetime for scheduling
                    const dtInput = document.getElementById('r-datetime');
                    if (dtInput) {
                        const now = new Date();
                        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                        dtInput.min = now.toISOString().slice(0, 16);
                    }

                    // Restore session from localStorage (session-only, not cross-device)
                    const saved = localStorage.getItem('inclusion_v4_user');
                    if (saved) { this.user = JSON.parse(saved); this.showDashboard(); }

                    // Restore user request from localStorage
                    const savedReq = localStorage.getItem('inclusion_v4_activeReq');
                    if (savedReq) { this.activeRequestForUser = Number(savedReq); }

                    // Start the interval for automated scheduled tasks
                    setInterval(() => this.checkScheduledTimers(), 5000);

                    // Set Home as the active navigation tab on initial page load
                    this.updateNavigationUI('home');
                },

                // --- VOICE ASSISTANT PIPELINE ---
                voiceRecognition: null,
                backgroundRecognition: null,
                isRecordingVoiceSOS: false,

                // Audio beep cue using Web Audio API (plays before mic restarts)
                playBeep: function () {
                    try {
                        const ctx = new (window.AudioContext || window.webkitAudioContext)();
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.frequency.value = 440; // A4 note
                        osc.type = 'sine';
                        gain.gain.value = 0.3;
                        osc.start();
                        osc.stop(ctx.currentTime + 0.2); // 200ms beep
                        osc.onended = () => ctx.close();
                    } catch (e) {
                        console.warn('[Beep] Audio context unavailable:', e.message);
                    }
                },

                initVoiceAssistant: function () {
                    const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (!SpeechAPI) {
                        console.warn("Speech Recognition not supported natively in this browser.");
                        return;
                    }

                    // 1. Background Automatic Listener ("Начни запись")
                    this.backgroundRecognition = new SpeechAPI();
                    this.backgroundRecognition.continuous = true;
                    this.backgroundRecognition.interimResults = false;
                    this.backgroundRecognition.lang = 'ru-RU';

                    this.backgroundRecognition.onresult = (event) => {
                        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
                        console.log('[Background] Heard:', transcript);

                        // Trigger: Start recording
                        if (transcript.includes('начни запись') || transcript.includes('начать запись')) {
                            this.backgroundRecognition.stop();
                            this.nav('request');
                            setTimeout(() => this.startVoiceSOS(), 500);
                            return;
                        }

                        // Trigger: Submit form (hands-free)
                        if (transcript.includes('всё верно') || transcript.includes('все верно') || transcript.includes('разместить') || transcript.includes('отправить')) {
                            console.log('[Background] Submit triggered');
                            const n = (document.getElementById('r-name').value || '').trim();
                            const p = (document.getElementById('r-phone').value || '').trim();
                            const l = (document.getElementById('r-details').value || '').trim();
                            let missing = [];
                            if (!n) missing.push('ваше имя');
                            if (!p || p === '+7' || p.length < 11) missing.push('ваш номер телефона');
                            if (!l) missing.push('ваш адрес');

                            if (missing.length > 0 && 'speechSynthesis' in window) {
                                const u = new SpeechSynthesisUtterance(`Данные не полны. Пожалуйста, назовите ${missing[0]}`);
                                u.lang = 'ru-RU';
                                u.onend = () => { this.playBeep(); setTimeout(() => this.startVoiceSOS(), 600); };
                                window.speechSynthesis.speak(u);
                            } else {
                                if ('speechSynthesis' in window) {
                                    const u = new SpeechSynthesisUtterance('Всё заполнено. Размещаю заявку.');
                                    u.lang = 'ru-RU';
                                    u.onend = () => {
                                        const form = document.querySelector('#page-request form');
                                        if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
                                    };
                                    window.speechSynthesis.speak(u);
                                }
                            }
                            return;
                        }

                        // Trigger: Repeat data
                        if (transcript.includes('повтори') || transcript.includes('повтори пожалуйста') || transcript.includes('повтори номер')) {
                            console.log('[Background] Repeat triggered');
                            if ('speechSynthesis' in window) {
                                let msg;
                                if (this.lastVolInfo) {
                                    msg = `Ваш волонтёр: ${this.lastVolInfo.name}. Телефон: ${this.lastVolInfo.phone}.`;
                                } else {
                                    const n = (document.getElementById('r-name').value || '').trim() || 'не указано';
                                    const p = (document.getElementById('r-phone').value || '').trim();
                                    const l = (document.getElementById('r-details').value || '').trim() || 'не указан';
                                    msg = `В заявке: имя ${n}, телефон ${p || 'не указан'}, адрес ${l}.`;
                                }
                                const u = new SpeechSynthesisUtterance(msg);
                                u.lang = 'ru-RU';
                                u.rate = 0.85;
                                window.speechSynthesis.speak(u);
                            }
                            return;
                        }
                    };

                    this.backgroundRecognition.onstart = () => { console.log("Background Voice SOS armed."); };
                    this.backgroundRecognition.onend = () => {
                        // Keep restarting background listener forever unless we are manually recording
                        if (!this.isRecordingVoiceSOS && this.backgroundRecognition) {
                            try { this.backgroundRecognition.start(); } catch (e) { }
                        }
                    };

                    // Intial start
                    try { this.backgroundRecognition.start(); } catch (e) { }

                    // 2. Active Manual Feedback Listener
                    this.voiceRecognition = new SpeechAPI();
                    this.voiceRecognition.continuous = false;
                    this.voiceRecognition.interimResults = false;
                    this.voiceRecognition.lang = 'ru-RU';

                    this.voiceRecognition.onstart = () => {
                        this.isRecordingVoiceSOS = true;
                        document.getElementById('voice-sos-status').style.display = 'block';
                        const container = document.getElementById('request-form-container');
                        if (container) {
                            container.style.border = '2px solid #ef4444';
                            container.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.6)';
                        }
                    };

                    this.voiceRecognition.onresult = (event) => {
                        const text = event.results[0][0].transcript;
                        const tLow = text.toLowerCase().trim();

                        // --- VOICE SUBMIT COMMAND DETECTION ---
                        if (tLow.includes('разместить заявку') || tLow.includes('отправить') || tLow.includes('всё верно') || tLow.includes('все верно')) {
                            console.log('[VoiceCommand] Submit detected:', tLow);
                            // --- SMART VALIDATION before submit ---
                            const n = (document.getElementById('r-name').value || '').trim();
                            const p = (document.getElementById('r-phone').value || '').trim();
                            const l = (document.getElementById('r-details').value || '').trim();
                            let missing = [];
                            if (!n) missing.push('ваше имя');
                            if (!p || p === '+7' || p.length < 11) missing.push('ваш номер телефона');
                            if (!l) missing.push('ваш адрес');

                            if (missing.length > 0) {
                                // Fields incomplete — ask and restart mic
                                console.log('[VoiceCommand] Missing fields:', missing);
                                if ('speechSynthesis' in window) {
                                    const msg = `Заявка не полная. Пожалуйста, дополните данные: ${missing[0]}. Повторите, пожалуйста.`;
                                    const u = new SpeechSynthesisUtterance(msg);
                                    u.lang = 'ru-RU';
                                    u.onend = () => { this.playBeep(); setTimeout(() => this.startVoiceSOS(), 600); };
                                    window.speechSynthesis.speak(u);
                                }
                            } else {
                                // All fields filled — submit
                                if ('speechSynthesis' in window) {
                                    const u = new SpeechSynthesisUtterance('Всё заполнено. Размещаю заявку.');
                                    u.lang = 'ru-RU';
                                    u.onend = () => {
                                        const form = document.querySelector('#page-request form');
                                        if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
                                    };
                                    window.speechSynthesis.speak(u);
                                }
                            }
                            return;
                        }

                        // --- "REPEAT VOLUNTEER INFO" COMMAND ---
                        if (tLow.includes('повтори номер') || tLow.includes('повтори данные волонтера') || tLow.includes('повтори информацию')) {
                            console.log('[VoiceCommand] Repeat volunteer info requested');
                            if (this.lastVolInfo && 'speechSynthesis' in window) {
                                const msg = `Ваш волонтёр: ${this.lastVolInfo.name}. Телефон: ${this.lastVolInfo.phone}.`;
                                const u = new SpeechSynthesisUtterance(msg);
                                u.lang = 'ru-RU';
                                u.rate = 0.85;
                                window.speechSynthesis.speak(u);
                            } else if ('speechSynthesis' in window) {
                                const u = new SpeechSynthesisUtterance('Пока нет информации о волонтёре. Заявка ещё не принята.');
                                u.lang = 'ru-RU';
                                window.speechSynthesis.speak(u);
                            }
                            return;
                        }

                        // Normal voice parsing
                        this.parseVoiceSOS(text);
                    };

                    this.voiceRecognition.onend = () => {
                        this.isRecordingVoiceSOS = false;
                        document.getElementById('voice-sos-status').style.display = 'none';
                        const container = document.getElementById('request-form-container');
                        if (container) {
                            container.style.border = 'none';
                            container.style.boxShadow = 'none';
                        }
                        // Resume background trigger hunting
                        try { this.backgroundRecognition.start(); } catch (e) { }
                    };
                },

                startVoiceSOS: function () {
                    if (!this.voiceRecognition) {
                        alert("К сожалению, ваш браузер не поддерживает распознавание голоса.");
                        return;
                    }
                    if (this.backgroundRecognition) {
                        try { this.backgroundRecognition.stop(); } catch (e) { }
                    }
                    try {
                        this.voiceRecognition.start();
                    } catch (e) {
                        console.error('Voice start error', e);
                    }
                },

                parseVoiceSOS: function (text) {
                    console.log("Captured Voice Logic:", text);
                    const tText = text.toLowerCase();

                    // DOM Input Elements
                    const inputName = document.getElementById('r-name');
                    const inputPhone = document.getElementById('r-phone');
                    const inputDetails = document.getElementById('r-details');
                    const inputType = document.getElementById('r-type');
                    const inputNeeded = document.getElementById('r-needed');
                    const inputTiming = document.getElementById('r-timing');
                    const inputDatetime = document.getElementById('r-datetime');
                    const dtGroup = document.getElementById('r-datetime-group');

                    // Read current DOM values (to not override if already filled)
                    let name = inputName.value.trim();
                    let phone = inputPhone.value.trim();
                    if (phone === "+7") phone = "";
                    let addr = inputDetails.value.trim();
                    let category = inputType.value;
                    let needed = parseInt(inputNeeded.value) || 1;

                    // 1. Phone Number Extraction
                    const digitMap = {
                        "ноль": "0", "один": "1", "два": "2", "три": "3", "четыре": "4",
                        "пять": "5", "шесть": "6", "семь": "7", "восемь": "8", "девять": "9",
                        "десять": "10", "одиннадцать": "11", "двенадцать": "12"
                    };
                    let processedText = tText;
                    // very basic replace for numbers spoken in words
                    Object.keys(digitMap).forEach(word => {
                        const regex = new RegExp("\\b" + word + "\\b", "g");
                        processedText = processedText.replace(regex, digitMap[word]);
                    });

                    // Extract 10-11 contiguous digits ignoring spaces and dashes
                    const paramNumbers = processedText.replace(/[\s\-]/g, '');
                    const phoneMatch = paramNumbers.match(/(?:\+7|8|7)(\d{10})/);
                    if (phoneMatch && !phone) {
                        phone = '+7' + phoneMatch[1];
                    }

                    // 2. Smart Category Mapping
                    if (/(сопровождение|проводить|пойти вместе)/.test(tText)) {
                        category = "Сопровождение";
                    } else if (/(продукты|еда|купить покушать)/.test(tText)) {
                        category = "Продукты/Аптека";
                    } else if (/(аптека|лекарства|таблетки)/.test(tText)) {
                        category = "Продукты/Аптека";
                    } else if (/(краска|покрасить|ремонт)/.test(tText)) {
                        category = "Помощь с краской";
                    } else if (/(коляск)/.test(tText)) {
                        category = "Помощь с коляской";
                    }

                    // Add "Помощь с краской" option if it doesn't exist
                    let optionExists = false;
                    for (let i = 0; i < inputType.options.length; i++) {
                        if (inputType.options[i].value === "Помощь с краской") { optionExists = true; break; }
                    }
                    if (!optionExists && category === "Помощь с краской") {
                        const opt = document.createElement("option");
                        opt.text = "Помощь с краской";
                        inputType.add(opt);
                    }

                    // 3. Entity Separation (Name vs Address)
                    if (!name) {
                        const nameRegex = /(?:меня зовут|мое имя|я)\s+([а-яёА-ЯЁ]+(?:\s+[а-яёА-ЯЁ]+)?)/i;
                        const nm = text.match(nameRegex);
                        if (nm) name = nm[1].trim();
                    }

                    if (!addr) {
                        const addrRegex = /(?:улица|дом|нахожусь у|нахожусь на|нахожусь в|ориентир|в районе|адрес|я на улице|мой адрес)\s+(.+)/i;
                        const am = text.match(addrRegex);
                        if (am) {
                            addr = am[1];
                            addr = addr.replace(/(?:мой телефон|а телефон|мой номер|меня зовут|я\s|номер|телефон).*$/i, '').trim();
                        } else if (!text.match(/(?:меня зовут|мое имя|телефон|номер|связаться|проводить|продукты|аптека|сколько|через|в |волонтер)/i)) {
                            // Valid fallback if utterance is short and isolated
                            if (text.trim().split(' ').length > 1) { addr = text.trim(); }
                        }
                    }

                    // 4. Numbers & Time Extraction
                    // Сколько волонтеров
                    const volMatch = processedText.match(/(?:сколько|нужно|надо|нужен|нужны)?\s*(\d+)\s*(?:волонтер|человек|помощник)/i);
                    if (volMatch) {
                        const num = parseInt(volMatch[1]);
                        if (!isNaN(num) && num > 0 && num <= 10) needed = num;
                    } else if (/(один|одного)\s*(?:волонтер|человек|помощник)/i.test(tText)) needed = 1;
                    else if (/(два|двое|двух)\s*(?:волонтер|человек|помощник)/i.test(tText)) needed = 2;
                    else if (/(три|трое|трех)\s*(?:волонтер|человек|помощник)/i.test(tText)) needed = 3;

                    // Время подачи
                    let parsedDate = null;
                    if (/(завтра)\s+(?:в\s+)?(\d+)/.test(processedText)) {
                        const match = processedText.match(/(?:завтра)\s+(?:в\s+)?(\d+)/);
                        const hour = parseInt(match[1]);
                        parsedDate = new Date();
                        parsedDate.setDate(parsedDate.getDate() + 1);
                        parsedDate.setHours(hour, 0, 0, 0);
                    } else if (/(через час|через 1 час)/.test(tText)) {
                        parsedDate = new Date();
                        parsedDate.setHours(parsedDate.getHours() + 1);
                    } else if (/(сегодня в|в)\s+(\d+)\s*(вечера|утра|дня|час)/.test(tText)) {
                        const match = tText.match(/(?:сегодня в|в)\s+(\d+)\s*(вечера|утра|дня|час)/);
                        let hour = parseInt(match[1]);
                        const period = match[2];
                        if (period === 'вечера' && hour < 12) hour += 12;
                        parsedDate = new Date();
                        parsedDate.setHours(hour, 0, 0, 0);
                    }

                    if (parsedDate) {
                        inputTiming.value = "scheduled";
                        dtGroup.style.display = 'block';
                        inputDatetime.required = true;

                        // Fix timezone offset for datetime-local
                        parsedDate.setMinutes(parsedDate.getMinutes() - parsedDate.getTimezoneOffset());
                        inputDatetime.value = parsedDate.toISOString().slice(0, 16);
                    }

                    // Flush back to DOM
                    if (name) inputName.value = name;
                    if (phone) inputPhone.value = phone;
                    if (addr) inputDetails.value = addr;
                    if (category) inputType.value = category;
                    inputNeeded.value = needed;

                    // 5. Validation Step
                    let missingFields = [];
                    if (!name) missingFields.push("ваше имя");
                    if (!phone || phone.length < 11) missingFields.push("ваш номер телефона");
                    if (!addr) missingFields.push("ваш текущий адрес");

                    if ('speechSynthesis' in window) {
                        let utteranceText = "";
                        if (missingFields.length > 0) {
                            utteranceText = `Пожалуйста, назовите ${missingFields[0]}. Говорите после сигнала.`;
                            const utterance = new SpeechSynthesisUtterance(utteranceText);
                            utterance.lang = 'ru-RU';
                            utterance.onend = () => {
                                // Beep then auto-restart listening for the missing field
                                this.playBeep();
                                setTimeout(() => this.startVoiceSOS(), 600);
                            };
                            window.speechSynthesis.speak(utterance);
                        } else {
                            utteranceText = "Я заполнила данные по вашей заявке. Пожалуйста, проверьте экран и нажмите кнопку Разместить Заявку.";
                            const utterance = new SpeechSynthesisUtterance(utteranceText);
                            utterance.lang = 'ru-RU';
                            window.speechSynthesis.speak(utterance);
                        }
                    } else if (missingFields.length > 0) {
                        // Fallback trigger if no TTS is physically mapped on the OS
                        setTimeout(() => this.startVoiceSOS(), 1000);
                    }
                },

                // ====== GEMINI AI PARSER (Advanced NLP alternative) ======
                parseVoiceWithGemini: async function (text) {
                    console.log('[Gemini] Processing:', text);

                    const statusUI = document.getElementById('voice-sos-status');
                    if (statusUI) {
                        statusUI.style.display = 'block';
                        statusUI.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ИИ анализирует...';
                    }

                    const apiKey = 'AIzaSyBPlEwBAxo1l1D4EDT7gjhHowsj2Bk4JwM';
                    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

                    const prompt = `Analyze this text spoken in Russian: "${text}"

Return ONLY a valid JSON object:
{
  "name": "Only the person's name. If not found, empty string.",
  "phone": "Phone number as 10-11 digits. Convert spoken words to digits. If not found, empty string.",
  "category": "One of: 'Сопровождение', 'Продукты/Аптека', 'Помощь с коляской', 'Помощь с краской', 'Другое'. Map: аптека/лекарства→'Продукты/Аптека', проводить→'Сопровождение'.",
  "location": "Only the address or landmark. NOT the full text. If not found, empty string.",
  "time": "ISO time string or null. 'через час'→calculate, 'завтра в 10'→calculate.",
  "volunteers_count": "Return the number of volunteers as a plain integer (e.g., 2, not 'двое'). If not specified, default to 1. MUST NOT BE A STRING.",
  "submit": "true if user says 'разместить', 'отправить', or 'всё верно'. Otherwise false."
}
CRITICAL: name must NEVER contain address. location must NEVER contain name. Respond ONLY with JSON.`;

                    try {
                        const response = await fetch(url, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                        });

                        console.log(`[Gemini] HTTP ${response.status}`);
                        if (!response.ok) throw new Error(`HTTP ${response.status}`);

                        const raw = await response.json();
                        let aiText = raw.candidates[0].content.parts[0].text;
                        aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();

                        const d = JSON.parse(aiText);
                        console.log('Extracted Data:', d);

                        // Safety: location must not be the full transcription
                        let loc = d.location || '';
                        if (loc.toLowerCase().trim() === text.toLowerCase().trim()) loc = '';

                        // Field routing
                        if (d.name) document.getElementById('r-name').value = d.name;

                        let phone = (d.phone || '').replace(/[\s\-\(\)]/g, '');
                        if (phone.length >= 10) {
                            if (phone.startsWith('8') && phone.length === 11) phone = '+7' + phone.substring(1);
                            else if (!phone.startsWith('+')) phone = '+7' + phone.replace(/^7/, '');
                            document.getElementById('r-phone').value = phone;
                        }

                        if (loc) document.getElementById('r-details').value = loc;

                        const inputType = document.getElementById('r-type');
                        let cat = d.category || 'Другое';
                        let exists = false;
                        for (let i = 0; i < inputType.options.length; i++) {
                            if (inputType.options[i].value === cat) { exists = true; break; }
                        }
                        if (!exists) {
                            const o = document.createElement('option'); o.text = cat; o.value = cat;
                            inputType.add(o);
                        }
                        inputType.value = cat;

                        let vol = Math.floor(Number(d.volunteers_count)) || 1;
                        if (isNaN(vol) || vol < 1) vol = 1;
                        if (vol > 10) vol = 10;
                        document.getElementById('r-needed').value = vol;
                        console.log('[Gemini] Volunteer count set to:', vol);

                        // Time
                        if (d.time && d.time !== 'null') {
                            const dt = new Date(d.time);
                            if (!isNaN(dt.getTime())) {
                                document.getElementById('r-timing').value = 'scheduled';
                                const dtGroup = document.getElementById('r-datetime-group');
                                dtGroup.style.display = 'block';
                                const inp = document.getElementById('r-datetime');
                                inp.required = true;
                                dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
                                inp.value = dt.toISOString().slice(0, 16);
                            }
                        }

                        // Auto-submit if Gemini detected submit command
                        if (d.submit === true || d.submit === 'true') {
                            console.log('[Gemini] Submit intent detected, validating...');
                            const n = (document.getElementById('r-name').value || '').trim();
                            const p = (document.getElementById('r-phone').value || '').trim();
                            const l = (document.getElementById('r-details').value || '').trim();
                            let missing = [];
                            if (!n) missing.push('ваше имя');
                            if (!p || p === '+7' || p.length < 11) missing.push('ваш номер телефона');
                            if (!l) missing.push('ваш адрес');

                            if (missing.length > 0) {
                                if ('speechSynthesis' in window) {
                                    const msg = `Заявка не полная. Пожалуйста, назовите ${missing[0]}. Повторите, пожалуйста.`;
                                    const u = new SpeechSynthesisUtterance(msg);
                                    u.lang = 'ru-RU';
                                    u.onend = () => { this.playBeep(); setTimeout(() => this.startVoiceSOS(), 600); };
                                    window.speechSynthesis.speak(u);
                                }
                            } else {
                                if ('speechSynthesis' in window) {
                                    const u = new SpeechSynthesisUtterance('Всё заполнено. Размещаю заявку.');
                                    u.lang = 'ru-RU';
                                    u.onend = () => {
                                        const form = document.querySelector('#page-request form');
                                        if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
                                    };
                                    window.speechSynthesis.speak(u);
                                }
                            }
                            return;
                        }

                        // Also check text for submit intent (fallback if Gemini missed it)
                        const shouldSubmit = (d.submit === true || d.submit === 'true' || text.toLowerCase().includes('разместить'));
                        // (handled above for d.submit; text-based check triggers same validation below)

                        // --- ERROR CORRECTION: Phone validation ---
                        const curPhone = (document.getElementById('r-phone').value || '').trim();
                        if (curPhone && curPhone !== '+7' && curPhone.length < 12) {
                            console.log('[Gemini] Phone seems invalid:', curPhone);
                            if ('speechSynthesis' in window) {
                                const u = new SpeechSynthesisUtterance('Номер телефона кажется неверным. Повторите номер еще раз.');
                                u.lang = 'ru-RU';
                                u.onend = () => { this.playBeep(); setTimeout(() => this.startVoiceSOS(), 600); };
                                window.speechSynthesis.speak(u);
                            }
                            return;
                        }

                        // TTS: confirm what was filled + ask for missing
                        const nameVal = (document.getElementById('r-name').value || '').trim();
                        const addrVal = (document.getElementById('r-details').value || '').trim();
                        let missingAfter = [];
                        if (!nameVal) missingAfter.push('ваше имя');
                        if (!curPhone || curPhone === '+7') missingAfter.push('ваш номер телефона');
                        if (!addrVal) missingAfter.push('ваш адрес');

                        if ('speechSynthesis' in window) {
                            let msg;
                            if (missingAfter.length > 0) {
                                msg = `Пожалуйста, дополните данные: ${missingAfter[0]}. Говорите после сигнала.`;
                            } else if (shouldSubmit) {
                                // Text included 'разместить' and all fields are filled
                                const u2 = new SpeechSynthesisUtterance('Всё заполнено. Размещаю заявку.');
                                u2.lang = 'ru-RU';
                                u2.onend = () => {
                                    const form = document.querySelector('#page-request form');
                                    if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
                                };
                                window.speechSynthesis.speak(u2);
                                return;
                            } else {
                                msg = `Я заполнила данные. Если всё правильно, скажите 'Всё верно' для отправки, или 'Повтори', чтобы услышать данные волонтера`;
                            }
                            const u = new SpeechSynthesisUtterance(msg);
                            u.lang = 'ru-RU';
                            u.onend = () => { this.playBeep(); setTimeout(() => this.startVoiceSOS(), 600); };
                            window.speechSynthesis.speak(u);
                        }

                    } catch (error) {
                        console.error('[Gemini] Error:', error.message);
                        console.warn('[Gemini] Falling back to local parser...');
                        // Fallback to local regex parser
                        this.parseVoiceSOS(text);
                    } finally {
                        if (statusUI) {
                            setTimeout(() => { statusUI.style.display = 'none'; }, 2000);
                        }
                    }
                },

                // --- FIRESTORE REAL-TIME LISTENERS ---
                setupListeners: function () {
                    // 1. Volunteers collection
                    this._unsubscribers.push(db.collection('volunteers').onSnapshot(snap => {
                        this.data.volunteers = snap.docs.map(d => d.data());
                        if (this.user) {
                            const fresh = this.data.volunteers.find(v => v.email === this.user.email);
                            if (fresh) {
                                const oldEarned = this.user.earnedAchievements || [];
                                const newEarned = fresh.earnedAchievements || [];

                                // Trigger Toasts for newly acquired badges
                                if (newEarned.length > oldEarned.length) {
                                    const justEarned = newEarned.filter(id => !oldEarned.includes(id));
                                    justEarned.forEach(id => this.showAchievementToast(id));
                                }

                                this.user = fresh;
                                localStorage.setItem('inclusion_v4_user', JSON.stringify(this.user));

                                // Re-render local grid immediately
                                this.renderAchievements();
                            }
                        }
                        this.renderLeaderboard();
                        this.renderCounters();
                    }));

                    // 2. Requests collection — drives all cross-device real-time sync
                    this._unsubscribers.push(db.collection('requests').onSnapshot(snap => {
                        this.data.requests = snap.docs.map(d => d.data());
                        this.renderCounters();
                        this._onRequestsUpdate();
                    }));

                    // 3. Active GPS positions
                    this._unsubscribers.push(db.collection('active_gps').onSnapshot(snap => {
                        this.data.active_gps = snap.docs.map(d => d.data());
                        this.renderCounters();
                        // Restore online status after page refresh.
                        // We can only do this once data.active_gps is populated from Firestore.
                        if (this.user && !this._onlineRestored) {
                            this._onlineRestored = true;
                            const wasOnline = localStorage.getItem('inclusion_v4_online') === 'true';
                            const stillInGps = this.data.active_gps.some(u => u.email === this.user.email);
                            if (wasOnline || stillInGps) {
                                this.isOnline = true;
                                this.updateStatusUI();
                                this.startGPS();
                                // Re-register in active_gps in case the doc expired
                                db.collection('active_gps').doc(this.user.email).set({
                                    name: this.user.name, email: this.user.email,
                                    lat: null, lng: null, lastUpdate: Date.now()
                                });
                            }
                        }
                    }));
                },

                getVolunteerCardHTML: function (email) {
                    const v = this.data.volunteers.find(x => x.email === email);
                    if (!v) return `<div style="color:white; margin-top:5px;">Загрузка...</div>`;
                    const avg = (v.ratings && v.ratings.length) ? (v.ratings.reduce((a, b) => a + b, 0) / v.ratings.length).toFixed(1) : "0.0";
                    return `
                    <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; margin-top: 8px; color: white; text-align: left; line-height: 1.4;">
                        <div style="font-weight: bold; font-size: 1.05rem; margin-bottom: 2px;">${v.name}</div>
                        <div style="font-size: 0.95rem; margin-bottom: 2px;"><a href="tel:${v.phone || ''}" style="color: #60a5fa; text-decoration: none;">📞 ${v.phone || 'Нет номера'}</a></div>
                        <div style="font-size: 0.85rem; color: #ccc;">⭐ ${avg} | ✅ ${v.helpCount || 0} заданий</div>
                    </div>
                `;
                },

                // Called every time the requests collection updates (replaces setInterval polling)
                _onRequestsUpdate: function () {
                    if (this.user && this.isOnline) {

                        // Render Available Open Tasks (The "Uber Pool" Board)
                        const openZone = document.getElementById('incoming-request-zone');
                        const myTasksZone = document.getElementById('my-reserved-tasks-zone');

                        if (openZone) {
                            const openReqs = this.data.requests.filter(r =>
                                r.status === 'open' && !(r.volunteersJoined || []).includes(this.user.email)
                            );

                            // To preserve UI structure temporarily: reuse the incoming-request-zone div
                            if (openReqs.length > 0) {
                                // Sort open requests to put SOS at the very top
                                openReqs.sort((a, b) => (a.type === 'SOS' ? -1 : (b.type === 'SOS' ? 1 : 0)));

                                openZone.style.display = 'block';
                                openZone.innerHTML = `<h3 style="margin-bottom: 15px; color: var(--accent-green);"><i class="fas fa-list"></i> Доступные Заявки</h3>` +
                                    openReqs.map(r => {
                                        const isSOS = r.type === 'SOS';
                                        const cardStyle = isSOS ? `background: rgba(239, 68, 68, 0.9); color: white; border: 2px solid white; box-shadow: 0 0 20px rgba(239, 68, 68, 0.8); animation: pulse-red 1.5s infinite;` : ``;
                                        const btnColor = isSOS ? `background: white; color: #ef4444; font-weight: 900;` : `background: white; color: black; font-weight: 900;`;

                                        // Make sure sound plays for SOS if it hasn't been acknowledged
                                        if (isSOS) {
                                            // Attempt to play a standard beep alert via speech synthesis or simple audio tone (browser limits apply but we try)
                                            try {
                                                if (!this._sosAlerted) {
                                                    let a = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'); // dummy short beep base64 just to trigger interaction reqs usually
                                                    a.play().catch(e => { });
                                                    this._sosAlerted = true; // prevent infinite blasting
                                                }
                                            } catch (e) { }
                                        }

                                        return `
                                    <div class="incoming-alert" style="margin-bottom: 15px; ${cardStyle}">
                                        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                            <h4 style="margin-bottom: 5px;">${isSOS ? '🚨 ' : ''}${r.type} ${r.scheduledTime ? '<i class="fas fa-clock" style="color:var(--primary-purple);"></i> ' + new Date(r.scheduledTime).toLocaleString('ru-RU') : '<i class="fas fa-bolt"></i> Сейчас'}</h4>
                                            <span style="background: rgba(255,255,255,0.2); padding: 3px 8px; border-radius: 10px; font-size: 0.8rem;">Найдены: ${(r.volunteersJoined || []).length} / ${r.neededVolunteers || 1}</span>
                                        </div>
                                        <p style="font-size: 1rem; margin-bottom: 15px;">📍 ${r.details}</p>
                                        ${(r.volunteersJoined || []).length > 0 ? `<div style="font-size: 0.85rem; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px; margin-bottom: 15px;">Уже готовы выехать:` + (r.volunteersJoined || []).map(email => app.getVolunteerCardHTML(email)).join('') + `</div>` : ''}
                                        <button onclick="app.acceptRequest(${r.id})" class="btn btn-primary" style="${btnColor} width:100%; border: none; padding: 12px; font-size: 1.1rem; border-radius: 8px;">${isSOS ? 'ЭКСТРЕННОЕ РЕАГИРОВАНИЕ' : 'ВЗЯТЬ ЗАЯВКУ'}</button>
                                    </div>
                                    `;
                                    }).join('');
                            } else {
                                openZone.style.display = 'none';
                                this._sosAlerted = false; // Reset SOS alert flag when board clears
                            }
                        }

                        // Render My Active Tasks (open but joined, or filled and joined)
                        if (myTasksZone) {
                            const myReqs = this.data.requests.filter(r =>
                                (r.status === 'open' || r.status === 'filled') && (r.volunteersJoined || []).includes(this.user.email)
                            );

                            if (myReqs.length > 0) {
                                myTasksZone.style.display = 'block';
                                myTasksZone.innerHTML = `<h3 style="margin-bottom: 15px; color: var(--primary-blue);"><i class="fas fa-briefcase"></i> Мои Текущие Задачи</h3>` +
                                    myReqs.map(r => `
                                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; border-left: 4px solid var(--primary-blue); margin-bottom: 10px;">
                                    <div style="font-weight: bold; margin-bottom: 5px;">${r.type} ${r.scheduledTime ? '(' + new Date(r.scheduledTime).toLocaleString('ru-RU') + ')' : '(Сейчас)'}</div>
                                    <div style="font-size: 0.9rem; color: #ccc; margin-bottom: 5px;">📍 ${r.details}</div>
                                    <div style="font-size: 0.85rem; color: var(--accent-green); margin-bottom: 10px;">Статус сбора: ${(r.volunteersJoined || []).length} из ${r.neededVolunteers || 1} волонтеров подключились.</div>
                                    ${(r.volunteersJoined || []).length > 0 ? `<div style="font-size: 0.85rem; color: #aaa; margin-bottom: 10px;">Волонтеры:` + (r.volunteersJoined || []).map(email => app.getVolunteerCardHTML(email)).join('') + `</div>` : ''}
                                    <button onclick="app.cancelReservedTask(${r.id})" class="btn btn-danger" style="width: 100%; padding: 8px; font-size: 0.85rem; border-radius:8px;">ОТМЕНИТЬ УЧАСТИЕ</button>
                                </div>
                            `).join('');
                            } else {
                                myTasksZone.style.display = 'none';
                            }
                        }

                        // Hide obsolete Scheduled and Reserved zones (Now consolidated into Open/MyTasks)
                        const schZone = document.getElementById('scheduled-tasks-zone');
                        if (schZone) schZone.style.display = 'none';
                    }

                    // Render Analytics Payload unconditionally for logged-in users
                    if (this.user) {
                        this.analyzePeakTimes();
                    }

                    // Volunteer side: active task status
                    if (this.user && this.activeTaskId) {
                        const task = this.data.requests.find(r => r.id === this.activeTaskId);
                        if (task && task.status === 'Completed') {
                            alert("Подтверждено! Спасибо!"); document.getElementById('active-task-zone').style.display = 'none'; this.activeTaskId = null; this.updateStatsUI();
                        } else if (task && task.status === 'Cancelled') {
                            alert("Отменено."); document.getElementById('active-task-zone').style.display = 'none'; this.activeTaskId = null;
                        }
                    }
                    // User side: request updates > show user cabinet
                    if (this.activeRequestForUser) {
                        const req = this.data.requests.find(r => r.id === this.activeRequestForUser);

                        if (!req || req.status === 'Completed' || req.status === 'Cancelled') {
                            // User cancelled from another device, or it was completed
                            document.getElementById('user-cabinet-zone').style.display = 'none';
                            if (req && req.status === 'Cancelled') alert("Задача была отменена.");
                            this.activeRequestForUser = null;
                            localStorage.removeItem('inclusion_v4_activeReq');
                            document.getElementById('modal-searching').style.display = 'none';
                            document.getElementById('modal-match').style.display = 'none';
                            return;
                        }

                        document.getElementById('user-cabinet-zone').style.display = 'block';
                        const cab = document.getElementById('user-cabinet-content');

                        // Hide searching modal if it was up
                        document.getElementById('modal-searching').style.display = 'none';

                        if (req.status === 'open') {
                            cab.innerHTML = `
                            <h3 style="color:var(--primary-blue);"><i class="fas fa-spinner fa-spin"></i> Сбор волонтеров...</h3>
                            <p style="font-weight:bold; color:var(--accent-green); font-size: 1.1rem; margin-top: 10px;">Найдено: ${(req.volunteersJoined || []).length} из ${req.neededVolunteers || 1}</p>
                            <p style="font-size:0.9rem;">Ожидаем подключения волонтёров.</p>
                            
                            ${req.volunteersJoined && req.volunteersJoined.length > 0 ? `<div style="margin: 15px 0; color: #aaa; font-size:0.9rem;"><b>Уже подключились:</b>` + req.volunteersJoined.map(email => app.getVolunteerCardHTML(email)).join('') + `</div>` : ''}

                            <button onclick="app.userCancelTask()" class="btn btn-outline" style="width: 100%; margin-top: 15px; border-color: var(--accent-red); color: var(--accent-red);">Отменить</button>
                        `;
                        } else if (req.status === 'filled') {
                            // --- TTS VOLUNTEER ANNOUNCEMENT (plays once per request) ---
                            if (!this._requestAnnounced || this._requestAnnounced !== req.id) {
                                this._requestAnnounced = req.id;
                                if ('speechSynthesis' in window && req.volunteersJoined && req.volunteersJoined.length > 0) {
                                    const vEmail = req.volunteersJoined[0];
                                    const vol = this.data.volunteers.find(v => v.email === vEmail);
                                    if (vol) {
                                        const vName = vol.name || 'Волонтёр';
                                        const vPhone = vol.phone || 'номер не указан';
                                        // Store for "repeat" voice command
                                        this.lastVolInfo = { name: vName, phone: vPhone };
                                        const msg = `Заявка принята. Вам поможет волонтер ${vName}, его телефон ${vPhone}. Он скоро будет у вас. Скажите повтори номер, если нужно услышать снова.`;
                                        const u = new SpeechSynthesisUtterance(msg);
                                        u.lang = 'ru-RU';
                                        u.rate = 0.9;
                                        window.speechSynthesis.speak(u);
                                        console.log('[TTS] Volunteer announcement:', msg);
                                    }
                                }
                            }
                            if (req.type === 'SOS') {
                                cab.innerHTML = `
                                <h3 style="color:#ef4444; animation: pulse-red 1s infinite;"><i class="fas fa-exclamation-triangle"></i> ЭКСТРЕННЫЙ СПАСАТЕЛЬ НАЙДЕН</h3>
                                <div style="margin: 15px 0; padding:15px; background: rgba(239, 68, 68, 0.2); border: 2px solid #ef4444; border-radius: 8px; font-size:1.1rem;">
                                    <b>Первый реагирующий прибывает:</b><br>
                                    ${app.getVolunteerCardHTML(req.volunteersJoined[0])}
                                </div>
                                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: left;">
                                    <p style="font-size: 0.9rem; color: #aaa; margin-bottom: 5px;"><i class="fas fa-info-circle"></i> Инструкция:</p>
                                    <p style="font-size: 0.9rem;">1. Ожидайте прибытия спасателя.<br>2. <b>Нажмите кнопку ниже</b> когда находитесь в безопасности, чтобы закрыть вызов.</p>
                                </div>
                                <button onclick="app.userConfirmCompletion()" class="btn btn-primary" style="background:#ef4444; color:white; width: 100%; padding: 15px; font-size: 1.1rem; border:none; box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);">ВЫЗОВ ЗАВЕРШЕН (БЕЗОПАСНАЯ ЗОНА)</button>
                            `;
                            } else {
                                cab.innerHTML = `
                                <h3 style="color:var(--primary-purple);"><i class="fas fa-users"></i> Волонтеры собраны!</h3>
                                <p style="font-size: 1.1rem; margin-bottom: 5px;">Найдено: ${(req.volunteersJoined || []).length} из ${req.neededVolunteers || 1}</p>
                                <div style="margin: 15px 0; padding:10px; background: rgba(0,0,0,0.3); border-radius: 8px; font-size:0.9rem;">
                                    <b>Команда волонтёров:</b><br>
                                    ${req.volunteersJoined.map(email => app.getVolunteerCardHTML(email)).join('')}
                                </div>
                                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: left;">
                                    <p style="font-size: 0.9rem; color: #aaa; margin-bottom: 5px;"><i class="fas fa-info-circle"></i> Инструкция:</p>
                                    <p style="font-size: 0.9rem;">1. Дождитесь прибытия волонтеров.<br>2. Получите помощь.<br>3. <b>Нажмите кнопку ниже</b>, чтобы завершить заявку.</p>
                                </div>
                                <button onclick="app.userConfirmCompletion()" class="btn btn-primary" style="width: 100%; padding: 15px; font-size: 1.1rem;">ПОМОЩЬ ПОЛУЧЕНА (ЗАВЕРШИТЬ)</button>
                            `;
                            }
                        }
                    }
                },

                // Automated Timer Check
                checkScheduledTimers: function () {
                    const now = Date.now();
                    this.data.requests.forEach(req => {
                        if (req.status === 'Reserved' && req.scheduledTime) {
                            const schedTimeMs = new Date(req.scheduledTime).getTime();
                            if (now >= schedTimeMs) {
                                console.log("Auto-starting reserved task", req.id);
                                // Set startTime to EXACTLY the scheduled time for fair logging
                                db.collection('requests').doc(String(req.id)).update({
                                    status: 'Accepted',
                                    startTime: schedTimeMs
                                });
                                // If this volunteer is the one who claimed it, UI updates via onSnapshot -> activeTaskId
                                if (this.user && req.volunteerEmail === this.user.email) {
                                    this.activeTaskId = req.id;
                                    document.getElementById('active-task-zone').style.display = 'block';
                                    alert("Запланированное время наступило! Таймер автоматически запущен.");
                                }
                            }
                        }
                    });
                },

                // load/save are no-ops: data flows via Firestore onSnapshot
                load: function () { },
                save: function () { this.renderCounters(); this.renderLeaderboard(); },



                updateNavigationUI: function (pageId) {
                    // Remove class from ALL links
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('is-active-page');
                    });
                    // Find target link by onclick attribute and add class
                    const activeLink = document.querySelector(`.nav-link[onclick*="${pageId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('is-active-page');
                    }
                },

                nav: function (p) {
                    // 1. Скрываем ВСЕ разделы (снимаем класс active-page)
                    document.querySelectorAll('.page-section').forEach(e => {
                        e.classList.remove('active-page');
                        e.classList.remove('centered-content');
                        e.style.display = ''; // Убираем инлайн стили
                    });

                    // 2. Показываем нужный раздел, применяем центрирование если это не главная
                    const activeEl = document.getElementById(`page-${p}`);
                    if (activeEl) {
                        activeEl.classList.add('active-page');
                        if (p !== 'home') {
                            activeEl.classList.add('centered-content');
                        }
                    }

                    // Trigger hard-state navigation glue
                    this.updateNavigationUI(p);

                    if (p === 'leaderboard') this.renderLeaderboard();
                },

                // --- AUTH & VALIDATION ---
                validateName: function (n) { return /^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(n); },
                validatePhone: function (p) { return /^\+\d{11}$/.test(p); },

                switchAuth: function (m) {
                    document.getElementById('vol-reg-view').style.display = m === 'register' ? 'block' : 'none';
                    document.getElementById('vol-login-view').style.display = m === 'login' ? 'block' : 'none';
                },

                showDashboard: function () {
                    ['vol-reg-view', 'vol-login-view', 'vol-verify-view'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
                    document.getElementById('vol-dashboard-view').style.display = 'block';
                    this.updateStatsUI();

                    // Check if online status should be restored from localStorage
                    const wasOnline = localStorage.getItem('inclusion_v4_online') === 'true';
                    const inPool = this.data.active_gps.find(u => u.email === this.user.email);

                    // If we are restored as online or are already in the pool, sync the state
                    if (wasOnline || inPool) {
                        this.isOnline = true;
                        this.startGPS();
                    } else {
                        this.isOnline = false;
                    }

                    this.updateStatusUI();
                },

                regVolunteer: function (e) {
                    e.preventDefault();
                    const em = document.getElementById('v-email').value;
                    const name = document.getElementById('v-name').value;
                    const phone = document.getElementById('v-phone').value;

                    if (!this.validateName(name)) return alert("Имя должно содержать только буквы!");
                    if (!this.validatePhone(phone)) return alert("Телефон должен быть в формате +77001234567 (только цифры и +)");
                    if (this.data.volunteers.find(v => v.email === em)) return alert("Email занят");

                    this.tempRegData = {
                        name: name, email: em, phone: phone,
                        password: document.getElementById('v-pass').value,
                        helpCount: 0, totalMinutes: 0, ratings: []
                    };
                    this.tempCode = Math.floor(1000 + Math.random() * 9000).toString();

                    emailjs.send(this.serviceID, "template_3bbi74j", { email: em, code: this.tempCode }).then(() => {
                        document.getElementById('vol-reg-view').style.display = 'none';
                        document.getElementById('vol-verify-view').style.display = 'block';
                    }, (err) => { alert("Ошибка email: " + err); });
                },

                checkCode: function () {
                    if (document.getElementById('verify-code-input').value === this.tempCode) {
                        this.user = this.tempRegData;
                        // Persist to Firestore — will appear on all devices instantly
                        db.collection('volunteers').doc(this.user.email).set(this.user).then(() => {
                            localStorage.setItem('inclusion_v4_user', JSON.stringify(this.user));
                            this.showDashboard();
                        }).catch(err => alert('Ошибка Firebase: ' + err));
                    } else alert("Неверный код");
                },

                loginVolunteer: function (e) {
                    e.preventDefault();
                    const em = document.getElementById('login-email').value;
                    const pw = document.getElementById('login-pass').value;
                    // Look up volunteer from Firestore-synced local cache
                    const u = this.data.volunteers.find(v => v.email === em && v.password === pw);
                    if (u) {
                        this.user = u;
                        localStorage.setItem('inclusion_v4_user', JSON.stringify(u));
                        this.showDashboard();
                    } else alert("Ошибка входа");
                },

                logoutVol: function () {
                    this.isOnline = false;
                    this.stopGPS();
                    // Clear persisted online state on explicit logout
                    localStorage.removeItem('inclusion_v4_online');
                    this._unsubscribers.forEach(fn => fn());
                    this._unsubscribers = [];
                    localStorage.removeItem('inclusion_v4_user');
                    this.user = null;
                    alert("Вы вышли из системы.");
                    location.reload();
                },

                updateStatsUI: function () {
                    if (!this.user) return;
                    // Always read from the Firestore-synced local cache
                    const fresh = this.data.volunteers.find(v => v.email === this.user.email);
                    if (fresh) this.user = fresh;
                    document.getElementById('vol-total-helps').innerText = this.user.helpCount || 0;
                    const totalMins = this.user.totalMinutes || 0;
                    document.getElementById('stat-hours').innerText = `${Math.floor(totalMins / 60)}ч ${Math.floor(totalMins % 60)}м`;
                    const avg = (this.user.ratings && this.user.ratings.length) ? (this.user.ratings.reduce((a, b) => a + b, 0) / this.user.ratings.length).toFixed(1) : '0.0';
                    document.getElementById('stat-rating').innerHTML = `${avg} <i class="fas fa-star" style="color:gold;"></i>`;
                },

                renderLeaderboard: function () {
                    const tbody = document.getElementById('leaderboard-body');
                    tbody.innerHTML = '';
                    const sorted = [...this.data.volunteers].sort((a, b) => {
                        const rateA = (a.ratings && a.ratings.length) ? (a.ratings.reduce((x, y) => x + y, 0) / a.ratings.length) : 0;
                        const rateB = (b.ratings && b.ratings.length) ? (b.ratings.reduce((x, y) => x + y, 0) / b.ratings.length) : 0;
                        if (rateB !== rateA) return rateB - rateA;
                        return (b.totalMinutes || 0) - (a.totalMinutes || 0);
                    });
                    sorted.forEach((v, idx) => {
                        const avg = (v.ratings && v.ratings.length) ? (v.ratings.reduce((a, b) => a + b, 0) / v.ratings.length).toFixed(1) : "0.0";
                        const h = Math.floor((v.totalMinutes || 0) / 60);
                        tbody.innerHTML += `<tr><td class="leaderboard-rank">#${idx + 1}</td><td><span class="profile-link" onclick="window.app.showPublicProfile('${v.email}', event)" style="color:white; cursor:pointer; text-decoration:underline;">${v.name}</span></td><td>${avg} <i class="fas fa-star" style="color:gold; font-size:0.8rem;"></i></td><td>${h} ч.</td></tr>`;
                    });
                },

                toggleOnline: function () {
                    this.isOnline = !this.isOnline;
                    // Persist online state so it survives page refresh
                    localStorage.setItem('inclusion_v4_online', this.isOnline ? 'true' : 'false');
                    this.updateStatusUI();
                    if (this.isOnline) {
                        // Immediately write placeholder doc so volunteer is in the pool instantly
                        db.collection('active_gps').doc(this.user.email).set({
                            name: this.user.name, email: this.user.email,
                            lat: null, lng: null, lastUpdate: Date.now()
                        });
                        this.startGPS();
                    } else {
                        this.stopGPS();
                    }
                },
                updateStatusUI: function () {
                    const btn = document.getElementById('toggle-online-btn');
                    const dot = document.getElementById('gps-status-dot');
                    const txt = document.getElementById('gps-status-text');
                    if (this.isOnline) {
                        btn.innerText = "ONLINE"; btn.className = "btn btn-primary";
                        dot.style.background = "var(--accent-green)"; dot.style.animation = "pulse-green 1.5s infinite";
                        txt.innerText = "Вы Онлайн (Ждем заявки)";
                    } else {
                        btn.innerText = "GO ONLINE"; btn.className = "btn btn-danger";
                        dot.style.background = "grey"; dot.style.animation = "none";
                        txt.innerText = "Вы Оффлайн";
                    }
                },
                startGPS: function () {
                    if (!navigator.geolocation) return;
                    if (this.geoId) navigator.geolocation.clearWatch(this.geoId);
                    this.geoId = navigator.geolocation.watchPosition(p => {
                        // Write GPS position directly to Firestore — visible on all devices
                        const rec = { name: this.user.name, email: this.user.email, lat: p.coords.latitude, lng: p.coords.longitude, lastUpdate: Date.now() };
                        db.collection('active_gps').doc(this.user.email).set(rec);
                    }, e => console.log(e), { enableHighAccuracy: true });
                },
                stopGPS: function () {
                    if (this.geoId) navigator.geolocation.clearWatch(this.geoId);
                    if (this.user) db.collection('active_gps').doc(this.user.email).delete();
                },
                startPolling: function () { /* Replaced by Firestore onSnapshot in setupListeners() */ },

                // --- REQUEST & LOOP LOGIC ---
                toggleTiming: function () {
                    const timing = document.getElementById('r-timing').value;
                    const dtGroup = document.getElementById('r-datetime-group');
                    const dtInput = document.getElementById('r-datetime');
                    if (timing === 'scheduled') {
                        dtGroup.style.display = 'block';
                        dtInput.required = true;
                    } else {
                        dtGroup.style.display = 'none';
                        dtInput.required = false;
                    }
                },

                submitRequest: function (e) {
                    e.preventDefault();
                    const name = document.getElementById('r-name').value;
                    const phone = document.getElementById('r-phone').value;
                    const details = document.getElementById('r-details').value;
                    const type = document.getElementById('r-type').value;
                    const timing = document.getElementById('r-timing') ? document.getElementById('r-timing').value : 'now';

                    const needed = parseInt(document.getElementById('r-needed').value) || 1;

                    if (!this.validateName(name)) return alert("Имя должно содержать только буквы!");
                    if (!this.validatePhone(phone)) return alert("Телефон должен быть в формате +77001234567");

                    let scheduledTime = null;
                    if (timing === 'scheduled') {
                        scheduledTime = document.getElementById('r-datetime').value;
                        if (!scheduledTime) return alert("Пожалуйста, выберите дату и время.");
                        if (new Date(scheduledTime) < new Date()) return alert("Нельзя выбрать прошедшее время.");
                    }

                    const req = {
                        id: Date.now(),
                        name, phone,
                        type, details,
                        neededVolunteers: needed,
                        volunteersJoined: [],
                        status: 'open',
                        declined_vols: [],
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    };

                    const processRequest = (lat, lng, gpsText) => {
                        if (lat && lng) { req.lat = lat; req.lng = lng; }
                        req.gps_text = gpsText;

                        if (timing === 'scheduled') {
                            req.scheduledTime = scheduledTime;
                        }

                        // ===== Send email ONLY for SOS broadcast =====
                        const isSOS = (req.type === 'SOS');
                        if (isSOS) {
                            const subjectType = '🚨 SOS-ВЫЗОВ';
                            const urgencyHeader = 'ВНИМАНИЕ! СРОЧНЫЙ SOS-ЗАПРОС!';
                            const mapsLink = (req.lat && req.lng)
                                ? `https://www.google.com/maps?q=${req.lat},${req.lng}`
                                : 'Координаты не указаны';

                            emailjs.send(this.serviceID, "template_wb5j0ce", {
                                email: 'inclusion.petropavl@gmail.com',
                                user_name: req.name,
                                user_phone: req.phone,
                                category: 'SOS',
                                request_details: req.details + (gpsText || ''),
                                google_maps_link: mapsLink,
                                subject_type: subjectType,
                                urgency_header: urgencyHeader
                            }).then((response) => {
                                console.log('[SOS] Broadcast email sent:', response);
                            }, (error) => {
                                console.error('[SOS] Broadcast email failed:', error);
                            });
                        }

                        // ===== Then proceed with Firestore and UI =====
                        this.activeRequestForUser = req.id;
                        localStorage.setItem('inclusion_v4_activeReq', req.id);

                        document.getElementById('user-cabinet-zone').style.display = 'block';
                        const cab = document.getElementById('user-cabinet-content');
                        cab.innerHTML = `<h3 style="color:var(--primary-blue);"><i class="fas fa-search"></i> Ищем волонтеров (0/${req.neededVolunteers})...</h3><p>Ваша заявка размещена на доске задач.</p>`;

                        this.nav('request');

                        db.collection('requests').doc(String(req.id)).set(req).then(() => {
                            console.log('[Firestore] Request saved:', req.id);
                        }).catch(err => {
                            console.error('Firestore Error:', err);
                            alert('Ошибка связи с сервером.');
                        });
                    };

                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            p => processRequest(p.coords.latitude, p.coords.longitude, ` [GPS: ${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}]`),
                            () => processRequest(null, null, " [GPS Fail]")
                        );
                    } else {
                        processRequest(null, null, "");
                    }
                },

                saveScheduled: function (req) {
                    this.activeRequestForUser = req.id;
                    localStorage.setItem('inclusion_v4_activeReq', req.id);
                    db.collection('requests').doc(String(req.id)).set(req).then(() => {
                        alert("Ваша заявка успешно запланирована! Волонтеры увидят ее в расписании.");
                        this.nav('home');
                        document.getElementById('r-name').value = '';
                        document.getElementById('r-details').value = '';
                    }).catch(err => {
                        console.error("Firestore Error:", err);
                        alert("Ошибка связи с сервером.");
                    });
                },

                initiateSearch: function (req) {
                    // Ensure we navigate to the request page so the user cabinet is visible during search
                    this.nav('request');

                    // Сразу показываем UI старой модалки как запасной вариант (хотя основной UI теперь User Cabinet)
                    document.getElementById('modal-searching').style.display = 'flex';
                    const statusEl = document.getElementById('search-status-details');
                    if (statusEl) statusEl.innerText = "Формируем экстренный поиск...";

                    db.collection('active_gps').get().then(snap => {
                        this.activeRequestForUser = req.id;
                        localStorage.setItem('inclusion_v4_activeReq', req.id);

                        // Show searching in the cabinet proactively
                        document.getElementById('user-cabinet-zone').style.display = 'block';
                        const cab = document.getElementById('user-cabinet-content');
                        cab.innerHTML = `<h3 style="color:var(--primary-blue);"><i class="fas fa-spinner fa-spin"></i> Поиск волонтеров...</h3><p>Пожалуйста, подождите. Система ищет свободных помощников.</p>`;

                        const existingIdx = this.data.requests.findIndex(r => r.id === req.id);
                        if (existingIdx >= 0) this.data.requests[existingIdx] = req;
                        else this.data.requests.push(req);

                        db.collection('requests').doc(String(req.id)).set(req).then(() => {
                            this.findVolunteerLoop(req.id, 0);
                        });
                    }).catch(err => {
                        console.error("Firestore Error:", err);
                        if (statusEl) statusEl.innerText = "Ошибка связи с сервером.";
                    });
                },

                findVolunteerLoop: function (reqId, idx) {
                    const req = this.data.requests.find(r => r.id === reqId);
                    if (!req || req.status !== 'Searching') return;

                    const statusEl = document.getElementById('search-status-details');

                    if (this.data.active_gps.length === 0) {
                        if (statusEl) statusEl.innerHTML = "<span style='color: #ff4444;'>Ожидание волонтёров...<br><small>Повторим попытку через 8 секунд...</small></span>";
                        setTimeout(() => this.findVolunteerLoop(reqId, 0), 8000);
                        return;
                    }

                    let candidates = this.data.active_gps.filter(v =>
                        !(req.declined_vols || []).includes(v.email));

                    if (req.lat && candidates.length > 0) {
                        candidates = candidates.sort((a, b) =>
                            (Math.abs(req.lat - a.lat) + Math.abs(req.lng - a.lng)) -
                            (Math.abs(req.lat - b.lat) + Math.abs(req.lng - b.lng)));
                    }

                    if (candidates.length === 0 || idx >= candidates.length) {
                        if (statusEl) {
                            statusEl.innerHTML = "Нет доступных волонтёров.<br><small>Повторим попытку через 8 секунд...</small>";
                        }
                        setTimeout(() => this.findVolunteerLoop(reqId, 0), 8000);
                        return;
                    }

                    const candidate = candidates[idx];
                    db.collection('requests').doc(String(reqId)).update({
                        current_target_email: candidate.email,
                        status: 'Searching'
                    });
                    req.current_target_email = candidate.email;

                    if (statusEl) statusEl.innerText = `Оповещаем: ${candidate.name}...`;

                    const isSOS = (req.type === 'SOS');
                    const subjectType = isSOS ? '🚨 SOS-ВЫЗОВ' : 'Новая заявка';
                    const urgencyHeader = isSOS ? 'ВНИМАНИЕ! СРОЧНЫЙ SOS-ЗАПРОС!' : 'Поступил новый запрос на помощь';
                    const formattedDetails = req.details + (req.gps_text || '');
                    const mapLink = (req.lat && req.lng) ? `https://www.google.com/maps?q=${req.lat},${req.lng}` : 'Координаты не указаны';

                    emailjs.send(this.serviceID, "template_wb5j0ce", {
                        subject_type: subjectType,
                        urgency_header: urgencyHeader,
                        email: candidate.email,
                        vol_name: candidate.name,
                        user_name: req.name,
                        user_phone: req.phone,
                        category: req.type,
                        request_details: formattedDetails,
                        google_maps_link: mapLink
                    }).then((response) => {
                        console.log('Email sent to volunteer:', response);
                    }, (error) => {
                        console.error('Email failed:', error);
                        alert('Ошибка отправки email волонтеру: ' + JSON.stringify(error));
                    });

                    let ticks = 120;
                    const timer = setInterval(() => {
                        const freshReq = this.data.requests.find(r => r.id === reqId);
                        if (!freshReq || freshReq.status === 'Accepted') { clearInterval(timer); return; }
                        if (freshReq.status === 'Skipped') {
                            clearInterval(timer);
                            db.collection('requests').doc(String(reqId)).update({ status: 'Searching', current_target_email: null });
                            this.findVolunteerLoop(reqId, 0);
                            return;
                        }
                        ticks--;
                        if (ticks <= 0) {
                            clearInterval(timer);
                            const newDeclined = [...(freshReq.declined_vols || []), candidate.email];
                            db.collection('requests').doc(String(reqId)).update({
                                declined_vols: newDeclined,
                                current_target_email: null
                            });
                            this.findVolunteerLoop(reqId, idx + 1);
                        }
                    }, 500);
                },


                acceptRequest: function (reqId) {
                    const req = this.data.requests.find(r => r.id === reqId);
                    if (!req) return;

                    const currentVols = req.volunteersJoined || [];
                    if (currentVols.includes(this.user.email)) return;

                    // Double check if it's already filled before atomic update
                    if (currentVols.length >= (req.neededVolunteers || 1)) {
                        alert("К сожалению, эта заявка уже укомплектована волонтерами.");
                        return;
                    }

                    const newVols = [...currentVols, this.user.email];
                    const newStatus = (newVols.length >= (req.neededVolunteers || 1)) ? 'filled' : 'open';

                    db.collection('requests').doc(String(req.id)).update({
                        status: newStatus,
                        volunteersJoined: newVols,
                        startTime: newVols.length === 1 ? Date.now() : req.startTime
                    }).then(() => {
                        // --- Send requester's contact details to the volunteer via email ---
                        const mapsLink = (req.lat && req.lng)
                            ? `https://www.google.com/maps?q=${req.lat},${req.lng}`
                            : 'Координаты не указаны';
                        const isSOS = (req.type === 'SOS');

                        emailjs.send(this.serviceID, "template_wb5j0ce", {
                            email: this.user.email,
                            vol_name: this.user.name,
                            user_name: req.name,
                            user_phone: req.phone,
                            category: req.type,
                            request_details: req.details + (req.gps_text || ''),
                            google_maps_link: mapsLink,
                            subject_type: isSOS ? '🚨 SOS-ВЫЗОВ' : 'Новая заявка',
                            urgency_header: isSOS ? 'ВНИМАНИЕ! СРОЧНЫЙ SOS-ЗАПРОС!' : 'Поступил новый запрос на помощь'
                        }).then((response) => {
                            console.log('Email sent to volunteer:', response);
                        }, (error) => {
                            console.error('Email to volunteer failed:', error);
                        });

                        if (isSOS && newStatus === 'filled') {
                            alert('ВЫ ПЕРВЫЙ СПАСАТЕЛЬ! Экстренная заявка закреплена за вами. Контактные данные отправлены вам на почту!');
                        } else {
                            alert('Успешно! Вы присоединились к заявке. Контактные данные отправлены вам на почту!');
                        }
                    }).catch(e => {
                        console.error('Join Error:', e);
                        alert('Ошибка связи.');
                    });
                },

                cancelReservedTask: function (reqId) {
                    const req = this.data.requests.find(r => r.id === reqId);
                    if (!req) return;
                    if (!confirm("Вы уверены, что хотите отменить свое участие? Заявка вернется в общий список.")) return;

                    // If the task was 'filled', someone dropping out inherently makes it 'open' again to fetch replacements
                    const newStatus = (req.status !== 'completed' && req.status !== 'cancelled') ? 'open' : req.status;

                    db.collection('requests').doc(String(req.id)).update({
                        status: newStatus,
                        volunteersJoined: firebase.firestore.FieldValue.arrayRemove(this.user.email)
                    }).catch(e => console.error("Drop-out Error:", e));
                },

                onMatchFound: function (req) {
                    // Now handled entirely by the user-cabinet-zone in _onRequestsUpdate
                },

                userCancelTask: function () {
                    if (!this.activeRequestForUser) return;
                    const req = this.data.requests.find(r => r.id === this.activeRequestForUser);
                    if (!req) return;

                    if (confirm("Вы уверены, что хотите отменить эту заявку?")) {
                        db.collection('requests').doc(String(req.id)).update({
                            status: 'cancelled',
                            volunteersJoined: [],
                            endTime: Date.now()
                        }).then(() => {
                            this.activeRequestForUser = null;
                            localStorage.removeItem('inclusion_v4_activeReq');
                            document.getElementById('user-cabinet-zone').style.display = 'none';
                            alert("Заявка успешно отменена.");
                        }).catch(e => {
                            console.error("Cancellation Error: ", e);
                            alert("Ошибка при отмене заявки.");
                        });
                    }
                },

                userConfirmCompletion: function () {
                    if (!this.activeRequestForUser) return;
                    const req = this.data.requests.find(r => r.id === this.activeRequestForUser);
                    if (!req) return;
                    const endTime = Date.now();
                    const mins = req.startTime ? Math.max(1, Math.round((endTime - req.startTime) / 60000)) : 1;

                    db.collection('requests').doc(String(req.id)).update({ status: 'completed', endTime });

                    // Ensure ALL joined volunteers get credited
                    if (req.volunteersJoined && req.volunteersJoined.length > 0) {
                        this.ratedVolunteers = {};

                        const ratingsHtml = req.volunteersJoined.map(email => {
                            const vol = this.data.volunteers.find(v => v.email === email);
                            const name = vol ? vol.name : email;
                            this.ratedVolunteers[email] = 0; // Initialize rating

                            db.collection('volunteers').doc(email).update({
                                helpCount: (vol ? (vol.helpCount || 0) : 0) + 1,
                                totalMinutes: (vol ? (vol.totalMinutes || 0) : 0) + mins
                            });

                            const safeId = email.replace(/[@.]/g, '');
                            return `
                            <div style="margin-bottom: 15px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px;">
                                <p style="margin-bottom: 5px; text-align: left;">Оцените: <b><span class="profile-link" onclick="window.app.showPublicProfile('${email}', event)" style="color:white; cursor:pointer; text-decoration:underline;">${name}</span></b></p>
                                <div class="star-rating" style="text-align: left;" id="stars-${safeId}">
                                    <i class="fas fa-star" onclick="app.rateVol('${email}', 1)" style="color:#ccc; cursor:pointer; font-size:1.2rem; margin-right:5px;"></i>
                                    <i class="fas fa-star" onclick="app.rateVol('${email}', 2)" style="color:#ccc; cursor:pointer; font-size:1.2rem; margin-right:5px;"></i>
                                    <i class="fas fa-star" onclick="app.rateVol('${email}', 3)" style="color:#ccc; cursor:pointer; font-size:1.2rem; margin-right:5px;"></i>
                                    <i class="fas fa-star" onclick="app.rateVol('${email}', 4)" style="color:#ccc; cursor:pointer; font-size:1.2rem; margin-right:5px;"></i>
                                    <i class="fas fa-star" onclick="app.rateVol('${email}', 5)" style="color:#ccc; cursor:pointer; font-size:1.2rem;"></i>
                                </div>
                            </div>
                        `;
                        }).join('');
                        document.getElementById('dynamic-ratings').innerHTML = ratingsHtml;
                    } else {
                        document.getElementById('dynamic-ratings').innerHTML = "<p>Команда не была сформирована.</p>";
                        this.ratedVolunteers = {};
                    }

                    // Clear local persistence
                    this.pendingReviewReqId = this.activeRequestForUser;
                    this.activeRequestForUser = null;
                    localStorage.removeItem('inclusion_v4_activeReq');

                    document.getElementById('user-cabinet-zone').style.display = 'none';
                    document.getElementById('modal-match').style.display = 'none';
                    document.getElementById('modal-review').style.display = 'flex';
                },

                rateVol: function (email, n) {
                    this.ratedVolunteers[email] = n;
                    const safeId = email.replace(/[@.]/g, '');
                    const stars = document.querySelectorAll(`#stars-${safeId} i`);
                    stars.forEach((el, i) => el.style.color = i < n ? 'gold' : '#ccc');
                },

                submitReview: function () {
                    const emails = Object.keys(this.ratedVolunteers || {});
                    let allRated = true;

                    emails.forEach(email => {
                        if (this.ratedVolunteers[email] === 0) allRated = false;
                    });

                    if (!allRated && emails.length > 0) {
                        alert("Пожалуйста, поставьте оценку каждому волонтеру перед отправкой.");
                        return;
                    }

                    Promise.all(emails.map(email => {
                        const rating = this.ratedVolunteers[email];
                        if (rating > 0) {
                            const vol = this.data.volunteers.find(v => v.email === email);
                            if (vol) {
                                const updatedRatings = [...(vol.ratings || []), rating];
                                const currentReq = this.data.requests.find(r => r.id === this.pendingReviewReqId);
                                const newAchievements = this.evaluateAchievements(vol, currentReq, updatedRatings, this.data.requests);

                                return db.collection('volunteers').doc(email).update({
                                    ratings: updatedRatings,
                                    earnedAchievements: newAchievements
                                });
                            }
                        }
                        return Promise.resolve();
                    })).then(() => {
                        this.pendingReviewReqId = null;
                        document.getElementById('modal-review').style.display = 'none';
                        alert("Спасибо за отзыв!");
                        this.nav('home');
                    }).catch(e => {
                        console.error("Оценка: ", e);
                        alert("Ошибка отправки оценок. Закрываем окно.");
                        document.getElementById('modal-review').style.display = 'none';
                        this.nav('home');
                    });
                },

                loginAdmin: function () {
                    if (document.getElementById('admin-pass').value === 'admin123') {
                        document.getElementById('admin-login-view').style.display = 'none';
                        document.getElementById('admin-dash-view').style.display = 'block';
                    }
                },
                renderAdmin: function () { document.getElementById('admin-data').innerText = JSON.stringify(this.data, null, 2); },
                resetDatabase: async function () {
                    if (prompt("ВНИМАНИЕ: Это удалит ВСЕ данные (волонтеров, запросы, gps, ratings).\n\nВведите 'DELETE', чтобы подтвердить:") === "DELETE") {
                        try {
                            const collections = ['volunteers', 'requests', 'active_gps', 'ratings'];
                            for (let c of collections) {
                                const snapshot = await db.collection(c).get();
                                const batch = db.batch();
                                snapshot.docs.forEach(doc => {
                                    batch.delete(doc.ref);
                                });
                                await batch.commit();
                            }
                            alert("База данных успешно полностью очищена! Перезагрузите страницу.");
                            window.location.reload();
                        } catch (e) {
                            console.error(e);
                            alert("Ошибка при очистке БД: " + e.message);
                        }
                    }
                },
                renderCounters: function () {
                    try {
                        const activeReqs = this.data.requests.filter(r => ['open', 'filled'].includes(r.status));
                        // Active Volunteers counter counts the length of volunteersJoined across all active requests
                        const vols = activeReqs.reduce((sum, r) => sum + (r.volunteersJoined || []).length, 0);

                        const reqs = this.data.requests.filter(r => r.status === 'completed').length;
                        const inprog = activeReqs.length;

                        document.getElementById('count-volunteers').innerText = vols;
                        document.getElementById('count-requests').innerText = reqs;

                        // Update New Glow Circles
                        const glowVol = document.getElementById('glow-vol-count');
                        const glowReq = document.getElementById('glow-req-count');
                        const glowInprog = document.getElementById('glow-inprog-count');
                        if (glowVol) glowVol.innerText = vols;
                        if (glowReq) glowReq.innerText = reqs;
                        if (glowInprog) glowInprog.innerText = inprog;

                    } catch (e) { }
                },

                // --- ANALYTICS: MARKET INTELLIGENCE ---
                analyzePeakTimes: function () {
                    const zone = document.getElementById('analytics-heatmap-zone');
                    if (!zone || this.data.requests.length === 0) return;

                    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
                    const dayFullNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среду', 'Четверг', 'Пятницу', 'Субботу'];

                    // Initialize Matrix: Days 0-6
                    let matrix = {};
                    for (let d = 0; d < 7; d++) {
                        matrix[d] = { count: 0, hours: Array(24).fill(0) };
                    }

                    let maxGlobalCount = 0;
                    let topDay = 0;
                    let topHour = 0;

                    // Parse Payload Logs
                    this.data.requests.forEach(req => {
                        let date;
                        if (req.createdAt && req.createdAt.seconds) {
                            date = new Date(req.createdAt.seconds * 1000); // Firestore format
                        } else if (req.createdAt && typeof req.createdAt === 'number') {
                            date = new Date(req.createdAt); // Fallback Date.now() format
                        } else if (req.createdAt && typeof req.createdAt.toDate === 'function') {
                            date = req.createdAt.toDate(); // JS Date
                        } else {
                            // Fallback to avoid hiding the widget if dates are missing
                            date = new Date();
                        }

                        const d = date.getDay();
                        const h = date.getHours();

                        matrix[d].count += 1;
                        matrix[d].hours[h] += 1;

                        // Track absolute peak across the matrix for percentage scaling
                        if (matrix[d].count > maxGlobalCount) {
                            maxGlobalCount = matrix[d].count;
                            topDay = d;
                            topHour = h;
                        }
                    });

                    if (maxGlobalCount === 0) {
                        zone.style.display = 'none';
                        return;
                    }

                    // Bucket scaling: Render 7 bars for each day
                    const gridHtml = dayNames.map((dayLabel, index) => {
                        // Height percentage relative to the busiest day
                        const pct = maxGlobalCount > 0 ? Math.round((matrix[index].count / maxGlobalCount) * 100) : 0;
                        // Apply visual clamp so empty days still show a minimal silver block
                        const visualHeight = pct < 5 ? 5 : pct;
                        const colorAttr = pct === 100 ? 'background: var(--accent-green);' : '';

                        return `
                    <div class="heat-bar-wrapper">
                        <div class="heat-bar" style="height: ${visualHeight}%; ${colorAttr}" title="${matrix[index].count} заявок"></div>
                        <div class="heat-label">${dayLabel}</div>
                    </div>
                    `;
                    }).join('');

                    // Format the peak hour window
                    const hourWindowEnd = (topHour + 2) % 24;
                    const topHourStr = `${topHour.toString().padStart(2, '0')}:00`;
                    const endHourStr = `${hourWindowEnd.toString().padStart(2, '0')}:00`;

                    zone.style.display = 'block';
                    zone.innerHTML = `
                    <div class="analytics-card">
                        <div class="analytics-tip">
                            <i class="fas fa-chart-line"></i> 💡 Совет: Больше всего заявок поступает в <b>${dayFullNames[topDay]}</b> между <b>${topHourStr} - ${endHourStr}</b>. Ваша помощь нужна именно тогда!
                        </div>
                        <div class="heatmap-grid" style="align-items: flex-end;">
                            ${gridHtml}
                        </div>
                    </div>
                `;
                },

                sos: function () {
                    if (confirm("🚨 Запустить экстренный поиск (SOS)?")) {
                        const req = {
                            id: Date.now(),
                            name: "Экстренный вызов",
                            phone: "Режим SOS",
                            type: "SOS",
                            details: "Срочная помощь! НЕМЕДЛЕННО!",
                            status: 'open',
                            neededVolunteers: 1, // FORCE FIRST-RESPONDER LOCK
                            volunteersJoined: [],
                            declined_vols: [],
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            gps_text: " [GPS Pending]",
                            sosTriggeredAt: Date.now()
                        };

                        const processSOS = (lat, lng, gpsText) => {
                            if (lat && lng) { req.lat = lat; req.lng = lng; }
                            req.gps_text = gpsText;

                            // Push SOS directly to the open board
                            this.activeRequestForUser = req.id;
                            localStorage.setItem('inclusion_v4_activeReq', req.id);

                            document.getElementById('user-cabinet-zone').style.display = 'block';
                            const cab = document.getElementById('user-cabinet-content');
                            cab.innerHTML = `<h3 style="color:#ef4444; animation: pulse-red 1s infinite;"><i class="fas fa-exclamation-triangle"></i> SOS ИЩЕМ ВОЛОНТЕРОВ!</h3><p>Ваша экстренная заявка разослана.</p>`;

                            this.nav('request');

                            db.collection('requests').doc(String(req.id)).set(req).then(() => {
                                console.log('[SOS] Request saved to Firestore:', req.id);

                                // --- Immediate SOS EmailJS Notification ---
                                const mapsLink = (req.lat && req.lng)
                                    ? `https://www.google.com/maps?q=${req.lat},${req.lng}`
                                    : 'Координаты не указаны';

                                emailjs.send(this.serviceID, "template_wb5j0ce", {
                                    subject_type: '🚨 SOS-ВЫЗОВ',
                                    urgency_header: 'ВНИМАНИЕ! СРОЧНЫЙ SOS-ЗАПРОС!',
                                    user_name: req.name,
                                    user_phone: req.phone,
                                    category: 'SOS',
                                    request_details: req.details + (req.gps_text || ''),
                                    google_maps_link: mapsLink
                                }).then((response) => {
                                    console.log('Email sent to volunteer:', response);
                                }, (error) => {
                                    console.error('Email failed:', error);
                                    alert('Ошибка отправки SOS email: ' + JSON.stringify(error));
                                });

                                // Start the volunteer search loop
                                this.initiateSearch(req);

                            }).catch(err => {
                                console.error("Firestore Error:", err);
                                alert("Ошибка связи с сервером при SOS.");
                            });
                        };

                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                                p => processSOS(p.coords.latitude, p.coords.longitude, ` [GPS: ${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}]`),
                                () => processSOS(null, null, " [GPS Fail]")
                            );
                        } else {
                            processSOS(null, null, "");
                        }
                    }
                }
            };

            // Animated Counter
            function animateCounter(element, target) {
                if (!element) return;
                let current = 0;
                const increment = target / 60; // 60 frames
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        element.textContent = Math.round(target);
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.round(current);
                    }
                }, 30);
            }

            // Scroll Reveal Observer
            function initScrollReveal() {
                const reveals = document.querySelectorAll('.glass-panel');

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('reveal', 'active');
                        }
                    });
                }, { threshold: 0.1 });

                reveals.forEach(reveal => {
                    reveal.classList.add('reveal');
                    observer.observe(reveal);
                });
            }

            // Back to Top Button
            function initBackToTop() {
                const btn = document.getElementById('back-to-top');
                if (!btn) return;

                window.addEventListener('scroll', () => {
                    if (window.scrollY > 300) {
                        btn.classList.add('show');
                    } else {
                        btn.classList.remove('show');
                    }
                });
            }

            // Generate Particles for Starfield Effect
            function createParticles() {
                const container = document.getElementById('particles-container');
                if (!container) return;

                const particleCount = 50; // Lightweight: only 50 particles
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.top = Math.random() * 100 + '%';
                    particle.style.animationDelay = Math.random() * 20 + 's';
                    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
                    container.appendChild(particle);
                }
            }

            document.addEventListener('DOMContentLoaded', () => {
                // "Nuke" DOM Element Detachment to bypass CSS overrides internally
                const popoverUI = document.getElementById('modal-public-profile');
                if (popoverUI) {
                    document.body.appendChild(popoverUI); // Detach from inline rendering context and append directly to DOM root!
                }

                // Attaching Application to Global Window to guarantee scoping hooks trigger 
                window.app = app;

                /* Particles disabled per user clean UI request */
                initScrollReveal();
                initBackToTop();

                // Animate counters after page load
                setTimeout(() => {
                    const volCount = document.getElementById('count-volunteers');
                    const reqCount = document.getElementById('count-requests');
                    if (volCount) animateCounter(volCount, app.data.active_gps.length);
                    if (reqCount) animateCounter(reqCount, app.data.requests.filter(r => r.status === 'Completed').length);
                }, 500);

                app.init();
            });
        </script>