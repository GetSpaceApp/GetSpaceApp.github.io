/* ============================================================
   SPACE — Interactive Script
   Blur Text · Parallax · FAQ Accordion · Scroll Reveals
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

    // Add scrolled style
    const style = document.createElement('style');
    style.textContent = `
        nav.scrolled {
            background: rgba(2, 4, 10, 0.85);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            box-shadow: 0 4px 30px rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(style);

    // ---- HAMBURGER MENU ----
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
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

    // ---- BLUR TEXT ANIMATION ----
    const blurTextElements = document.querySelectorAll('[data-blur-text]');

    blurTextElements.forEach(el => {
        const text = el.textContent.trim();
        const words = text.split(/\s+/);
        el.textContent = '';
        el.style.opacity = '1';
        el.style.filter = 'none';
        el.style.transform = 'none';

        words.forEach((word, i) => {
            const span = document.createElement('span');
            span.className = 'blur-word';
            span.textContent = word + ' ';
            span.style.transitionDelay = `${i * 0.06}s`;
            el.appendChild(span);
        });

        const blurObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.blur-word').forEach(w => {
                        w.classList.add('visible');
                    });
                    blurObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-30px'
        });

        blurObserver.observe(el);
    });

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

    // ---- PARALLAX ON HERO ORBS ----
    const orbs = document.querySelectorAll('.orb');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;

        if (scrollY < heroHeight * 1.5) {
            const progress = scrollY / heroHeight;

            orbs.forEach((orb, i) => {
                const speed = 0.3 + (i * 0.1);
                const moveY = scrollY * speed;
                const opacity = Math.max(0, 1 - progress * 0.8);
                orb.style.transform = `translateY(${moveY}px)`;
                orb.style.opacity = opacity;
            });
        }
    }, { passive: true });

    // ---- 3D TILT ON PHONE ----
    const phone = document.querySelector('.phone-3d');

    if (phone) {
        const phoneWrap = phone.closest('.showcase-wrap') || phone.parentElement;

        phoneWrap.addEventListener('mousemove', (e) => {
            const rect = phoneWrap.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            phone.style.transform = `
                perspective(800px)
                rotateY(${x * 12}deg)
                rotateX(${-y * 8}deg)
                scale3d(1.02, 1.02, 1.02)
            `;
        });

        phoneWrap.addEventListener('mouseleave', () => {
            phone.style.transform = '';
        });
    }

    // ---- TILT ON BENTO CARDS ----
    const tiltCards = document.querySelectorAll('.bento-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            card.style.transform = `
                perspective(600px)
                rotateY(${x * 6}deg)
                rotateX(${-y * 4}deg)
                translateY(-4px)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ---- MARQUEE DUPLICATION ----
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        const items = marqueeTrack.innerHTML;
        marqueeTrack.innerHTML = items + items;
    }

    // ---- CURSOR GLOW (subtle) ----
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.04) 0%, transparent 70%);
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

    // ---- ANIMATE STAT NUMBERS ----
    const statNums = document.querySelectorAll('.hero-stat-num');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const num = parseInt(text);

                if (!isNaN(num) && num > 0 && num < 10000) {
                    let current = 0;
                    const increment = Math.ceil(num / 40);
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= num) {
                            el.textContent = text;
                            clearInterval(timer);
                        } else {
                            el.textContent = current;
                        }
                    }, 30);
                }
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNums.forEach(el => counterObserver.observe(el));

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
});
