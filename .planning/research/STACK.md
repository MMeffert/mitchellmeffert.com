# Technology Stack

**Project:** mitchellmeffert.com Portfolio Modernization
**Researched:** 2026-01-19
**Research Mode:** Ecosystem (Stack Dimension)

## Executive Summary

Modernize from a 2018 Bootstrap 4 + jQuery template to Bootstrap 5.3.x + vanilla JavaScript. The key insight: **jQuery is no longer needed**. Bootstrap 5 dropped jQuery entirely, and all plugins used (Owl Carousel, Isotope, Magnific Popup, Typed.js) have modern vanilla JS alternatives or are already vanilla JS compatible.

**Migration complexity: MEDIUM** - Most changes are class renames and data attribute updates, not architectural rewrites.

---

## Current Stack (To Replace)

| Technology | Version | Status | Issue |
|------------|---------|--------|-------|
| Bootstrap | 4.x | End of Life | jQuery dependency, outdated class names |
| jQuery | 3.x | Unnecessary | Adds ~87KB, no longer needed |
| Owl Carousel | 2.x | Deprecated | Officially archived, recommends Tiny Slider |
| Isotope | 3.x | Active | jQuery-optional, but alternatives are lighter |
| Magnific Popup | 1.x | Unmaintained | jQuery-dependent, no updates since 2016 |
| Typed.js | Old | Active | Already vanilla JS, just needs update |
| Animate.css | 3.x | Active | Still fine, optional upgrade |
| Material Design Icons | Old | Active | Consider Bootstrap Icons for consistency |

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **Bootstrap** | 5.3.8 | CSS framework, responsive grid, components | HIGH |

**Why Bootstrap 5.3.8:**
- Current stable release (as of late 2025)
- Dropped jQuery entirely - vanilla JS only
- RTL support built-in (left/right -> start/end)
- Improved color contrast (WCAG 2.1 AA)
- CSS custom properties for theming
- Same familiar grid system with new xxl breakpoint

**Installation:**
```html
<!-- CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- JS (no jQuery needed) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
```

