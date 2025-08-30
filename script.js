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

        // Close mobile nav when a link is clicked
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
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    scrollElements.forEach(el => {
        if (el) observer.observe(el);
    });


    // --- Particle Background Logic ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particlesArray;

        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                particlesArray.push({x, y, directionX, directionY, size});
            }
        }

        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0,0,innerWidth, innerHeight);
            for(let i = 0; i < particlesArray.length; i++){
                let p = particlesArray[i];
                if(p.x > canvas.width || p.x < 0) p.directionX = -p.directionX;
                if(p.y > canvas.height || p.y < 0) p.directionY = -p.directionY;
                p.x += p.directionX; p.y += p.directionY;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = '#333'; ctx.fill();
            }
            connectParticles();
        }

        function connectParticles(){
            for(let a = 0; a < particlesArray.length; a++){
                for(let b = a; b < particlesArray.length; b++){
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (canvas.width/7) * (canvas.height/7)) {
                        let opacity = 1 - (distance/20000);
                        ctx.strokeStyle = `rgba(100,100,100,${opacity})`; ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke();
                    }
                }
            }
        }

        window.addEventListener('resize', () => {
            canvas.width = innerWidth; canvas.height = innerHeight;
            initParticles();
        });

        initParticles();
        animateParticles();
    }


    // --- Click Ripple Effect ---
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('a, button, input, textarea')) return;
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        document.body.appendChild(ripple);
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        ripple.addEventListener('animationend', () => ripple.remove());
    });


    // --- Form Submission Logic ---
    const bugForm = document.getElementById('bug-report-form');
    const suggestionForm = document.getElementById('suggestion-form');
    const formHandlerUrl = "/api/contact"; // Remember to set up this serverless function endpoint

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const statusElement = form.querySelector('.form-status');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.type = form.id === 'bug-report-form' ? 'bug' : 'suggestion';

        submitButton.disabled = true;
        statusElement.textContent = 'Sending...';
        statusElement.style.color = 'var(--gray-color)';

        try {
            const response = await fetch(formHandlerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                statusElement.textContent = 'Message Sent Successfully!';
                statusElement.style.color = 'var(--success-color)';
                form.reset();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `Server responded with ${response.status}`);
            }
        } catch (error) {
            console.error("Form submission error:", error);
            statusElement.textContent = 'An error occurred. Please try again.';
            statusElement.style.color = 'var(--error-color)';
        } finally {
            submitButton.disabled = false;
            setTimeout(() => { statusElement.textContent = ''; }, 5000);
        }
    };

    if (bugForm) bugForm.addEventListener('submit', handleFormSubmit);
    if (suggestionForm) suggestionForm.addEventListener('submit', handleFormSubmit);


    // --- NEW: Welcome Modal Logic ---
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

    // Show modal only if the user hasn't seen it in this session
    if (sessionStorage.getItem('visited') !== 'true') {
        setTimeout(showModal, 1500); // Show after 1.5 seconds
        sessionStorage.setItem('visited', 'true');
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

});
