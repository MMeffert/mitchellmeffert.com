# Phase 2: Carousel Migration - Research

**Researched:** 2026-01-20
**Domain:** JavaScript Carousel Libraries (Owl Carousel to Splide.js)
**Confidence:** HIGH

## Summary

This research documents the migration path from Owl Carousel v1.3.2 (jQuery-dependent, unmaintained since 2014) to Splide.js v4.1.4 (vanilla JS, actively maintained, accessibility-focused). The current testimonial carousel uses a simple single-item auto-rotating configuration that maps directly to Splide.js options.

The migration is straightforward because:
1. Both libraries use similar container/item HTML patterns
2. Splide.js is dependency-free (no jQuery required)
3. The current configuration (autoplay, pause-on-hover, single-item) has direct Splide equivalents
4. Splide.js provides WCAG-compliant accessibility out-of-the-box

**Primary recommendation:** Use Splide.js v4.1.4 via jsDelivr CDN. Replace Owl Carousel markup with Splide's `splide__track > splide__list > splide__slide` structure. Configure with `type: 'loop'`, `autoplay: true`, `interval: 7000`, `pauseOnHover: true`, and `perPage: 1`.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Splide.js | 4.1.4 | Carousel/slider | Zero dependencies, 29KB (12KB gzipped), WCAG compliant, no Lighthouse errors |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| splide.min.css | 4.1.4 | Base carousel styles | Always required - provides arrows, pagination, transitions |
| splide-core.min.css | 4.1.4 | Minimal styles | When fully customizing appearance (no arrow/pagination styles) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Splide.js | Swiper | Swiper is larger (140KB+), more features, enterprise adoption - overkill for single testimonial carousel |
| Splide.js | Glider.js | Glider is smaller but fewer features, less accessibility focus |
| Splide.js | Native CSS scroll-snap | No autoplay, limited animation control, browser inconsistencies |

**Installation (CDN):**
```html
<!-- CSS in <head> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css">

<!-- JS before </body> -->
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>
```

## Architecture Patterns

### Current Owl Carousel Structure (to be replaced)
```html
<div id="owl-demo" class="owl-carousel">
    <div class="text-white people_says text-center">
        <!-- testimonial content -->
    </div>
    <!-- more items -->
</div>
```

### Target Splide.js Structure
```html
<section class="splide" id="testimonial-carousel" aria-label="Testimonials">
    <div class="splide__track">
        <ul class="splide__list">
            <li class="splide__slide">
                <div class="text-white people_says text-center">
                    <!-- testimonial content -->
                </div>
            </li>
            <!-- more slides -->
        </ul>
    </div>
</section>
```

### Pattern 1: Splide Initialization
**What:** Initialize Splide on DOMContentLoaded with options matching current Owl behavior
**When to use:** Always - required for Splide to function
**Example:**
```javascript
// Source: https://splidejs.com/guides/getting-started/
document.addEventListener('DOMContentLoaded', function() {
    new Splide('#testimonial-carousel', {
        type: 'loop',           // Equivalent to Owl's rewind/loop behavior
        perPage: 1,             // Equivalent to Owl's singleItem: true
        autoplay: true,         // Equivalent to Owl's autoPlay: true
        interval: 7000,         // Equivalent to Owl's autoPlay: 7000
        pauseOnHover: true,     // Equivalent to Owl's stopOnHover: true
        pauseOnFocus: true,     // Accessibility: pause when focused
        arrows: false,          // Match current design (no navigation arrows)
        speed: 1000,            // Transition speed in ms
        rewind: true,           // Go back to first slide at end
    }).mount();
});
```

### Pattern 2: Option Mapping (Owl to Splide)
**What:** Direct mapping of Owl Carousel options to Splide equivalents
**When to use:** Reference when converting existing configuration

| Owl Carousel | Splide.js | Notes |
|--------------|-----------|-------|
| `autoPlay: 7000` | `autoplay: true` + `interval: 7000` | Splide separates enable/interval |
| `stopOnHover: true` | `pauseOnHover: true` | Direct equivalent |
| `singleItem: true` | `perPage: 1` | Direct equivalent |
| `navigation: false` | `arrows: false` | Direct equivalent |
| `paginationSpeed: 1000` | `speed: 1000` | Transition speed |

