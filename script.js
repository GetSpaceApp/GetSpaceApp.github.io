/* ============================================================
   HerRise — Interactive Script
   Scroll Reveals · FAQ Accordion · Marquee · Counter Animation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---- NAVBAR SCROLL EFFECT ----
    const nav = document.getElementById('nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // ---- HAMBURGER MENU ----
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const menuBackdrop = document.getElementById('menu-backdrop');

    function openMenu() {
        hamburger.classList.add('active');
        mobileMenu.classList.add('open');
        if (menuBackdrop) menuBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        if (menuBackdrop) menuBackdrop.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
        });

        // Close when clicking close button (using closest for robust touch targets)
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.closest('#mobile-menu-close')) {
                closeMenu();
            }
        });

        // Close when clicking the backdrop
        if (menuBackdrop) {
            menuBackdrop.addEventListener('click', closeMenu);
        }

        // Close when clicking any nav link inside drawer
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // ---- SMOOTH ANCHOR SCROLLING ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 100;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ---- SCROLL REVEAL (IntersectionObserver) ----
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---- FAQ ACCORDION ----
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all others
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('open');
                    other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current
            item.classList.toggle('open');
            question.setAttribute('aria-expanded', !isOpen);
        });
    });

    // ---- MARQUEE DUPLICATION ----
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        const items = marqueeTrack.innerHTML;
        marqueeTrack.innerHTML = items + items;
    }

    // ---- ANIMATED COUNTER FOR DATA SECTION ----
    const dataValues = document.querySelectorAll('.data-value[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const suffix = el.textContent.replace(/[0-9]/g, '');

                if (!isNaN(target) && target > 0) {
                    let current = 0;
                    const increment = Math.ceil(target / 50);
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            el.textContent = target + suffix;
                            clearInterval(timer);
                        } else {
                            el.textContent = current + suffix;
                        }
                    }, 25);
                }
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    dataValues.forEach(el => counterObserver.observe(el));

    // ---- CURSOR GLOW (subtle green) ----
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 201, 80, 0.03) 0%, transparent 70%);
        pointer-events: none;
        z-index: 0;
        transition: transform 0.15s ease;
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // ---- TILT ON GLASS CARDS ----
    const tiltCards = document.querySelectorAll('.microbrand-card, .data-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            card.style.transform = `
                perspective(600px)
                rotateY(${x * 6}deg)
                rotateX(${-y * 4}deg)
                translateY(-3px)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ---- PAGE LOAD ANIMATION ----
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

    // ---- GOOGLE SHEETS EMAIL SUBSCRIPTION ----
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = document.getElementById('subscriber-email');
            const submitBtn = document.getElementById('subscribe-btn');
            const msgBox = document.getElementById('subscribe-msg');

            const email = emailInput.value.trim();
            if (!email) return;

            // Change button state
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // !! REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL !!
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxuTR-rASp5z2p7ym4bw8ZYgLggCOQhpyrnBDbo2PK6A7MQd2251G4I3o0Fg1yw_5B/exec';

            // Create form data as URL params for Google Apps Script to parse correctly
            const data = new URLSearchParams();
            data.append('email', email);
            data.append('timestamp', new Date().toISOString());

            // Send as GET request to bypass CORS issues with Google Apps Script
            fetch(GOOGLE_SCRIPT_URL + '?' + data.toString(), {
                method: 'GET',
                mode: 'no-cors' // Google Scripts requires no-cors for simple form posts
            })
                .then(() => {
                    // Because of no-cors, we don't get a proper JSON response, but if it doesn't throw, it succeeded
                    msgBox.style.display = 'block';
                    emailInput.value = '';
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;

                    // Hide message after 5 seconds
                    setTimeout(() => {
                        msgBox.style.display = 'none';
                    }, 5000);
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    submitBtn.textContent = 'Error!';
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                });
        });
    }

    // ---- HERO EMAIL TO FOOTER FORM RELAY ----
    const heroEmail = document.getElementById('hero-email');
    const heroSearchBtn = document.querySelector('.hr-search-btn');

    if (heroSearchBtn && heroEmail) {
        heroSearchBtn.addEventListener('click', () => {
            const email = heroEmail.value.trim();
            const subscriberEmail = document.getElementById('subscriber-email');
            if (email && subscriberEmail) {
                subscriberEmail.value = email;
                const formEl = document.getElementById('subscribe-form');
                if (formEl) {
                    formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        formEl.dispatchEvent(new Event('submit'));
                    }, 600);
                }
            }
        });
    }
});
