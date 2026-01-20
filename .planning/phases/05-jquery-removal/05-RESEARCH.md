# Phase 5: jQuery Removal - Research

**Researched:** 2026-01-20
**Domain:** jQuery to Vanilla JavaScript Migration
**Confidence:** HIGH

## Summary

This phase removes all jQuery dependencies from mitchellmeffert.com, converting the site to pure vanilla JavaScript. The codebase currently has jQuery in three categories:

1. **Contact form** - Uses `$.ajax()` for API calls and `$()` for DOM manipulation
2. **Custom.js functions** - 8 functions using jQuery for DOM manipulation, animations, and events
3. **Plugin dependencies** - jQuery Easing, Typed.js (old jQuery version), and scrollspy.min.js

The standard approach is to replace jQuery AJAX with native `fetch()`, jQuery DOM methods with native DOM APIs (`querySelector`, `classList`, `addEventListener`), and jQuery-dependent plugins with modern vanilla JS alternatives (Typed.js v2.1.0, CountUp.js for animations, Bootstrap 5's native scrollspy).

**Primary recommendation:** Convert all 8 custom.js functions to vanilla JS using native DOM APIs, replace typed.js with modern v2.1.0, remove jQuery Easing (use native `scrollIntoView` with CSS `scroll-behavior: smooth`), and replace scrollspy.min.js with Bootstrap 5's built-in scrollspy.

## Standard Stack

The established libraries/tools for jQuery-free implementation:

### Core (Replacements)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Native fetch API | Built-in | AJAX replacement for $.ajax() | Browser native, Promise-based, no dependencies |
| Typed.js | 2.1.0 | Typing animation | Same library, modern vanilla JS version |
| Bootstrap 5 ScrollSpy | 5.3.x | Scroll-based navigation highlighting | Already included in Bootstrap bundle |
| CountUp.js | 2.8.x | Number animation (optional) | Dependency-free, replaces jQuery animate for numbers |

### Supporting (Native APIs)

| API | Purpose | Replaces |
|-----|---------|----------|
| `document.querySelector/All` | Element selection | `$()` selector |
| `element.classList` | Class manipulation | `.addClass()`, `.removeClass()`, `.toggleClass()` |
| `element.addEventListener` | Event binding | `.on()`, `.click()` |
| `element.style` | Direct style manipulation | `.css()` |
| `element.scrollIntoView` | Smooth scrolling | `.animate({ scrollTop })` |
| `CSS scroll-behavior` | Native smooth scrolling | jQuery easing animations |
| `window.scrollY` | Scroll position | `$(window).scrollTop()` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native fetch | axios | Extra dependency, not needed for simple POST |
| Typed.js 2.1.0 | TypeIt.js | Typed.js is already used, just needs version update |
| Bootstrap ScrollSpy | gumshoe.js | Extra dependency when Bootstrap already provides it |
| CSS scroll-behavior | smooth-scroll polyfill | Not needed, 97%+ browser support for CSS property |

**Installation:**
```bash
# No npm install needed - using CDN pattern established in prior phases
# Typed.js CDN: https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js
```

## Architecture Patterns

### jQuery to Vanilla JS Conversion Map

| jQuery Pattern | Vanilla JS Equivalent |
|----------------|----------------------|
| `$(selector)` | `document.querySelector(selector)` or `document.querySelectorAll(selector)` |
| `$(selector).each(fn)` | `document.querySelectorAll(selector).forEach(fn)` |
| `$(el).addClass('x')` | `el.classList.add('x')` |
| `$(el).removeClass('x')` | `el.classList.remove('x')` |
| `$(el).toggleClass('x')` | `el.classList.toggle('x')` |
| `$(el).hasClass('x')` | `el.classList.contains('x')` |
| `$(el).attr('x')` | `el.getAttribute('x')` |
| `$(el).attr('x', 'y')` | `el.setAttribute('x', 'y')` |
| `$(el).css('prop', val)` | `el.style.prop = val` |
| `$(el).text()` | `el.textContent` |
| `$(el).text('x')` | `el.textContent = 'x'` |
| `$(el).val()` | `el.value` |
| `$(el).on('event', fn)` | `el.addEventListener('event', fn)` |
| `$(el).click(fn)` | `el.addEventListener('click', fn)` |
| `$(window).on('scroll', fn)` | `window.addEventListener('scroll', fn)` |
| `$(el).fadeIn()` | `el.style.opacity = '1'` + CSS transition |
| `$(el).fadeOut()` | `el.style.opacity = '0'` + CSS transition |
| `$(el).offset().top` | `el.getBoundingClientRect().top + window.scrollY` |
| `$(window).scrollTop()` | `window.scrollY` |
| `$('html, body').animate({scrollTop})` | `element.scrollIntoView({behavior: 'smooth'})` |

### Pattern 1: $.ajax() to fetch()

**What:** Convert jQuery AJAX calls to native Fetch API
**When to use:** All AJAX/XHR requests

```javascript
// Source: MDN - Using Fetch API
// Before (jQuery):
$.ajax({
    type: "POST",
    url: "https://api.example.com/endpoint",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(data),
    success: function(response) { /* handle success */ },
    error: function() { /* handle error */ }
});

// After (Vanilla JS):
try {
    const response = await fetch("https://api.example.com/endpoint", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    // handle success
} catch (error) {
    // handle error
}
```

### Pattern 2: Smooth Scroll Navigation

**What:** Replace jQuery animate scrollTop with native scrollIntoView
**When to use:** Any scroll-to-anchor navigation

```javascript
// Source: MDN - Element.scrollIntoView()
// Before (jQuery):
$('.navbar-nav a').on('click', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: $($anchor.attr('href')).offset().top - 0
    }, 1500, 'easeInOutExpo');
    event.preventDefault();
});

// After (Vanilla JS):
document.querySelectorAll('.navbar-nav a, .scroll_down a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
```

**CSS Enhancement (add to html element):**
```css
html {
    scroll-behavior: smooth;
}
```

### Pattern 3: Counter Animation

**What:** Replace jQuery animate for number counting with requestAnimationFrame
**When to use:** Fun facts counter section

```javascript
// Source: Vanilla JS implementation pattern
// Before (jQuery):
$({countNum: $this.text()}).animate({countNum: countTo}, {
    duration: 2000,
    easing: 'swing',
    step: function() { $this.text(Math.floor(this.countNum)); },
    complete: function() { $this.text(this.countNum); }
});

// After (Vanilla JS with requestAnimationFrame):
function animateValue(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (easeOutQuad)
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(start + (end - start) * easeProgress);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}
```

### Pattern 4: Typed.js v2.1.0 Migration

**What:** Update from jQuery-based typed.js to modern vanilla version
**When to use:** Hero section typing animation

```javascript
// Source: https://github.com/mattboldt/typed.js
// Before (jQuery plugin):
$(".element").each(function() {
    var $this = $(this);
    $this.typed({
        strings: $this.attr('data-elements').split(','),
        typeSpeed: 100,
        backDelay: 3000
    });
});

// After (Vanilla JS):
document.querySelectorAll('.element').forEach(function(el) {
    new Typed(el, {
        strings: el.getAttribute('data-elements').split(','),
        typeSpeed: 100,
        backDelay: 3000,
        loop: true
    });
});
```

### Pattern 5: Bootstrap 5 ScrollSpy

**What:** Replace scrollspy.min.js with Bootstrap's native scrollspy
**When to use:** Navigation highlighting on scroll

```javascript
// Source: https://getbootstrap.com/docs/5.3/components/scrollspy/
// Method 1: Data attributes (declarative)
// Add to body element:
<body data-bs-spy="scroll" data-bs-target="#navbarCollapse" data-bs-offset="20">

// Method 2: JavaScript initialization
const scrollSpy = new bootstrap.ScrollSpy(document.body, {
    target: '#navbarCollapse',
    rootMargin: '0px 0px -20%'
});
```

### Anti-Patterns to Avoid

- **Don't use jQuery slim build:** Removes AJAX which defeats the purpose. If keeping jQuery, use full build.
- **Don't polyfill fetch for ancient browsers:** Site already uses modern features, fetch() has 97%+ support.
- **Don't use multiple smooth-scroll libraries:** CSS `scroll-behavior: smooth` + `scrollIntoView` is sufficient.
- **Don't convert fadeIn/fadeOut to JavaScript:** Use CSS transitions with opacity changes instead.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Typing animation | Custom typing loop | Typed.js v2.1.0 | Cursor animation, smart backspace, multiple strings |
| AJAX requests | XMLHttpRequest wrapper | Native fetch API | Promise-based, built-in, handles CORS |
| Smooth scrolling | Custom animation loop | CSS scroll-behavior + scrollIntoView | Native, hardware accelerated, accessible |
| Scroll-based nav | Scroll event listener | Bootstrap 5 ScrollSpy | Already loaded, uses IntersectionObserver |
| Easing functions | Manual easing math | CSS transitions/requestAnimationFrame | Browser-optimized, simpler code |

**Key insight:** jQuery was essential in 2010 when browser APIs were inconsistent. In 2026, native APIs handle 99% of use cases better than jQuery wrappers.

## Common Pitfalls

### Pitfall 1: Forgetting jQuery's Implicit Iteration

**What goes wrong:** `document.querySelector('.class').classList.add('active')` fails when no element matches
**Why it happens:** jQuery silently does nothing on empty collections; native throws error
**How to avoid:** Always check for null or use `querySelectorAll().forEach()`
**Warning signs:** Uncaught TypeError: Cannot read property 'classList' of null

```javascript
// Safe pattern:
const element = document.querySelector('.class');
if (element) {
    element.classList.add('active');
}

// Or use optional chaining:
document.querySelector('.class')?.classList.add('active');
```

### Pitfall 2: Event Delegation Differences

**What goes wrong:** Events stop working after DOM changes
**Why it happens:** jQuery `.on()` with delegation re-evaluates selector; native doesn't
**How to avoid:** Use event delegation pattern with closest() or matches()
**Warning signs:** Click handlers work initially but fail on dynamically added elements

```javascript
// Event delegation pattern:
document.addEventListener('click', function(event) {
    if (event.target.matches('.dynamic-button')) {
        // Handle click
    }
});
```

### Pitfall 3: Scroll Position Calculation

**What goes wrong:** Scroll position off by header height
**Why it happens:** jQuery `.offset().top` gives absolute position; `scrollIntoView` doesn't account for fixed headers
**How to avoid:** Use CSS `scroll-margin-top` on target sections
**Warning signs:** Sections scroll behind fixed navbar

```css
/* Add to sections with fixed header */
section[id] {
    scroll-margin-top: 70px; /* Height of fixed header */
}
```

### Pitfall 4: Animation Timing

**What goes wrong:** Fade effects feel jerky or instant
**Why it happens:** Missing CSS transition property
**How to avoid:** Always pair style changes with CSS transitions
**Warning signs:** Elements appear/disappear instantly instead of fading

```css
/* Required for fade effects */
.fade-element {
    transition: opacity 0.35s ease;
}
```

### Pitfall 5: Window vs Document Scroll Events

**What goes wrong:** Scroll events fire inconsistently
**Why it happens:** jQuery normalizes scroll on window; native behavior varies
**How to avoid:** Always use `window.addEventListener('scroll', ...)` for page scroll
**Warning signs:** Scroll handlers work in some browsers but not others

## Code Examples

Verified patterns from official sources:

### Complete Contact Form Conversion

```javascript
// Source: MDN Using Fetch API + native DOM
async function submitToAPI(e) {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('mail');
    const subjectInput = document.getElementById('subject');
    const commentInput = document.getElementById('comment');
    const messageDiv = document.getElementById('message');

    // Validation
    const nameRegex = /[A-Za-z]{2,}/;
    if (!nameRegex.test(nameInput.value)) {
        alert("Name must be at least 2 characters");
        return;
    }

    if (!emailInput.value) {
        alert("Please enter your email");
        return;
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/;
    if (!emailRegex.test(emailInput.value)) {
        alert("Please enter a valid email address");
        return;
    }

    try {
        const token = await grecaptcha.enterprise.execute(
            '6LclXjYsAAAAAOGddQLVaLNDsjXeDfajOgJtvdfD',
            { action: 'contact_submit' }
        );

        const response = await fetch(
            'https://txy7g2ztcmlm7klk5ptcv5zze40schil.lambda-url.us-east-1.on.aws/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    name: nameInput.value,
                    email: emailInput.value,
                    subject: subjectInput.value,
                    message: commentInput.value,
                    recaptchaToken: token
                })
            }
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        messageDiv.style.color = 'green';
        messageDiv.textContent = 'Message Sent Successfully';
        nameInput.value = '';
        emailInput.value = '';
        subjectInput.value = '';
        commentInput.value = '';

    } catch (err) {
        console.error('Error:', err);
        messageDiv.style.color = 'red';
        messageDiv.textContent = err.message.includes('reCAPTCHA')
            ? 'Security verification failed. Please try again.'
            : 'Error. Your message was not sent.';
    }
}
```

### Complete custom.js Conversion

```javascript
// Source: Native DOM APIs documented at MDN
(function() {
    "use strict";

    var ElvishApp = {

        // Preloader
        initPreLoader: function() {
            const status = document.getElementById('status');
            const preloader = document.getElementById('preloader');
            const body = document.body;

            // Fade out status
            status.style.transition = 'opacity 0.35s ease';
            status.style.opacity = '0';

            setTimeout(function() {
                status.style.display = 'none';
                preloader.style.transition = 'opacity 0.35s ease';
                preloader.style.opacity = '0';

                setTimeout(function() {
                    preloader.style.display = 'none';
                    body.style.overflow = 'visible';
                }, 350);
            }, 350);
        },

        // Navbar sticky on scroll
        initNavbarStickey: function() {
            window.addEventListener('scroll', function() {
                const sticky = document.querySelector('.sticky');
                if (!sticky) return;

                if (window.scrollY >= 50) {
                    sticky.classList.add('stickyadd');
                } else {
                    sticky.classList.remove('stickyadd');
                }
            });
        },

        // Smooth scroll navigation
        initNavbarSmooth: function() {
            document.querySelectorAll('.navbar-nav a, .scroll_down a').forEach(function(link) {
                link.addEventListener('click', function(event) {
                    const href = this.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        event.preventDefault();
                        const target = document.querySelector(href);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            });
        },

        // ScrollSpy - using Bootstrap 5's native scrollspy
        initNavbarScrollSpy: function() {
            // Bootstrap 5 scrollspy via data attributes or JS
            // Add data-bs-spy="scroll" data-bs-target="#navbarCollapse" to body
            // Or initialize via JS:
            const scrollSpyElement = document.body;
            if (typeof bootstrap !== 'undefined' && bootstrap.ScrollSpy) {
                new bootstrap.ScrollSpy(scrollSpyElement, {
                    target: '#navbarCollapse',
                    rootMargin: '0px 0px -20%'
                });
            }
        },

        // Fun facts counter
        initFunFacts: function() {
            var counted = false;
            var counterSection = document.getElementById('counter');
            if (!counterSection) return;

            function animateValue(element, start, end, duration) {
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = 1 - (1 - progress) * (1 - progress);
                    const current = Math.floor(start + (end - start) * easeProgress);

                    element.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }

                requestAnimationFrame(update);
            }

            window.addEventListener('scroll', function() {
                if (counted) return;

                const rect = counterSection.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (rect.top < windowHeight) {
                    counted = true;
                    document.querySelectorAll('.lan_fun_value').forEach(function(el) {
                        const countTo = parseInt(el.getAttribute('data-count'), 10);
                        animateValue(el, 0, countTo, 2000);
                    });
                }
            });
        },

        // Portfolio filter - already vanilla in current code
        initPortfolioFilter: function() {
            // This was converted in Phase 4 - no changes needed
            var grid = document.querySelector('.work-filter');
            if (!grid) return;

            var iso = new Isotope(grid, {
                itemSelector: '.col-lg-4',
                layoutMode: 'masonry',
                filter: '*',
                percentPosition: true,
                transitionDuration: '0.75s'
            });

            var filterButtons = document.querySelector('#menu-filter');
            if (filterButtons) {
                filterButtons.addEventListener('click', function(event) {
                    if (!event.target.matches('a')) return;
                    event.preventDefault();

                    var filterValue = event.target.getAttribute('data-filter');
                    var currentActive = filterButtons.querySelector('.active');
                    if (currentActive) {
                        currentActive.classList.remove('active');
                    }
                    event.target.classList.add('active');
                    iso.arrange({ filter: filterValue });
                });
            }
        },

        // PhotoSwipe - already vanilla in current code
        initMfpImages: function() {
            // This was converted in Phase 3 - no changes needed
            var lightbox = new PhotoSwipeLightbox({
                gallery: '#portfolio-gallery',
                children: 'a',
                pswpModule: PhotoSwipe
                // ... rest of config
            });
            lightbox.init();
        },

        // Splide carousel - already vanilla in current code
        initClientSlider: function() {
            // This was converted in Phase 2 - no changes needed
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

        // Back to top button
        initBackToTop: function() {
            var backTop = document.querySelector('.back_top');
            if (!backTop) return;

            // Show/hide based on scroll position
            window.addEventListener('scroll', function() {
                if (window.scrollY > 100) {
                    backTop.style.opacity = '1';
                    backTop.style.visibility = 'visible';
                } else {
                    backTop.style.opacity = '0';
                    backTop.style.visibility = 'hidden';
                }
            });

            // Scroll to top on click
            backTop.addEventListener('click', function(event) {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        },

        // Typed text - handled separately with Typed.js v2.1.0
        initTypedText: function() {
            // This will be handled in index.html with new Typed() API
        },

        init: function() {
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
```

### CSS Additions for Smooth Scrolling

```css
/* Source: MDN CSS scroll-behavior */
html {
    scroll-behavior: smooth;
}

/* Account for fixed header when scrolling to sections */
section[id] {
    scroll-margin-top: 70px;
}

/* Transition for fade effects */
#preloader,
#status,
.back_top {
    transition: opacity 0.35s ease, visibility 0.35s ease;
}

.back_top {
    opacity: 0;
    visibility: hidden;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| $.ajax() | fetch() API | Standardized 2015, widespread 2017+ | Promise-based, cleaner syntax |
| jQuery Easing | CSS transitions + scroll-behavior | CSS scroll-behavior 2017 | No JS needed for basic easing |
| scrollspy.js plugins | Bootstrap 5 ScrollSpy (IntersectionObserver) | Bootstrap 5 (2021) | Better performance, no jQuery |
| jQuery animate | requestAnimationFrame + CSS | rAF since 2012, CSS animations widespread | Hardware accelerated |
| Typed.js jQuery plugin | Typed.js 2.x vanilla | v2.0 released 2017 | Same API, no jQuery dependency |

**Deprecated/outdated:**
- jQuery 1.x/2.x: Security vulnerabilities, use 3.x if jQuery needed
- jQuery Easing plugin: CSS handles this natively
- Custom scrollspy.min.js: Bootstrap 5 includes this functionality

## Open Questions

Things that couldn't be fully resolved:

1. **Counter animation library vs DIY**
   - What we know: CountUp.js is popular, but requestAnimationFrame pattern is simple
   - What's unclear: Whether the existing counter animation needs special easing
   - Recommendation: Use DIY requestAnimationFrame approach - only 4 numbers to animate, simpler than adding another library

2. **Bootstrap ScrollSpy initialization method**
   - What we know: Can use data attributes OR JavaScript initialization
   - What's unclear: Current scrollspy.min.js may have custom behavior
   - Recommendation: Use Bootstrap's data attributes method - simplest, already have Bootstrap loaded

## Sources

### Primary (HIGH confidence)
- [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) - fetch() patterns
- [MDN: Element.scrollIntoView()](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) - smooth scrolling
- [Bootstrap 5.3 ScrollSpy](https://getbootstrap.com/docs/5.3/components/scrollspy/) - native scrollspy
- [Typed.js GitHub](https://github.com/mattboldt/typed.js) - v2.1.0 vanilla JS usage

### Secondary (MEDIUM confidence)
- [jsDelivr Typed.js](https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js) - CDN availability verified
- WebSearch verified with official docs for all patterns

### Tertiary (LOW confidence)
- None - all patterns verified with official documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All recommendations based on official documentation
- Architecture: HIGH - Conversion patterns from MDN and Bootstrap official docs
- Pitfalls: HIGH - Common issues documented in community resources, verified with official docs

**Research date:** 2026-01-20
**Valid until:** 2026-02-20 (stable technologies, 30-day validity)
