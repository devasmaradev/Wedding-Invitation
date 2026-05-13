document.addEventListener('DOMContentLoaded', () => {

    /* ===================================================== */
    /* INITIAL STATE */
    /* ===================================================== */

    // Lock scroll saat cover masih tampil
    document.body.classList.add('lock-scroll');

    /* ===================================================== */
    /* ELEMENT SELECTORS */
    /* ===================================================== */

    const btnOpen =
        document.getElementById('btn-open');

    const cover =
        document.getElementById('cover');

    const mainContent =
        document.getElementById('main-content');

    const audio =
        document.getElementById('bg-music');

    const musicToggle =
        document.getElementById('music-toggle');

    const navLinks =
        document.querySelectorAll('.nav-link');

    const tabs =
        document.querySelectorAll('.tab-content');

    const navbar =
        document.querySelector('.bottom-nav');

    const container =
        document.querySelector('.content-container');

    /* ===================================================== */
    /* VARIABLES */
    /* ===================================================== */

    let lastScrollTop = 0;

    let isMusicManuallyPaused = false;

    let ticking = false;

    /* ===================================================== */
    /* 1. OPEN INVITATION */
    /* ===================================================== */

    btnOpen.addEventListener('click', () => {

        btnOpen.disabled = true;

        /* ============================================= */
        /* UNLOCK SCROLL */
        /* ============================================= */

        document.body.classList.remove('lock-scroll');

        /* ============================================= */
        /* COVER ANIMATION */
        /* ============================================= */

        cover.classList.add('pushed-up');

        /* ============================================= */
        /* SHOW MAIN CONTENT */
        /* ============================================= */

        mainContent.classList.remove('hidden');

        mainContent.classList.add('active');

        /* ============================================= */
        /* SHOW NAVBAR & MUSIC BUTTON */
        /* ============================================= */

        requestAnimationFrame(() => {

            navbar.classList.add('show');

            musicToggle.classList.add('show');

        });

        /* ============================================= */
        /* PLAY MUSIC */
        /* ============================================= */

        if (audio) {

            // Unmute audio
            audio.muted = false;

            // Play audio
            audio.play().catch(err => {

                console.log(
                    'Audio gagal diputar:',
                    err
                );

            });

            // Aktifkan animasi icon
            musicToggle.classList.add('rotating');

        }

        /* ============================================= */
        /* HIDE COVER AFTER ANIMATION */
        /* ============================================= */

        const hideCover = () => {

            cover.style.display = 'none';

        };

        cover.addEventListener(
            'transitionend',
            (e) => {

                if (e.propertyName !== 'transform') {
                    return;
                }

                hideCover();

            },
            { once: true }
        );

        // Fallback jika transition gagal
        setTimeout(hideCover, 1200);

    });

    /* ===================================================== */
    /* 2. TAB NAVIGATION */
    /* ===================================================== */

    navLinks.forEach(link => {

        link.addEventListener('click', function () {

            /* ========================================= */
            /* TARGET */
            /* ========================================= */

            const targetId =
                this.getAttribute('data-target');

            const targetSection =
                document.getElementById(targetId);

            if (!targetSection) {
                return;
            }

            /* ========================================= */
            /* UPDATE ACTIVE NAV */
            /* ========================================= */

            navLinks.forEach(l => {

                l.classList.remove('active');

                l.setAttribute(
                    'aria-selected',
                    'false'
                );

            });

            this.classList.add('active');

            this.setAttribute(
                'aria-selected',
                'true'
            );

            /* ========================================= */
            /* AUTO CENTER ACTIVE MENU */
            /* ========================================= */

            const navRect =
                navbar.getBoundingClientRect();

            const linkRect =
                this.getBoundingClientRect();

            const scrollLeft =
                navbar.scrollLeft +
                linkRect.left -
                navRect.left -
                (navRect.width / 2) +
                (linkRect.width / 2);

            navbar.scrollTo({

                left: scrollLeft,

                behavior: 'smooth'

            });

            /* ========================================= */
            /* SWITCH TAB */
            /* ========================================= */

            tabs.forEach(tab => {

                tab.classList.remove('active');

            });

            targetSection.classList.add('active');

            /* ========================================= */
            /* RESET SCROLL */
            /* ========================================= */

            if (container) {

                container.scrollTo({

                    top: 0,

                    behavior: 'smooth'

                });

            }

        });

    });

    /* ===================================================== */
    /* 3. MUSIC CONTROL */
    /* ===================================================== */

    musicToggle.addEventListener('click', () => {

        /* ============================================= */
        /* PLAY MUSIC */
        /* ============================================= */

        if (audio.paused) {

            audio.play().catch(err => {

                console.log(
                    'Audio gagal diputar:',
                    err
                );

            });

            isMusicManuallyPaused = false;

            musicToggle.classList.add('rotating');

        }

        /* ============================================= */
        /* PAUSE MUSIC */
        /* ============================================= */

        else {

            audio.pause();

            isMusicManuallyPaused = true;

            musicToggle.classList.remove('rotating');

        }

    });

    /* ===================================================== */
    /* 4. PAGE VISIBILITY */
    /* ===================================================== */

    document.addEventListener(
        'visibilitychange',
        () => {

            if (!audio) {
                return;
            }

            /* ========================================= */
            /* TAB HIDDEN */
            /* ========================================= */

            if (document.hidden) {

                audio.pause();

                musicToggle.classList.remove(
                    'rotating'
                );

            }

            /* ========================================= */
            /* TAB ACTIVE AGAIN */
            /* ========================================= */

            else {

                // Hanya play lagi jika user
                // tidak pause manual

                if (
                    cover.classList.contains(
                        'pushed-up'
                    ) &&
                    !isMusicManuallyPaused
                ) {

                    audio.play().catch(err => {

                        console.log(
                            'Audio gagal diputar:',
                            err
                        );

                    });

                    musicToggle.classList.add(
                        'rotating'
                    );

                }

            }

        }
    );

    /* ===================================================== */
    /* 5. AUTO HIDE NAVBAR ON SCROLL */
    /* ===================================================== */

    if (container && navbar) {

        container.addEventListener(
            'scroll',
            () => {

                // Gunakan requestAnimationFrame
                // agar scroll event lebih ringan

                if (!ticking) {

                    window.requestAnimationFrame(
                        () => {

                            /* ===================== */
                            /* SCROLL VALUES */
                            /* ===================== */

                            let scrollTop =
                                container.scrollTop;

                            let scrollDelta =
                                scrollTop -
                                lastScrollTop;

                            if (
                                Math.abs(scrollDelta) < 5
                            ) {

                                ticking = false;

                                return;

                            }

                            /* ===================== */
                            /* HIDE NAVBAR */
                            /* ===================== */

                            if (
                                scrollDelta > 15 &&
                                scrollTop > 100
                            ) {

                                navbar.classList.add(
                                    'nav-hidden'
                                );

                            }

                            /* ===================== */
                            /* SHOW NAVBAR */
                            /* ===================== */

                            else {

                                navbar.classList.remove(
                                    'nav-hidden'
                                );

                            }

                            /* ===================== */
                            /* SAVE LAST SCROLL */
                            /* ===================== */

                            lastScrollTop =
                                scrollTop <= 0
                                    ? 0
                                    : scrollTop;

                            ticking = false;

                        }
                    );

                    ticking = true;

                }

            },
            { passive: true }
        );

    }

});