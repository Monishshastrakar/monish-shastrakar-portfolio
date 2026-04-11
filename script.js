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

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
        document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    navLinksContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ===== Scroll Reveal (Intersection Observer) =====
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
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

    // ===== Mouse-Tracking Spotlight Canvas =====
    // Radial gradient orb: Cobalt Blue → Deep Violet → white/lavender core.
    // Smoothly follows cursor with lerp easing.
    const canvas = document.getElementById('spotlightCanvas');
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let w, h;

    // Mouse position (starts at center)
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = mouseX;
    let targetY = mouseY;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    document.addEventListener('touchmove', (e) => {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
    }, { passive: true });

    function animate() {
        const isDark = htmlEl.getAttribute('data-theme') === 'dark';

        // Smooth lerp
        mouseX += (targetX - mouseX) * 0.06;
        mouseY += (targetY - mouseY) * 0.06;

        // Clear + base fill
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = isDark ? '#0B0D11' : '#F8FAFC';
        ctx.fillRect(0, 0, w, h);

        const orbRadius = Math.max(w, h) * 0.5;

        if (isDark) {
            ctx.globalCompositeOperation = 'lighter';

            // Layer 1: Wide Deep Violet base glow
            const g1 = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, orbRadius);
            g1.addColorStop(0, 'hsla(270, 80%, 50%, 0.40)');
            g1.addColorStop(0.35, 'hsla(260, 70%, 40%, 0.20)');
            g1.addColorStop(0.7, 'hsla(250, 50%, 25%, 0.08)');
            g1.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
            ctx.fillStyle = g1;
            ctx.fillRect(0, 0, w, h);

            // Layer 2: Neon Cobalt Blue mid-ring
            const g2 = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, orbRadius * 0.6);
            g2.addColorStop(0, 'hsla(220, 90%, 60%, 0.35)');
            g2.addColorStop(0.4, 'hsla(220, 80%, 45%, 0.15)');
            g2.addColorStop(0.8, 'hsla(210, 60%, 30%, 0.05)');
            g2.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
            ctx.fillStyle = g2;
            ctx.fillRect(0, 0, w, h);

            // Layer 3: Electric Cyan core
            const g3 = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, orbRadius * 0.25);
            g3.addColorStop(0, 'hsla(189, 100%, 70%, 0.50)');
            g3.addColorStop(0.3, 'hsla(189, 90%, 60%, 0.25)');
            g3.addColorStop(0.7, 'hsla(189, 70%, 40%, 0.05)');
            g3.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
            ctx.fillStyle = g3;
            ctx.fillRect(0, 0, w, h);

            ctx.globalCompositeOperation = 'source-over';
        } else {
            // Light mode: more vivid bright pastel wash to contrast against white
            const g1 = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, orbRadius * 0.6);
            g1.addColorStop(0, 'hsla(189, 90%, 75%, 0.75)');    // Bright cyan core
            g1.addColorStop(0.4, 'hsla(210, 80%, 85%, 0.45)');  // Soft blue mid
            g1.addColorStop(0.8, 'hsla(240, 70%, 92%, 0.15)');  // Faint violet edge
            g1.addColorStop(1, 'hsla(0, 0%, 100%, 0)');
            ctx.fillStyle = g1;
            ctx.fillRect(0, 0, w, h);
        }

        animationFrame = requestAnimationFrame(animate);
    }

    function startCanvas() {
        resize();
        animate();
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cancelAnimationFrame(animationFrame);
            startCanvas();
        }, 150);
    });

    startCanvas();

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

})();
