/*
------------------------------------------------------------------------
* Template Name    : Elvish | Responsive Bootstrap 4 Personal Template * 
* Author           : ThemesBoss                                        *
* Version          : 1.0.0                                             *
* Created          : May 2018                                          *
* File Description : Main Js file of the template                      *
*-----------------------------------------------------------------------
*/

! function($) {
    "use strict";

    var ElvishApp = function() {};

    //Preloader
    ElvishApp.prototype.initPreLoader = function() {
        $('#status').fadeOut();
        $('#preloader').delay(350).fadeOut('slow');
        $('body').delay(350).css({
            'overflow': 'visible'
        });
    },

    //scroll
    ElvishApp.prototype.initNavbarStickey = function() {
        $(window).on('scroll',function() {
            var scroll = $(window).scrollTop();

            if (scroll >= 50) {
                $(".sticky").addClass("stickyadd");
            } else {
                $(".sticky").removeClass("stickyadd");
            }
        });
    },

    //Smooth
    ElvishApp.prototype.initNavbarSmooth = function() {
        $('.navbar-nav a, .scroll_down a').on('click', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top - 0
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });
    },

    //ScrollSpy
    ElvishApp.prototype.initNavbarScrollSpy = function() {
        $("#navbarCollapse").scrollspy({
            offset: 20
        });
    },

    //Funfacts
    ElvishApp.prototype.initFunFacts = function() {
        var a = 0;
        $(window).on('scroll',function() {
            var oTop = $('#counter').offset().top - window.innerHeight;
            if (a == 0 && $(window).scrollTop() > oTop) {
                $('.lan_fun_value').each(function() {
                    var $this = $(this),
                        countTo = $this.attr('data-count');
                    $({
                        countNum: $this.text()
                    }).animate({
                            countNum: countTo
                        },
                        {
                            duration: 2000,
                            easing: 'swing',
                            step: function() {
                                $this.text(Math.floor(this.countNum));
                            },
                            complete: function() {
                                $this.text(this.countNum);
                                //alert('finished');
                            }

                        });
                });
                a = 1;
            }
        });
    },

    //Portfolio Filter
    ElvishApp.prototype.initPortfolioFilter = function() {
        var grid = document.querySelector('.work-filter');
        if (!grid) return;

        // Initialize Isotope with vanilla JS
        var iso = new Isotope(grid, {
            itemSelector: '.col-lg-4',
            layoutMode: 'masonry',
            filter: '*',
            percentPosition: true,
            transitionDuration: '0.75s'
        });

        // Filter button handling with event delegation
        var filterButtons = document.querySelector('#menu-filter');
        if (filterButtons) {
            filterButtons.addEventListener('click', function(event) {
                // Only handle <a> element clicks
                if (!event.target.matches('a')) return;

                event.preventDefault();

                var filterValue = event.target.getAttribute('data-filter');

                // Update active button state
                var currentActive = filterButtons.querySelector('.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }
                event.target.classList.add('active');

                // Apply filter using arrange method
                iso.arrange({ filter: filterValue });
            });
        }
    },

    //PhotoSwipe Lightbox
    ElvishApp.prototype.initMfpImages = function() {
        var lightbox = new PhotoSwipeLightbox({
            gallery: '#portfolio-gallery',
            children: 'a',
            pswpModule: PhotoSwipe,
            bgOpacity: 0.9,
            loop: true,
            arrowKeys: true,
            escKey: true,
            pinchToClose: true,
            closeOnVerticalDrag: true,
            trapFocus: true,
            returnFocus: true,
            preload: [1, 2]
        });
        lightbox.init();
    },

    //ClientSlider
    ElvishApp.prototype.initClientSlider = function() {
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

    //Back To Top
    ElvishApp.prototype.initBackToTop = function() {
        $(window).on('scroll',function(){
            if ($(this).scrollTop() > 100) {
                $('.back_top').fadeIn();
            } else {
                $('.back_top').fadeOut();
            }
        }); 
        $('.back_top').click(function(){
            $("html, body").animate({ scrollTop: 0 }, 1000);
            return false;
        });
    },

    //Typed Text
    ElvishApp.prototype.initTypedText = function() {
        $(".element").each(function() {
            var $this = $(this);
            $this.typed({
                strings: $this.attr('data-elements').split(','),
                typeSpeed: 100,
                backDelay: 3000
            });
        });
    },  

    ElvishApp.prototype.init = function() {
        this.initPreLoader();
        this.initNavbarStickey();
        this.initNavbarSmooth();
        this.initNavbarScrollSpy();
        this.initFunFacts();
        this.initPortfolioFilter();
        this.initMfpImages();
        this.initClientSlider();
        this.initBackToTop();
        this.initTypedText();
    },

    //init
    $.ElvishApp = new ElvishApp, $.ElvishApp.Constructor = ElvishApp
}(window.jQuery),

//initializing
function($) {
    "use strict";
    $.ElvishApp.init();
}(window.jQuery);