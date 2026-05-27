
/* ============================================
   Portfolio JavaScript — Interactions & Canvas
   Fluid Aurora Gradient + Glassmorphism UI
   ============================================ */

(function () {
    'use strict';

    // ===== Theme Toggle =====
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    function getStoredTheme() {
        return localStorage.getItem('portfolio-theme') || 'dark';
    }

    function applyTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
    }

    // Initialize theme
    applyTheme(getStoredTheme());

    themeToggle.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        htmlEl.classList.add('theme-transitioning');
        applyTheme(next);
        setTimeout(() => htmlEl.classList.remove('theme-transitioning'), 700);
    });

    // ===== Navbar Scroll Effects =====
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-links a');

    function onScroll() {
        const scrollY = window.scrollY;

        // Navbar compact state
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ===== Mobile Navigation =====
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');
    const menuBackdrop = document.getElementById('menuBackdrop');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
        navbar.classList.toggle('menu-open');
        if (menuBackdrop) menuBackdrop.classList.toggle('active');
        document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('open');
        navbar.classList.remove('menu-open');
        if (menuBackdrop) menuBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);

    if (menuBackdrop) {
        menuBackdrop.addEventListener('click', closeMenu);
    }

    // Close mobile nav on link click
    navLinksContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ===== Scroll Reveal (Intersection Observer) =====
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Apply subtle reveal
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px',
        }
    );

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== Project Card Glow (Mouse Tracking) =====
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });

    // ===== Contact Form (Web3Forms API) =====
    // Web3Forms provides a reliable JSON API with proper CORS support.
    // Works from file://, localhost, and production. No redirects, no email apps.
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn-submit');
        const originalHTML = btn.innerHTML;

        // Show sending state
        btn.innerHTML = `
            <span>Sending...</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin-icon"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
        `;
        btn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const json = JSON.stringify(Object.fromEntries(formData));

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: json,
            });

            const result = await response.json();

            if (result.success) {
                btn.innerHTML = `
                    <span>Message Sent!</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                `;
                btn.style.background = 'linear-gradient(135deg, hsl(174, 72%, 46%), hsl(174, 72%, 56%))';
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Something went wrong');
            }
        } catch (error) {
            btn.innerHTML = `
                <span>Error — Try Again</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            `;
            btn.style.background = 'linear-gradient(135deg, hsl(0, 70%, 50%), hsl(0, 70%, 60%))';
            console.error('Form error:', error);
        }

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });

    // ===== Custom Video Background Fade Loop =====
    const bgVideo = document.getElementById('bgVideo');
    if (bgVideo) {
        bgVideo.play().catch(e => console.log("Auto-play prevented", e));
        
        function checkVideoFade() {
            if (!bgVideo.paused && !bgVideo.ended && bgVideo.duration > 0) {
                const timeLeft = bgVideo.duration - bgVideo.currentTime;
                
                // Fade out 0.5s before end
                if (timeLeft <= 0.5) {
                    bgVideo.style.opacity = '0';
                } 
                // Fade in at the start
                else if (bgVideo.currentTime > 0) {
                    bgVideo.style.opacity = '1';
                }
            }
            requestAnimationFrame(checkVideoFade);
        }
        
        requestAnimationFrame(checkVideoFade);

        // Custom loop: wait 100ms, then replay
        bgVideo.addEventListener('ended', () => {
            bgVideo.style.opacity = '0';
            setTimeout(() => {
                bgVideo.currentTime = 0;
                bgVideo.play().catch(e => console.log("Replay prevented", e));
            }, 100);
        });
    }


    // ===== Smooth Scroll for anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });

    // ===== BFCache WebGL Fix =====
    // When navigating back, iOS/Safari/Chrome sometimes restore the page from memory.
    // This breaks WebGL contexts (making the background freeze).
    // If the page is restored from cache, force a fresh reload.
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            window.location.reload();
        }
    });

    // ===== Animated Topography (Mobile Menu Background) =====
    const topoCanvas = document.getElementById('topoCanvas');
    if (topoCanvas) {
        const ctx = topoCanvas.getContext('2d');

        let width, height;
        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            topoCanvas.width = width;
            topoCanvas.height = height;
        }
        window.addEventListener('resize', resize);
        resize();

        // 2D Simplex Noise implementation
        const F3 = 1.0 / 3.0, G3 = 1.0 / 6.0;
        const p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256);
        const perm = new Uint8Array(512), permMod12 = new Uint8Array(512);
        for (let i = 0; i < 512; i++) {
            perm[i] = p[i & 255];
            permMod12[i] = (perm[i] % 12);
        }

        function noise2D(xin, yin) {
            let n0, n1, n2;
            const s = (xin + yin) * 0.5 * (Math.sqrt(3.0) - 1.0);
            const i = Math.floor(xin + s), j = Math.floor(yin + s);
            const t = (i + j) * (3.0 - Math.sqrt(3.0)) / 6.0;
            const X0 = i - t, Y0 = j - t;
            const x0 = xin - X0, y0 = yin - Y0;
            let i1, j1;
            if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }
            const x1 = x0 - i1 + (3.0 - Math.sqrt(3.0)) / 6.0, y1 = y0 - j1 + (3.0 - Math.sqrt(3.0)) / 6.0;
            const x2 = x0 - 1.0 + 2.0 * (3.0 - Math.sqrt(3.0)) / 6.0, y2 = y0 - 1.0 + 2.0 * (3.0 - Math.sqrt(3.0)) / 6.0;
            const ii = i & 255, jj = j & 255;
            const gi0 = permMod12[ii + perm[jj]], gi1 = permMod12[ii + i1 + perm[jj + j1]], gi2 = permMod12[ii + 1 + perm[jj + 1]];
            const t0 = 0.5 - x0 * x0 - y0 * y0; if (t0 < 0) n0 = 0.0; else { t0 *= t0; n0 = t0 * t0 * (gi0 % 2 === 0 ? 1 : -1) * (x0 + y0); }
            const t1 = 0.5 - x1 * x1 - y1 * y1; if (t1 < 0) n1 = 0.0; else { t1 *= t1; n1 = t1 * t1 * (gi1 % 2 === 0 ? 1 : -1) * (x1 + y1); }
            const t2 = 0.5 - x2 * x2 - y2 * y2; if (t2 < 0) n2 = 0.0; else { t2 *= t2; n2 = t2 * t2 * (gi2 % 2 === 0 ? 1 : -1) * (x2 + y2); }
            return 70.0 * (n0 + n1 + n2);
        }

        let zOffset = 0;
        let animationId;

        function draw() {
            // Check current theme dynamically
            const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
            
            // Fill background based on theme
            ctx.fillStyle = isLightMode ? '#F8FAFC' : '#0B0D11'; 
            ctx.fillRect(0, 0, width, height);

            // Adjust stroke visibility based on theme contrast
            ctx.strokeStyle = isLightMode ? 'rgba(6, 182, 212, 0.45)' : 'rgba(6, 182, 212, 0.2)'; 
            ctx.lineWidth = 1.5;
            
            const levels = 10; // Fewer lines so it's not overwhelming
            
            for (let l = 0; l < levels; l++) {
                const threshold = (l / levels) * 2 - 1;
                
                ctx.beginPath();
                let isDrawing = false;

                for (let y = 0; y < height; y += 6) {
                    isDrawing = false;
                    for (let x = 0; x < width; x += 6) {
                        // Broader, organic waves that don't repeat symmetrically (less "trippy")
                        const sx = x * 0.002;
                        const sy = y * 0.002;
                        
                        const noiseVal = (
                            Math.sin(sx + zOffset) + 
                            Math.cos(sy + zOffset * 0.7) + 
                            Math.sin((sx + sy) * 0.8 - zOffset * 0.4)
                        ) / 3;
                        
                        // Slightly wider threshold to catch the smoother slopes
                        if (Math.abs(noiseVal - threshold) < 0.03) {
                            if (!isDrawing) {
                                ctx.moveTo(x, y);
                                isDrawing = true;
                            } else {
                                ctx.lineTo(x, y);
                            }
                        } else {
                            isDrawing = false;
                        }
                    }
                }
                ctx.stroke();
            }

            zOffset += 0.002; // Slowed down animation speed
            requestAnimationFrame(draw);
        }

        draw();
    }

})();
