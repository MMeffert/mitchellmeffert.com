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

    // Honor the OS-level "reduce motion" preference (WCAG 2.3.3): skip decorative
    // animations and fall back to instant scrolling when it is set.
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

        // Smooth scroll for in-page anchor links
        initSmoothScroll: function() {
            document.querySelectorAll('.scroll_down a, .header_btn a').forEach(function(link) {
                link.addEventListener('click', function(event) {
                    var href = this.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        event.preventDefault();
                        var target = document.querySelector(href);
                        if (target) {
                            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
                        }
                    }
                });
            });
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

            function maybeCount() {
                if (counted) return;

                var rect = counterSection.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    counted = true;
                    document.querySelectorAll('.lan_fun_value').forEach(function(el) {
                        var countTo = parseInt(el.getAttribute('data-count'), 10);
                        if (prefersReducedMotion) {
                            el.textContent = countTo;
                        } else {
                            animateValue(el, 0, countTo, 2000);
                        }
                    });
                }
            }

            window.addEventListener('scroll', maybeCount, { passive: true });
            // Run once on init in case the counter is already in view (tall viewport / short page)
            maybeCount();
        },

        // Client Slider (Splide)
        initClientSlider: function() {
            var carousel = document.getElementById('testimonial-carousel');
            if (!carousel) return;

            // If the vendor script failed to load, skip the carousel instead of
            // throwing and taking the rest of init() down with it.
            if (typeof Splide === 'undefined') return;

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
            }, { passive: true });

            backTop.addEventListener('click', function(event) {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            });
        },

        // Typed Text animation
        initTypedText: function() {
            document.querySelectorAll('.element').forEach(function(el) {
                var dataElements = el.getAttribute('data-elements');
                if (!dataElements) return;

                // Reduced motion: show the first phrase statically instead of the
                // endless type/erase loop. (Splide handles this itself via its
                // built-in reducedMotion defaults, so only Typed.js needs a guard.)
                // Same static fallback if the Typed.js vendor script failed to load.
                if (prefersReducedMotion || typeof Typed === 'undefined') {
                    el.textContent = dataElements.split(',')[0];
                    return;
                }

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

        // Contact form: client-side validation, reCAPTCHA Enterprise, submit to Lambda.
        // Moved out of inline HTML so the CSP can forbid inline script.
        initContactForm: function() {
            var form = document.getElementById('working_form');
            if (!form) return;

            var submitBtn = document.getElementById('submit');
            var messageDiv = document.getElementById('message');
            var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            var siteKey = '6LclXjYsAAAAAOGddQLVaLNDsjXeDfajOgJtvdfD';
            var endpoint = 'https://txy7g2ztcmlm7klk5ptcv5zze40schil.lambda-url.us-east-1.on.aws/';

            // WCAG-friendly feedback colors (>=4.5:1 on the white form background)
            var ERROR_COLOR = '#b00020';
            var SUCCESS_COLOR = '#1e7e34';

            function showMessage(text, color) {
                messageDiv.style.color = color;
                messageDiv.textContent = text;
            }

            function markInvalid(input, message) {
                input.setAttribute('aria-invalid', 'true');
                input.focus();
                showMessage(message, ERROR_COLOR);
            }

            form.addEventListener('submit', async function(event) {
                event.preventDefault();

                var nameInput = document.getElementById('name');
                var emailInput = document.getElementById('mail');
                var subjectInput = document.getElementById('subject');
                var commentInput = document.getElementById('comment');

                [nameInput, emailInput, subjectInput, commentInput].forEach(function(input) {
                    input.removeAttribute('aria-invalid');
                });

                if (nameInput.value.trim().length < 2) {
                    markInvalid(nameInput, 'Please enter your name (at least 2 characters).');
                    return;
                }
                if (!emailRe.test(emailInput.value.trim())) {
                    markInvalid(emailInput, 'Please enter a valid email address.');
                    return;
                }
                if (subjectInput.value.trim() === '') {
                    markInvalid(subjectInput, 'Please enter a subject.');
                    return;
                }
                if (commentInput.value.trim() === '') {
                    markInvalid(commentInput, 'Please enter a message.');
                    return;
                }

                // reCAPTCHA loads deferred; guard against an early submit before it is ready
                if (typeof grecaptcha === 'undefined' || !grecaptcha.enterprise) {
                    showMessage('Security verification is still loading. Please try again in a moment.', ERROR_COLOR);
                    return;
                }

                // Prevent double submission while the request is in flight
                if (submitBtn) submitBtn.disabled = true;

                try {
                    var token = await grecaptcha.enterprise.execute(siteKey, { action: 'contact_submit' });

                    var response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json; charset=utf-8' },
                        body: JSON.stringify({
                            name: nameInput.value,
                            email: emailInput.value,
                            subject: subjectInput.value,
                            message: commentInput.value,
                            recaptchaToken: token
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    showMessage('Message Sent Successfully', SUCCESS_COLOR);
                    form.reset();
                } catch (err) {
                    console.error('Contact form error:', err);
                    showMessage('Error. Your message was not sent. Please try again.', ERROR_COLOR);
                } finally {
                    if (submitBtn) submitBtn.disabled = false;
                }
            });
        },

        // Footer copyright year
        initCopyrightYear: function() {
            var yearEl = document.getElementById('copyright-year');
            if (yearEl) {
                yearEl.textContent = new Date().getFullYear();
            }
        },

        init: function() {
            this.initPreLoader();
            this.initSmoothScroll();
            this.initFunFacts();
            this.initClientSlider();
            this.initBackToTop();
            this.initTypedText();
            this.initContactForm();
            this.initCopyrightYear();
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
