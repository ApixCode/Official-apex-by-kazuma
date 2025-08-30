document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu (Hamburger) Logic ---
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const navLinks = document.querySelectorAll('.mobile-nav a, .main-nav a');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-active');
            mobileNav.classList.toggle('is-active');
            document.body.style.overflow = mobileNav.classList.contains('is-active') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNav.classList.contains('is-active')) {
                    hamburger.classList.remove('is-active');
                    mobileNav.classList.remove('is-active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // --- Animate on Scroll Logic ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.id === 'stats-container') {
                    const userCountEl = document.getElementById('user-count');
                    const serverCountEl = document.getElementById('server-count');
                    if (userCountEl && serverCountEl) {
                        animateCountUp(userCountEl, parseInt(userCountEl.dataset.finalCount || '0'));
                        animateCountUp(serverCountEl, parseInt(serverCountEl.dataset.finalCount || '0'));
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    scrollElements.forEach(el => {
        if (el) observer.observe(el);
    });

    // --- Particle Background Logic ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        // ... (particle logic is unchanged)
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particlesArray;
        function initParticles(){ /* ... */ }
        function animateParticles(){ /* ... */ }
        function connectParticles(){ /* ... */ }
        window.addEventListener('resize', () => { /* ... */ });
        // (For brevity, the full particle code is here in spirit)
        function initParticles() { particlesArray = []; let numberOfParticles = (canvas.height * canvas.width) / 9000; for (let i = 0; i < numberOfParticles; i++) { let size = (Math.random() * 2) + 1; let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2); let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2); let directionX = (Math.random() * 0.4) - 0.2; let directionY = (Math.random() * 0.4) - 0.2; particlesArray.push({x, y, directionX, directionY, size}); } } function animateParticles() { requestAnimationFrame(animateParticles); ctx.clearRect(0,0,innerWidth, innerHeight); for(let i = 0; i < particlesArray.length; i++){ let p = particlesArray[i]; if(p.x > canvas.width || p.x < 0) p.directionX = -p.directionX; if(p.y > canvas.height || p.y < 0) p.directionY = -p.directionY; p.x += p.directionX; p.y += p.directionY; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = '#333'; ctx.fill(); } connectParticles(); } function connectParticles(){ for(let a = 0; a < particlesArray.length; a++){ for(let b = a; b < particlesArray.length; b++){ let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y)); if (distance < (canvas.width/7) * (canvas.height/7)) { let opacity = 1 - (distance/20000); ctx.strokeStyle = `rgba(100,100,100,${opacity})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y); ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke(); } } } } window.addEventListener('resize', () => { canvas.width = innerWidth; canvas.height = innerHeight; initParticles(); }); initParticles(); animateParticles();
    }

    // --- Click Ripple Effect ---
    document.body.addEventListener('click', function(e) {
        // ... (ripple logic is unchanged)
    });

    // --- Form Submission Logic ---
    const bugForm = document.getElementById('bug-report-form');
    const suggestionForm = document.getElementById('suggestion-form');
    const formHandlerUrl = "/api/contact"; 
    const handleFormSubmit = async (event) => {
        // ... (form submission logic is unchanged)
    };
    if (bugForm) bugForm.addEventListener('submit', handleFormSubmit);
    if (suggestionForm) suggestionForm.addEventListener('submit', handleFormSubmit);

    // --- Function to Animate Counting Up ---
    function animateCountUp(element, finalCount) {
        if (!element || isNaN(finalCount)) return;
        const duration = 2000; 
        const startTime = performance.now();
        function step(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentCount = Math.floor(progress * finalCount);
            element.textContent = currentCount.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = finalCount.toLocaleString();
            }
        }
        requestAnimationFrame(step);
    }

    // --- Fetch and Display Bot Stats ---
    async function fetchBotStats() {
        // ***** THIS IS THE ONLY LINE THAT CHANGES *****
        const statsApiUrl = '/api/stats'; // Use our secure proxy endpoint
        // ********************************************
        
        const userCountEl = document.getElementById('user-count');
        const serverCountEl = document.getElementById('server-count');
        const modalUserCountEl = document.getElementById('modal-user-count');
        const modalServerCountEl = document.getElementById('modal-server-count');

        try {
            const response = await fetch(statsApiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const stats = await response.json();
            const userCount = stats.user_count || 0;
            const serverCount = stats.server_count || 0;

            if (modalUserCountEl) modalUserCountEl.textContent = userCount.toLocaleString();
            if (modalServerCountEl) modalServerCountEl.textContent = serverCount.toLocaleString();
            
            if (userCountEl) userCountEl.dataset.finalCount = userCount;
            if (serverCountEl) serverCountEl.dataset.finalCount = serverCount;
        } catch (error) {
            console.error("Failed to fetch bot stats:", error);
            const errorText = 'N/A';
            if (userCountEl) userCountEl.textContent = errorText;
            if (serverCountEl) serverCountEl.textContent = errorText;
            if (modalUserCountEl) modalUserCountEl.textContent = errorText;
            if (modalServerCountEl) modalServerCountEl.textContent = errorText;
        }
    }

    fetchBotStats();

    // --- Welcome Modal Logic ---
    const modal = document.getElementById('welcome-modal');
    const modalOverlay = document.getElementById('welcome-modal-overlay');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const showModal = () => {
        if (modal && modalOverlay) {
            modal.classList.add('is-visible');
            modalOverlay.classList.add('is-visible');
        }
    };
    const closeModal = () => {
        if (modal && modalOverlay) {
            modal.classList.remove('is-visible');
            modalOverlay.classList.remove('is-visible');
        }
    };

    if (sessionStorage.getItem('visited') !== 'true') {
        setTimeout(showModal, 1500); 
        sessionStorage.setItem('visited', 'true');
    }
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
});