### Anti-Patterns to Avoid
- **Breaking track > list > slide hierarchy:** Splide requires strict parent-child relationship. Do not insert elements between track and list, or between list and slides.
- **Initializing before DOM ready:** Always wrap initialization in `DOMContentLoaded` event listener or place script at end of body.
- **Using `@latest` in CDN URLs:** Pin to specific version (4.1.4) to prevent breaking changes.
- **Forgetting to call `.mount()`:** Splide will not render without the `mount()` method call.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Touch/swipe support | Custom touch event handlers | Splide's built-in drag | Handles velocity, momentum, edge cases, cross-device |
| Keyboard navigation | Custom keydown listeners | Splide's `keyboard` option | WCAG-compliant, handles focus management |
| Autoplay with pause | setInterval with mouse events | Splide's autoplay component | Handles focus, hover, intersection observer, WCAG |
| Screen reader announcements | Custom ARIA live regions | Splide's Live Region | Automatically announces slide changes, pauses during autoplay |
| Reduced motion support | Manual prefers-reduced-motion | Splide's built-in detection | Automatically disables transitions when user prefers reduced motion |

**Key insight:** Carousel accessibility is extremely complex. Splide.js has spent years implementing WCAG-compliant behavior including live regions, focus management, roving tabindex, and reduced motion. Building custom solutions will miss edge cases.

## Common Pitfalls

### Pitfall 1: Invalid Root Element Error
**What goes wrong:** Console error "An invalid root element or selector was given"
**Why it happens:** Script runs before DOM is ready, or selector doesn't match any element
**How to avoid:** Always wrap in `DOMContentLoaded` event; verify selector matches HTML
**Warning signs:** Console error, carousel doesn't render

### Pitfall 2: Missing CSS File
**What goes wrong:** Carousel renders as vertical list, no transitions
**Why it happens:** Forgot to include Splide CSS, or CSS loads after JS
**How to avoid:** Include CSS in `<head>` before any Splide initialization
**Warning signs:** Slides stacked vertically, no animation

### Pitfall 3: Breaking Track/List/Slide Hierarchy
**What goes wrong:** Slides don't render or behave unexpectedly
**Why it happens:** Adding wrapper divs between required elements
**How to avoid:** Maintain strict `splide__track > splide__list > splide__slide` nesting
**Warning signs:** Missing slides, JavaScript errors

### Pitfall 4: Autoplay Without Accessibility Controls
**What goes wrong:** WCAG violation - users cannot stop autoplay
**Why it happens:** Not providing pause control or relying only on hover
**How to avoid:** Set `pauseOnHover: true` AND `pauseOnFocus: true` at minimum
**Warning signs:** Accessibility audit failures, screen reader users cannot interact

### Pitfall 5: Old CSS Selectors Still Applied
**What goes wrong:** Styling conflicts, visual glitches
**Why it happens:** Owl Carousel CSS classes still in stylesheet targeting non-existent elements
**How to avoid:** Remove all `.owl-*` CSS rules when removing Owl Carousel
**Warning signs:** Unexpected margins, hidden elements, broken pagination dots

## Code Examples

Verified patterns from official sources:

### Basic Testimonial Carousel
```javascript
// Source: https://splidejs.com/guides/getting-started/
document.addEventListener('DOMContentLoaded', function() {
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
});
```

### HTML Structure with Accessibility
```html
<!-- Source: https://splidejs.com/guides/structure/ -->
<section class="splide" id="testimonial-carousel" aria-label="Client Testimonials">
    <div class="splide__track">
        <ul class="splide__list">
            <li class="splide__slide">
                <div class="text-white people_says text-center">
                    <div class="people_icon">
                        <img style="border-radius: 50%;" width="125" height="125"
                             src="images/recommendations/name.jpg" alt="Person Name" />
                    </div>
                    <div class="people_review_box mt-4">
                        <p class="people_name text-white h5 fw-bold mb-0">Person Name</p>
                        <p class="h6">Company</p>
                        <p class="people_review text-white mx-auto pt-3 mb-0">"Testimonial text..."</p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</section>
```

