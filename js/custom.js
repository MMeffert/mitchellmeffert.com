/*
------------------------------------------------------------------------
* Template Name    : Elvish | Responsive Bootstrap 4 Personal Template *
* Author           : ThemesBoss                                        *
* Version          : 1.0.0                                             *
* Created          : May 2018                                          *
* File Description : Main Js file of the template                      *
*-----------------------------------------------------------------------
*/

(function() {
    "use strict";

    var ElvishApp = {
        // Preloader
        initPreLoader: function() {
            var status = document.getElementById('status');
            var preloader = document.getElementById('preloader');

            if (!status || !preloader) return;

            // Fade out status
            status.style.opacity = '0';

            setTimeout(function() {
                status.style.display = 'none';
                preloader.style.opacity = '0';

                setTimeout(function() {
                    preloader.style.display = 'none';
                    document.body.style.overflow = 'visible';
                }, 350);
            }, 350);
        },

        // Scroll - sticky navbar
        initNavbarStickey: function() {
            window.addEventListener('scroll', function() {
                var sticky = document.querySelector('.sticky');
                if (!sticky) return;

                if (window.scrollY >= 50) {
                    sticky.classList.add('stickyadd');
                } else {
                    sticky.classList.remove('stickyadd');
                }
            });
        },

        // Smooth scroll for navigation links
        initNavbarSmooth: function() {
            document.querySelectorAll('.navbar-nav a, .scroll_down a').forEach(function(link) {
                link.addEventListener('click', function(event) {
                    var href = this.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        event.preventDefault();
                        var target = document.querySelector(href);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            });
        },

        // ScrollSpy - Bootstrap 5 handles this via data attributes on body
        initNavbarScrollSpy: function() {
            // Bootstrap 5 ScrollSpy initialized via data attributes on body
            // This function is kept for API compatibility but is now a no-op
        },

        // Fun Facts counter animation
        initFunFacts: function() {
            var counted = false;
            var counterSection = document.getElementById('counter');
            if (!counterSection) return;

            function animateValue(element, start, end, duration) {
                var startTime = performance.now();

                function update(currentTime) {
                    var elapsed = currentTime - startTime;
                    var progress = Math.min(elapsed / duration, 1);
                    // easeOutQuad easing
                    var easeProgress = 1 - (1 - progress) * (1 - progress);
                    var current = Math.floor(start + (end - start) * easeProgress);
                    element.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }

                requestAnimationFrame(update);
            }

            window.addEventListener('scroll', function() {
                if (counted) return;

                var rect = counterSection.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    counted = true;
                    document.querySelectorAll('.lan_fun_value').forEach(function(el) {
                        var countTo = parseInt(el.getAttribute('data-count'), 10);
                        animateValue(el, 0, countTo, 2000);
                    });
                }
            });
        },

        // Client Slider (Splide)
        initClientSlider: function() {
            var carousel = document.getElementById('testimonial-carousel');
            if (!carousel) return;

            new Splide('#testimonial-carousel', {
                type: 'loop',
                perPage: 1,
                autoplay: true,
                interval: 7000,
                pauseOnHover: true,
                pauseOnFocus: true,
                arrows: false,
                speed: 1000,
            }).mount();
        },

        // Back To Top button
        initBackToTop: function() {
            var backTop = document.querySelector('.back_top');
            if (!backTop) return;

            window.addEventListener('scroll', function() {
                if (window.scrollY > 100) {
                    backTop.style.opacity = '1';
                    backTop.style.visibility = 'visible';
                } else {
                    backTop.style.opacity = '0';
                    backTop.style.visibility = 'hidden';
                }
            });

            backTop.addEventListener('click', function(event) {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        },

        // Typed Text animation
        initTypedText: function() {
            document.querySelectorAll('.element').forEach(function(el) {
                var dataElements = el.getAttribute('data-elements');
                if (!dataElements) return;

                new Typed(el, {
                    strings: dataElements.split(','),
                    typeSpeed: 100,
                    backDelay: 3000,
                    backSpeed: 50,
                    loop: true,
                    showCursor: true,
                    cursorChar: '|'
                });
            });
        },

        init: function() {
            this.initPreLoader();
            this.initNavbarStickey();
            this.initNavbarSmooth();
            this.initNavbarScrollSpy();
            this.initFunFacts();
            this.initClientSlider();
            this.initBackToTop();
            this.initTypedText();
        }
    };

    // Initialize when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            ElvishApp.init();
        });
    } else {
        ElvishApp.init();
    }
})();
