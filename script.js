document.addEventListener('DOMContentLoaded', function() {

    // --- All previous logic (Mobile Menu, Scroll Animations, etc.) remains here ---
    // --- Mobile Menu (Hamburger) Logic ---
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const navLinks = document.querySelectorAll('.mobile-nav a, .main-nav a');

    if (hamburger && mobileNav) {
        // ... (hamburger logic is the same)
    }

    // --- Animate on Scroll Logic ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Check if the intersecting element is the stats container to trigger the count-up
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
    }, { threshold: 0.5 }); // Use threshold 0.5 for stats to ensure they are visible

    scrollElements.forEach(el => {
        if (el) observer.observe(el);
    });

    // ... (Particle logic, Ripple Effect, and Form Submission logic are the same) ...


    // --- NEW: Function to Animate Counting Up ---
    function animateCountUp(element, finalCount) {
        if (!element || isNaN(finalCount)) return;
        
        let start = 0;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        function step(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentCount = Math.floor(progress * finalCount);
            
            element.textContent = currentCount.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = finalCount.toLocaleString(); // Ensure it ends on the exact number
            }
        }
        requestAnimationFrame(step);
    }


    // --- NEW: Fetch and Display Bot Stats ---
    async function fetchBotStats() {
        const statsApiUrl = 'http://87.106.100.210:6007/stats';
        
        // Get all the elements that will display stats
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

            // --- Update Modal ---
            if (modalUserCountEl) modalUserCountEl.textContent = userCount.toLocaleString();
            if (modalServerCountEl) modalServerCountEl.textContent = serverCount.toLocaleString();
            
            // --- Prepare Main Stats for Animation ---
            // We store the final count in a data attribute. The animation will read from this
            // when the element scrolls into view.
            if (userCountEl) userCountEl.dataset.finalCount = userCount;
            if (serverCountEl) serverCountEl.dataset.finalCount = serverCount;

        } catch (error) {
            console.error("Failed to fetch bot stats:", error);
            // Display an error state if the API fails
            const errorText = 'N/A';
            if (userCountEl) userCountEl.textContent = errorText;
            if (serverCountEl) serverCountEl.textContent = errorText;
            if (modalUserCountEl) modalUserCountEl.textContent = errorText;
            if (modalServerCountEl) modalServerCountEl.textContent = errorText;
        }
    }

    // Call the function to get stats when the page loads
    fetchBotStats();


    // --- Welcome Modal Logic ---
    const modal = document.getElementById('welcome-modal');
    const modalOverlay = document.getElementById('welcome-modal-overlay');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    // ... (Modal logic remains the same) ...

});
