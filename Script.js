document.addEventListener('DOMContentLoaded', () => {
    function createStars(container, numStars, i = 0) {
        if (!container || i >= numStars) return;
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 0.5}s`;
        star.style.animationDuration = `${Math.random() * 0.4 + 0.5}s`;
        container.appendChild(star);
        requestAnimationFrame(() => createStars(container, numStars, i + 1));
    }

    const starryBackgroundContainer = document.querySelector('.starry-background');
    const outerNumStars = window.innerWidth <= 768 ? 1000 : 5000;
    if (starryBackgroundContainer) {
        createStars(starryBackgroundContainer, outerNumStars);
    }

    const innerStarryBackgroundContainer = document.querySelector('.inner-starry-background');
    const innerNumStars = window.innerWidth <= 768 ? 4000 : 20000;

    // Footer stars
    const footer = document.querySelector('.site-footer');
    if (footer) {
        let footerStars = footer.querySelector('.footer-stars');
        if (!footerStars) {
            footerStars = document.createElement('div');
            footerStars.className = 'footer-stars';
            footer.prepend(footerStars);
        }
        const footerStarCount = window.innerWidth <= 768 ? 50 : 100;
        createStars(footerStars, footerStarCount);
    }

    const starObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const stars = entry.target.querySelectorAll('.star');
            stars.forEach(star => {
                star.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
            });
        });
    }, { threshold: 0 });

    if (starryBackgroundContainer) starObserver.observe(starryBackgroundContainer);
    if (innerStarryBackgroundContainer) starObserver.observe(innerStarryBackgroundContainer);
    if (footer) {
        const footerStarsContainer = footer.querySelector('.footer-stars');
        if (footerStarsContainer) starObserver.observe(footerStarsContainer);
    }

    // ────────────────────────────────────────────────
    // YOUR ORIGINAL JAVASCRIPT CODE BELOW (unchanged)
    // ────────────────────────────────────────────────

    const sloganText = document.querySelector('.slogan-text');
    const text = sloganText.getAttribute('data-text') || "Eat - Sleep - Code - Repeat....";
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            sloganText.textContent = text.slice(0, i + 1);
            i++;
            setTimeout(typeWriter, 75);
        } else {
            setTimeout(() => {
                i = 0;
                sloganText.textContent = '';
                typeWriter();
            }, 1000);
        }
    }
    sloganText.setAttribute('aria-live', 'polite');
    const sloganTextObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            i = 0;
            sloganText.textContent = '';
            setTimeout(typeWriter, 1000);
        } else {
            i = text.length;
        }
    }, { threshold: 0.5 });
    sloganTextObserver.observe(sloganText);

    const header = document.querySelector('header');
    function toggleHeaderTransparency() {
        const sections = document.querySelectorAll('section');
        let isOverSection = false;
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const headerHeight = header.offsetHeight;
            if (rect.top <= headerHeight && rect.bottom >= 0) {
                isOverSection = true;
            }
        });
        if (isOverSection) {
            header.classList.add('transparent');
        } else {
            header.classList.remove('transparent');
        }
    }
    window.addEventListener('scroll', toggleHeaderTransparency);
    window.addEventListener('resize', toggleHeaderTransparency);
    toggleHeaderTransparency();

    const navigationLinks = document.querySelectorAll('.navigation-link');
    navigationLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            if (section) {
                const navbarHeight = header.offsetHeight;
                const sectionPosition = section.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                    top: sectionPosition - navbarHeight,
                    behavior: 'smooth'
                });
                navigationLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navigationLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3, rootMargin: `${-header.offsetHeight}px 0px 0px 0px` });
    document.querySelectorAll('section').forEach(section => observer.observe(section));

    function animateOnScroll(elements, delay) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, idx * delay);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'all 0.6s ease';
            obs.observe(el);
        });
    }
    animateOnScroll(document.querySelectorAll('.skill-badge'), 100);
    animateOnScroll(document.querySelectorAll('.certification-card, .project-card'), 100);
    animateOnScroll(document.querySelectorAll('.interest-tag'), 100);

    const headings = document.querySelectorAll('.about-heading, .project-heading');
    const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                headingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    headings.forEach(h => headingObserver.observe(h));

    const skillsScrollArea = document.querySelector('.skills-scroll-area');
    if (skillsScrollArea) {
        skillsScrollArea.scrollTop = 0;
        let isScrolling = false;
        let targetScrollTop = 0;
        let currentScrollTop = 0;
        const scrollSpeed = 0.4;
        const scrollAmount = 100;
        let lastNavigationTime = 0;
        const navigationDebounce = 1000;

        function smoothScroll() {
            currentScrollTop += (targetScrollTop - currentScrollTop) * scrollSpeed;
            skillsScrollArea.scrollTop = currentScrollTop;
            if (Math.abs(targetScrollTop - currentScrollTop) > 0.1) {
                requestAnimationFrame(smoothScroll);
            } else {
                isScrolling = false;
            }
        }

        skillsScrollArea.addEventListener('wheel', (e) => {
            if (window.innerWidth <= 767) return;
            e.preventDefault();
            const now = Date.now();
            const delta = e.deltaY || e.detail || e.wheelDelta;
            const normalizedDelta = Math.sign(delta) * scrollAmount;
            const maxScroll = skillsScrollArea.scrollHeight - skillsScrollArea.clientHeight;
            const prevTarget = targetScrollTop;

            targetScrollTop = Math.max(0, Math.min(targetScrollTop + normalizedDelta, maxScroll));

            if (now - lastNavigationTime > navigationDebounce) {
                if (targetScrollTop === 0 && delta < 0 && prevTarget <= 1) {
                    lastNavigationTime = now;
                    const home = document.getElementById('home-section');
                    if (home) {
                        const nh = header.offsetHeight || 0;
                        window.scrollTo({ top: home.getBoundingClientRect().top + window.scrollY - nh, behavior: 'smooth' });
                        setTimeout(() => { targetScrollTop = currentScrollTop = skillsScrollArea.scrollTop = 0; }, 1000);
                    }
                } else if (targetScrollTop >= maxScroll && delta > 0 && prevTarget >= maxScroll - 1) {
                    lastNavigationTime = now;
                    const cert = document.getElementById('certifications-section');
                    if (cert) {
                        const nh = header.offsetHeight || 0;
                        window.scrollTo({ top: cert.getBoundingClientRect().top + window.scrollY - nh, behavior: 'smooth' });
                        setTimeout(() => { targetScrollTop = currentScrollTop = skillsScrollArea.scrollTop = maxScroll; }, 1000);
                    }
                } else {
                    if (!isScrolling) { isScrolling = true; requestAnimationFrame(smoothScroll); }
                }
            } else {
                if (!isScrolling) { isScrolling = true; requestAnimationFrame(smoothScroll); }
            }
        }, { passive: false });

        skillsScrollArea.addEventListener('touchstart', () => { isScrolling = false; });
    }

    function toggleInnerCerts(id) {
        const overlay = document.getElementById(id);
        if (!overlay) return;
        const opening = !overlay.classList.contains('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
        if (opening && innerStarryBackgroundContainer) {
            innerStarryBackgroundContainer.innerHTML = '';
            createStars(innerStarryBackgroundContainer, innerNumStars);
        } else if (!opening && innerStarryBackgroundContainer) {
            innerStarryBackgroundContainer.innerHTML = '';
        }
    }

    const closeBtn = document.querySelector('.close-button');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => toggleInnerCerts('inner-cert-overlay'));
        closeBtn.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleInnerCerts('inner-cert-overlay');
            }
        });
    }

    const cards = document.querySelectorAll('.certification-card, .project-card');
    cards.forEach(card => {
        card.addEventListener('click', e => {
            if (card.classList.contains('project-card') && e.target.closest('.primary-tech-tags span')) {
                e.preventDefault();
                return;
            }
            const viewLink = e.target.closest('.view-certificate-link, .view-project-link');
            if (viewLink) {
                const toggleId = viewLink.getAttribute('data-toggle');
                if (toggleId) {
                    e.preventDefault();
                    toggleInnerCerts(toggleId);
                }
                return;
            }
            if (card.classList.contains('certification-card')) {
                const url = card.getAttribute('data-url');
                if (url) window.open(url, '_blank');
            }
        });

        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (card.classList.contains('project-card') && e.target.closest('.primary-tech-tags span')) return;
                const viewLink = card.querySelector('.view-certificate-link[data-toggle], .view-project-link[data-toggle]');
                if (viewLink) {
                    const toggleId = viewLink.getAttribute('data-toggle');
                    toggleInnerCerts(toggleId);
                } else if (card.classList.contains('certification-card')) {
                    const url = card.getAttribute('data-url');
                    if (url) window.open(url, '_blank');
                }
            }
        });
    });

    const buttons = document.querySelectorAll('.action-button');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-3px) scale(1.05)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
    });

    const hireBtn = document.querySelector('#hire-me-button');
    if (hireBtn) {
        hireBtn.addEventListener('click', e => {
            e.preventDefault();
            const interest = document.getElementById('interest-section');
            const mail = interest ? interest.querySelector('.hire-me-text a[href^="mailto:"]') : null;
            if (mail && interest) {
                const nh = header.offsetHeight || 0;
                window.scrollTo({ top: mail.getBoundingClientRect().top + window.scrollY - nh - 20, behavior: 'smooth' });
                mail.setAttribute('tabindex', '0');
                setTimeout(() => mail.focus({ preventScroll: true }), 800);
            } else if (interest) {
                const nh = header.offsetHeight || 0;
                window.scrollTo({ top: interest.getBoundingClientRect().top + window.scrollY - nh - 20, behavior: 'smooth' });
            }
        });
    }

    // Custom cursor
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        let dotX = 0, dotY = 0, targetDotX = 0, targetDotY = 0;
        const speed = 0.3, maxOffset = 15;
        let hovering = false;

        function updateDot() {
            dotX += (targetDotX - dotX) * speed;
            dotY += (targetDotY - dotY) * speed;
            const bx = Math.max(-maxOffset, Math.min(maxOffset, dotX));
            const by = Math.max(-maxOffset, Math.min(maxOffset, dotY));
            cursor.style.setProperty('--dot-x', `${bx}px`);
            cursor.style.setProperty('--dot-y', `${by}px`);
            requestAnimationFrame(updateDot);
        }

        document.addEventListener('mousemove', e => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            if (!hovering) {
                targetDotX += (e.movementX || 0) * 0.8;
                targetDotY += (e.movementY || 0) * 0.8;
                targetDotX = Math.max(-maxOffset, Math.min(maxOffset, targetDotX));
                targetDotY = Math.max(-maxOffset, Math.min(maxOffset, targetDotY));
            }
        });

        const interactive = document.querySelectorAll(
            'a, button, .action-button, .navigation-link, .social-link-icon, .skill-badge, .certification-card, .project-card, .close-button, .interest-tag, .view-certificate-link, .view-project-link, .primary-tech-tags span'
        );
        interactive.forEach(el => {
            el.style.cursor = 'none';
            el.addEventListener('mouseenter', () => {
                hovering = true;
                cursor.classList.add('active');
                targetDotX = targetDotY = dotX = dotY = 0;
                cursor.style.setProperty('--dot-x', '0px');
                cursor.style.setProperty('--dot-y', '0px');
            });
            el.addEventListener('mouseleave', () => {
                hovering = false;
                cursor.classList.remove('active');
            });
        });

        requestAnimationFrame(updateDot);
    }
});