**Source:** [Bootstrap Official Documentation](https://getbootstrap.com/docs/5.3/migration/)

---

### Carousel/Slider Replacement

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **Splide.js** | 4.1.3 | Testimonials carousel | HIGH |

**Why Splide over alternatives:**

| Option | Size | jQuery | Accessibility | Verdict |
|--------|------|--------|---------------|---------|
| Owl Carousel 2 | ~47KB | Required | Poor | DEPRECATED - Do not use |
| Tiny Slider | ~35KB | No | Good | Good alternative |
| Swiper.js | ~140KB | No | Good | Overkill for testimonials |
| **Splide.js** | **29KB (12KB gzipped)** | **No** | **WCAG 2.1 AA** | **RECOMMENDED** |
| Glider.js | ~13KB | No | Basic | Smaller but fewer features |

**Why Splide specifically:**
- Smallest full-featured option at 12KB gzipped
- Built-in accessibility (Live Region support, keyboard nav)
- TypeScript-native, zero dependencies
- Touch/swipe support out of box
- Simple migration from Owl Carousel API

**Installation:**
```bash
npm install @splidejs/splide
```

Or CDN:
```html
<link href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.3/dist/css/splide.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.3/dist/js/splide.min.js"></script>
```

**Migration example:**
```javascript
// OLD: Owl Carousel (jQuery)
$("#owl-demo").owlCarousel({
    autoPlay: 7000,
    singleItem: true
});

// NEW: Splide (Vanilla JS)
new Splide('#testimonial-slider', {
    type: 'loop',
    autoplay: true,
    interval: 7000,
    pauseOnHover: true
}).mount();
```

**Source:** [Splide.js Official](https://splidejs.com/), [GitHub](https://github.com/Splidejs/splide)

---

### Portfolio Grid/Filter Replacement

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **Shuffle.js** | 6.1.2 | Portfolio filtering, masonry layout | HIGH |

**Why Shuffle.js over alternatives:**

| Option | Size | jQuery | Filtering | Verdict |
|--------|------|--------|-----------|---------|
| Isotope | ~24KB | Optional | Yes | Good but heavier API |
| Masonry | ~22KB | Optional | No (layout only) | Need separate filter solution |
| **Shuffle.js** | **~8KB gzipped** | **No (since v4)** | **Yes** | **RECOMMENDED** |
| Muuri | ~35KB | No | Yes | More features than needed |

**Why Shuffle.js specifically:**
- Designed specifically for filtering + sorting + responsive grids
- Inspired by Isotope but lighter and modernized
- Pure vanilla JS since v4
- Smooth CSS3 transitions
- Very similar API to Isotope (easy migration)

**Installation:**
```bash
npm install shufflejs
```

Or CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/shufflejs@6.1.2/dist/shuffle.min.js"></script>
```

**Migration example:**
```javascript
// OLD: Isotope (jQuery)
$('.work-filter').isotope({
    filter: '*',
    layoutMode: 'masonry'
});

// NEW: Shuffle.js (Vanilla JS)
const shuffleInstance = new Shuffle(document.querySelector('.work-filter'), {
    itemSelector: '.col-lg-4',
    sizer: '.shuffle-sizer'
});

// Filter
document.querySelectorAll('#menu-filter a').forEach(link => {
    link.addEventListener('click', (e) => {
        const filterValue = e.target.dataset.filter;
        shuffleInstance.filter(filterValue === '*' ? Shuffle.ALL_ITEMS : filterValue);
    });
});
```

**Source:** [Shuffle.js Official](https://shuffle.js.org/), [GitHub](https://github.com/Vestride/Shuffle)

---

### Lightbox Replacement

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **PhotoSwipe** | 5.4.4 | Image lightbox/gallery | HIGH |

**Why PhotoSwipe over alternatives:**

| Option | Size | jQuery | Touch | Verdict |
|--------|------|--------|-------|---------|
| Magnific Popup | ~20KB | Required | Basic | UNMAINTAINED |
| Fancybox | ~50KB | Optional | Good | Heavier, commercial license |
| LightGallery | ~30KB | No | Good | Good alternative |
| **PhotoSwipe** | **~50KB (15KB core)** | **No** | **Excellent** | **RECOMMENDED** |

**Why PhotoSwipe specifically:**
- Same author as Magnific Popup (Dmitry Semenov) - natural successor
- ES6 modules, dynamic imports (only loads what's needed)
- Best-in-class touch/swipe gestures
- srcset support for responsive images
- MIT license

**Installation:**
```bash
npm install photoswipe
```

Or CDN:
```html
<link href="https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.css" rel="stylesheet">
<script type="module">
import PhotoSwipeLightbox from 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe-lightbox.esm.min.js';
import PhotoSwipe from 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.esm.min.js';

const lightbox = new PhotoSwipeLightbox({
    gallery: '#work',
    children: 'a.img-zoom',
    pswpModule: PhotoSwipe
});
lightbox.init();
</script>
```

**Source:** [PhotoSwipe Official](https://photoswipe.com/), [GitHub](https://github.com/dimsemenov/PhotoSwipe)

---

### Typing Animation

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **Typed.js** | 2.1.0 | Hero section typing effect | HIGH |

**Why keep Typed.js:**
- Already vanilla JavaScript (no jQuery required)
- Just needs version update
- Most popular option, well-maintained
- ~5KB minified

**Alternative considered:** TypeIt is slightly more feature-rich but requires commercial license for business sites.

**Installation:**
```bash
npm install typed.js
```

Or CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js"></script>
```

**Migration (minimal):**
```javascript
// Current (old jQuery-style initialization)
$(".element").typed({
    strings: $this.attr('data-elements').split(','),
    typeSpeed: 100
});

// New (vanilla JS)
new Typed('.element', {
    strings: ['Mitchell Meffert.', 'A Web Developer.', 'A Programmer.', 'A Business Owner'],
    typeSpeed: 100,
    backDelay: 3000,
    loop: true
});
```

**Source:** [Typed.js GitHub](https://github.com/mattboldt/typed.js)

---

### Icons

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **Bootstrap Icons** | 1.13.1 | UI icons, social icons | MEDIUM |

**Why Bootstrap Icons over Material Design Icons:**

| Option | Icons | Size | Consistency |
|--------|-------|------|-------------|
| Material Design Icons | 7,000+ | Large | Google ecosystem |
| **Bootstrap Icons** | 2,000+ | **Font: 170KB, SVG: on-demand** | **Bootstrap native** |
| Heroicons | 300+ | Very small | Tailwind ecosystem |
| Lucide | 1,500+ | Small | Modern, community-driven |

**Why Bootstrap Icons:**
- Native Bootstrap integration (same team)
- Consistent design language with Bootstrap 5
- Available as font OR individual SVGs
- MIT license
- Covers all icons currently used (social, UI)

**Current icons needed:**
- Social: Facebook, LinkedIn, Instagram, Reddit, YouTube, StackOverflow, Camera
- UI: Timer, Gift, User, Users, Arrow-down, Arrow-up, Asterisk, Database, etc.

**Installation:**
```bash
npm install bootstrap-icons
```

Or CDN (font approach):
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" rel="stylesheet">
```

**Note:** Confidence is MEDIUM because current MDI icons work fine. This is an optional modernization for consistency.

**Source:** [Bootstrap Icons Official](https://icons.getbootstrap.com/)

---

### CSS Animations

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **Animate.css** | 4.1.1 | Entrance/exit animations | HIGH |

**Keep Animate.css:** It's lightweight (~3KB gzipped), still actively maintained, and works perfectly. No jQuery dependency. Just update to v4.1.1 for latest features.

**Only change:** Class names changed in v4:
```html
<!-- v3 -->
<div class="animated fadeIn">

<!-- v4 -->
<div class="animate__animated animate__fadeIn">
```

**Source:** [Animate.css Official](https://animate.style/)

---

## What NOT to Use

| Technology | Why Not |
|------------|---------|
| jQuery | Bootstrap 5 doesn't need it, all replacements are vanilla JS |
| Owl Carousel | Officially deprecated/archived |
| Magnific Popup | Unmaintained since 2016, jQuery-dependent |
| Swiper.js | Overkill at 140KB for a simple testimonial slider |
| GSAP | Overkill for simple scroll animations |
| React/Vue/Angular | Static portfolio doesn't need SPA framework complexity |

---

## Bundle Size Comparison

| Stack | Total Size (minified) |
|-------|----------------------|
| **Current (jQuery + plugins)** | ~350KB |
| **Proposed (vanilla JS)** | ~150KB |
| **Savings** | **~200KB (57% reduction)** |

Breakdown of proposed stack:
- Bootstrap 5.3 CSS: ~25KB gzipped
- Bootstrap 5.3 JS: ~20KB gzipped
- Splide.js: ~12KB gzipped
- Shuffle.js: ~8KB gzipped
- PhotoSwipe: ~15KB gzipped
- Typed.js: ~5KB gzipped
- Bootstrap Icons (font): ~20KB gzipped
- Animate.css: ~3KB gzipped

---

## Installation Summary

### NPM (if using build tools)
```bash
npm install bootstrap@5.3.8 @splidejs/splide shufflejs photoswipe typed.js bootstrap-icons animate.css
```

### CDN (for static HTML)
```html
<!-- CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.3/dist/css/splide.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css" rel="stylesheet">

<!-- JS (at end of body) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.3/dist/js/splide.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/shufflejs@6.1.2/dist/shuffle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js"></script>
<script type="module">
import PhotoSwipeLightbox from 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe-lightbox.esm.min.js';
import PhotoSwipe from 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.esm.min.js';
// Initialize lightbox...
</script>
```

---

## Bootstrap 4 to 5 Migration Cheatsheet

### Class Name Changes (Most Common)

| Bootstrap 4 | Bootstrap 5 |
|-------------|-------------|
| `ml-*`, `mr-*` | `ms-*`, `me-*` |
| `pl-*`, `pr-*` | `ps-*`, `pe-*` |
| `float-left`, `float-right` | `float-start`, `float-end` |
| `text-left`, `text-right` | `text-start`, `text-end` |
| `border-left`, `border-right` | `border-start`, `border-end` |
| `font-weight-bold` | `fw-bold` |
| `font-weight-normal` | `fw-normal` |
| `sr-only` | `visually-hidden` |
| `no-gutters` | `g-0` |

### Data Attribute Changes

| Bootstrap 4 | Bootstrap 5 |
|-------------|-------------|
| `data-toggle` | `data-bs-toggle` |
| `data-target` | `data-bs-target` |
| `data-dismiss` | `data-bs-dismiss` |
| `data-slide` | `data-bs-slide` |

### Dropped Components

| Removed | Replacement |
|---------|-------------|
| `.media` | Flex utilities |
| `.jumbotron` | Utilities or custom CSS |
| `.btn-block` | `.d-grid` wrapper |
| `.form-group` | Margin utilities |
| `.form-row` | `.row` with `.g-*` gutters |

**Source:** [Bootstrap 5 Migration Guide](https://getbootstrap.com/docs/5.3/migration/)

---

## Confidence Assessment

| Component | Confidence | Reason |
|-----------|------------|--------|
| Bootstrap 5.3.8 | HIGH | Official stable release, verified via getbootstrap.com |
| Splide.js 4.1.3 | HIGH | Active maintenance, excellent docs, verified GitHub |
| Shuffle.js 6.1.2 | HIGH | Stable release, purpose-built for filtering grids |
| PhotoSwipe 5.4.4 | HIGH | Same author as Magnific Popup, natural migration path |
| Typed.js 2.1.0 | HIGH | Already vanilla JS, just version update needed |
| Bootstrap Icons 1.13.1 | MEDIUM | Optional - current icons work, this is for consistency |
| Animate.css 4.1.1 | HIGH | Minimal changes needed, stable library |

---

## Sources

- [Bootstrap 5 Official Documentation](https://getbootstrap.com/docs/5.3/)
- [Bootstrap 5 Migration Guide](https://getbootstrap.com/docs/5.3/migration/)
- [Splide.js Official](https://splidejs.com/)
- [Splide.js GitHub](https://github.com/Splidejs/splide)
- [Shuffle.js Official](https://shuffle.js.org/)
- [Shuffle.js GitHub](https://github.com/Vestride/Shuffle)
- [PhotoSwipe Official](https://photoswipe.com/)
- [PhotoSwipe GitHub](https://github.com/dimsemenov/PhotoSwipe)
- [Typed.js GitHub](https://github.com/mattboldt/typed.js)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Animate.css](https://animate.style/)
- [Owl Carousel GitHub (archived)](https://github.com/OwlCarousel2/OwlCarousel2)