### Custom Pagination Styling
```css
/* Match existing site design - white dots with opacity transition */
.splide__pagination {
    margin-top: 20px;
}

.splide__pagination__page {
    width: 12px;
    height: 6px;
    margin: 5px 4px;
    opacity: 0.5;
    border-radius: 20px;
    transition: all 0.5s;
    background: #fff;
}

.splide__pagination__page.is-active {
    width: 20px;
    opacity: 1;
}
```

### Removing Old Owl Carousel CSS
The following CSS rules in `style.css` (lines 947-968) must be removed or replaced:
```css
/* REMOVE these Owl-specific styles */
.owl-theme .owl-controls .owl-page { ... }
.owl-theme .owl-controls .owl-page span { ... }
.owl-theme .owl-controls .owl-page.active span { ... }
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Owl Carousel v1.x (jQuery) | Splide.js v4 (vanilla JS) | 2022 | No jQuery dependency, smaller bundle |
| Manual ARIA attributes | W3C Carousel Design Pattern | Splide v4 (2022) | Automatic WCAG compliance |
| `tabindex="0"` on carousel | Roving tabindex on pagination | Splide v4 (2022) | Better keyboard navigation |
| No motion preference | `prefers-reduced-motion` support | Splide v4 (2022) | Automatic animation disable for accessibility |

**Deprecated/outdated:**
- Owl Carousel: Officially unmaintained, not recommended for new projects. Last real update was 2014 for v1.x.
- Slick Carousel: jQuery-dependent, declining usage.
- Using `tabindex="0"` on non-interactive carousel container: Splide v4 removed this anti-pattern.

## Open Questions

Things that couldn't be fully resolved:

1. **Splide.js maintenance status**
   - What we know: v4.1.4 released November 2022, no updates since
   - What's unclear: Whether project is abandoned or simply stable
   - Recommendation: Use v4.1.4 - it's feature-complete and stable. The lack of updates may indicate maturity rather than abandonment. Library has 2.12 billion jsDelivr hits.

2. **Custom autoHeight behavior**
   - What we know: Owl Carousel had `autoHeight: true` in current config
   - What's unclear: Exact Splide equivalent behavior
   - Recommendation: Test with `autoHeight: true` option in Splide, verify testimonials of varying length display correctly

## Sources

### Primary (HIGH confidence)
- [GitHub - Splidejs/splide](https://github.com/Splidejs/splide) - Version 4.1.4, bundle size, feature list
- [jsDelivr @splidejs/splide](https://www.jsdelivr.com/package/npm/@splidejs/splide) - CDN URLs, download stats (1M/month)
- [Splide Getting Started](https://splidejs.com/guides/getting-started/) - Installation, basic setup
- [Splide Options](https://splidejs.com/guides/options/) - Configuration reference
- [Splide Autoplay](https://splidejs.com/guides/autoplay/) - Autoplay configuration, accessibility notes
- [Splide Accessibility](https://splidejs.com/guides/accessibility/) - WCAG compliance, keyboard navigation, Live Region

### Secondary (MEDIUM confidence)
- [DEV.to Testimonial Carousel Tutorial](https://dev.to/ridhikgovind/how-to-create-a-simple-testimonial-carousel-with-splide-js-5cac) - Working code example verified against official docs
- [Splide Structure Guide](https://splidejs.com/guides/structure/) - HTML markup requirements

### Tertiary (LOW confidence)
- [npm trends comparison](https://npmtrends.com/@splidejs/splide-vs-owl.carousel-vs-swiper) - Download statistics comparison
- [Smashing Magazine Accessible Carousels](https://www.smashingmagazine.com/2023/02/guide-building-accessible-carousels/) - General carousel accessibility patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official documentation, npm registry, jsDelivr all confirm v4.1.4 as current
- Architecture: HIGH - Verified HTML structure and initialization from official docs
- Pitfalls: HIGH - Documented in official guides and GitHub issues
- Option mapping: MEDIUM - Derived from comparing Owl docs with Splide docs, not from migration guide

**Research date:** 2026-01-20
**Valid until:** 2026-04-20 (90 days - Splide is stable/mature, unlikely to change significantly)
