/* ============================================================
   FURY AGENCY — Shared Site Scripts (agencyfury.online)
   ============================================================ */
(function () {
    'use strict';

    /* --- Navbar scroll state --- */
    function initNavbar() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const onScroll = function () {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* --- Mobile menu --- */
    function initMobileMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('mobileOverlay');
        if (!toggle || !menu) return;

        const closeMenu = function () {
            menu.classList.remove('open');
            toggle.classList.remove('active');
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        };

        toggle.addEventListener('click', function () {
            const open = menu.classList.toggle('open');
            toggle.classList.toggle('active', open);
            overlay.classList.toggle('show', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });

        overlay.addEventListener('click', closeMenu);
        menu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', closeMenu);
        });
    }

    /* --- Scroll reveal animation --- */
    function initReveal() {
        const items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        if (!('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('visible'); });
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        items.forEach(function (el) { observer.observe(el); });
    }

    /* --- FAQ accordion --- */
    function initFaq() {
        document.querySelectorAll('.faq-item').forEach(function (item) {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!question || !answer) return;

            question.addEventListener('click', function () {
                const isOpen = item.classList.contains('open');
                document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
                    openItem.classList.remove('open');
                    openItem.querySelector('.faq-answer').style.maxHeight = null;
                });
                if (!isOpen) {
                    item.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    /* --- Blog listing: search + category filters --- */
    function initBlogFilters() {
        const searchInput = document.getElementById('searchInput');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const articleCards = document.querySelectorAll('.article-card');
        const noResults = document.getElementById('noResults');
        const blogGrid = document.getElementById('blogGrid');

        if (!searchInput || !articleCards.length) return;

        let currentCategory = 'all';
        let currentSearch = '';

        const applyFilter = function () {
            let visibleCount = 0;
            articleCards.forEach(function (card) {
                const category = card.getAttribute('data-category') || 'all';
                const title = (card.getAttribute('data-title') || '').toLowerCase();
                const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
                const search = currentSearch.toLowerCase();

                const matchesCategory = currentCategory === 'all' || category === currentCategory;
                const matchesSearch = !search || title.indexOf(search) !== -1 || keywords.indexOf(search) !== -1;

                const show = matchesCategory && matchesSearch;
                card.style.display = show ? 'flex' : 'none';
                if (show) visibleCount++;
            });

            if (noResults) {
                noResults.classList.toggle('show', visibleCount === 0);
            }
            if (blogGrid) {
                blogGrid.style.display = visibleCount === 0 ? 'none' : 'grid';
            }
        };

        searchInput.addEventListener('input', function () {
            currentSearch = searchInput.value.trim();
            applyFilter();
        });

        filterButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterButtons.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentCategory = btn.getAttribute('data-category') || 'all';
                applyFilter();
            });
        });

        applyFilter();
    }

    /* --- Contact / enquiry form --- */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const status = document.getElementById('formStatus');

        const showStatus = function (type, message) {
            status.className = 'form-status ' + type;
            status.textContent = message;
            status.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = form.querySelector('[name="name"]');
            const email = form.querySelector('[name="email"]');
            const message = form.querySelector('[name="message"]');

            if (name && name.value.trim().length < 2) {
                showStatus('error', 'Please enter your name (minimum 2 characters).');
                name.focus();
                return;
            }
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                showStatus('error', 'Please enter a valid email address.');
                email.focus();
                return;
            }
            if (message && message.value.trim().length < 10) {
                showStatus('error', 'Please describe your project (minimum 10 characters).');
                message.focus();
                return;
            }

            const subject = encodeURIComponent('New project enquiry — ' + (name ? name.value.trim() : 'Prospective client'));
            const body = encodeURIComponent(
                'Name: ' + (name ? name.value.trim() : '') + '\n' +
                'Email: ' + (email ? email.value.trim() : '') + '\n\n' +
                (form.querySelector('[name="project"]') ? 'Project type: ' + form.querySelector('[name="project"]').value + '\n' : '') +
                (form.querySelector('[name="budget"]') ? 'Estimated budget: ' + form.querySelector('[name="budget"]').value + '\n' : '') +
                '\nMessage:\n' + (message ? message.value.trim() : '')
            );

            window.location.href = 'mailto:bhattiabdulrehman430@gmail.com?subject=' + subject + '&body=' + body;

            showStatus('success', 'Thank you! Your email client should open with your message ready to send. We typically reply within 24 hours.');
            form.reset();
        });
    }

    /* --- Footer year --- */
    function initFooterYear() {
        document.querySelectorAll('.footer-year').forEach(function (el) {
            el.textContent = new Date().getFullYear();
        });
    }

    /* --- Init --- */
    document.addEventListener('DOMContentLoaded', function () {
        initNavbar();
        initMobileMenu();
        initReveal();
        initFaq();
        initBlogFilters();
        initContactForm();
        initFooterYear();
    });
})();