# Phase 4: Filter Migration - Research

**Researched:** 2026-01-20
**Domain:** JavaScript Portfolio Filtering (jQuery Isotope to Vanilla JS)
**Confidence:** HIGH

## Summary

This research documents the migration path from Isotope v2.0.0 (heavily jQuery-dependent, 2014 packaged version) to Isotope v3.0.6 (supports vanilla JS, maintained by Metafizzy). The current implementation uses jQuery extensively for Isotope initialization, filter button clicks, and DOM manipulation. Isotope v3 provides a clean vanilla JS API that can replace all jQuery usage.

The migration is straightforward because:
1. Isotope v3 supports `new Isotope(elem, options)` constructor without jQuery
2. Filter button click handling uses native `addEventListener` with `arrange()` method
3. The existing HTML filter structure (`data-filter` attributes) works identically
4. Layout modes (masonry) and filter syntax remain the same

**Licensing note:** Isotope is GPLv3 for open source projects. For a personal portfolio site where source code is public (GitHub), GPLv3 is acceptable. Commercial alternative: Shuffle.js (MIT license, v6.1.2) provides similar functionality.

**Primary recommendation:** Upgrade to Isotope v3.0.6 via jsDelivr CDN. Replace jQuery initialization with vanilla JS `new Isotope()` constructor. Replace jQuery click handlers with native `addEventListener`. Remove jQuery `$(window).on('load')` wrapper in favor of DOMContentLoaded or direct call.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Isotope (isotope-layout) | 3.0.6 | Filter & sort grid layouts | Same author as v2, mature vanilla JS API, 32M+ jsDelivr hits |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None required | - | - | Isotope v3 is dependency-free for vanilla JS usage |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Isotope v3 (GPLv3) | Shuffle.js (MIT) | MIT license, similar API, but less ecosystem support and documentation |
| Isotope v3 | MixItUp | Commercial license required for commercial use, more features but overkill |
| Isotope v3 | CSS-only filtering | Simpler, but no animation, limited browser support for complex filters |

**Installation (CDN):**
```html
<!-- JS before </body> - after jQuery if jQuery still present for other features -->
<script src="https://cdn.jsdelivr.net/npm/isotope-layout@3.0.6/dist/isotope.pkgd.min.js"></script>
```

**Bundle Sizes:**
- isotope.pkgd.min.js: ~25 KB (gzipped ~8 KB)

## Architecture Patterns

### Current jQuery Isotope Structure (to be replaced)
```javascript
// Current custom.js implementation (lines 88-117)
ElvishApp.prototype.initPortfolioFilter = function() {
    $(window).on('load', function () {
        var $container = $('.work-filter');
        var $filter = $('#menu-filter');
        $container.isotope({
            filter: '*',
            layoutMode: 'masonry',
            animationOptions: {
                duration: 750,
                easing: 'linear'
            }
        });

        $filter.find('a').on("click",function() {
            var selector = $(this).attr('data-filter');
            $filter.find('a').removeClass('active');
            $(this).addClass('active');
            $container.isotope({
                filter: selector,
                animationOptions: {
                    animationDuration: 750,
                    easing: 'linear',
                    queue: false,
                }
            });
            return false;
        });
    });
}
```

### Target Vanilla JS Structure
```javascript
// Source: https://isotope.metafizzy.co/ (vanilla JS initialization)
ElvishApp.prototype.initPortfolioFilter = function() {
    var grid = document.querySelector('.work-filter');
    if (!grid) return;

    // Initialize Isotope
    var iso = new Isotope(grid, {
        itemSelector: '.col-lg-4',  // Direct child columns
        layoutMode: 'masonry',
        filter: '*',
        transitionDuration: '0.75s'
    });

    // Filter button click handling
    var filterButtons = document.querySelector('#menu-filter');
    if (filterButtons) {
        filterButtons.addEventListener('click', function(event) {
            // Only handle clicks on <a> elements
            if (!event.target.matches('a')) return;

            event.preventDefault();

            var filterValue = event.target.getAttribute('data-filter');

            // Update active state
            var activeButton = filterButtons.querySelector('.active');
            if (activeButton) {
                activeButton.classList.remove('active');
            }
            event.target.classList.add('active');

            // Apply filter
            iso.arrange({ filter: filterValue });
        });
    }
}
```

### Pattern 1: Vanilla JS Initialization
**What:** Initialize Isotope without jQuery using constructor
**When to use:** Always for jQuery-free implementation
**Example:**
```javascript
// Source: https://isotope.metafizzy.co/ - Vanilla JS section
var elem = document.querySelector('.work-filter');
var iso = new Isotope(elem, {
    itemSelector: '.col-lg-4',
    layoutMode: 'masonry',
    filter: '*',
    transitionDuration: '0.75s'
});
```

### Pattern 2: Event Delegation for Filters
**What:** Use single event listener on parent with event delegation
**When to use:** When multiple filter buttons exist
**Example:**
```javascript
// Source: https://isotope.metafizzy.co/filtering.html
var filterContainer = document.querySelector('#menu-filter');
filterContainer.addEventListener('click', function(event) {
    if (!event.target.matches('a')) return;
    event.preventDefault();

    var filterValue = event.target.getAttribute('data-filter');
    iso.arrange({ filter: filterValue });
});
```

### Pattern 3: Active State Management
**What:** Toggle active class on filter buttons without jQuery
**When to use:** For visual feedback on selected filter
**Example:**
```javascript
// Remove active from all, add to clicked
filterContainer.querySelectorAll('a').forEach(function(btn) {
    btn.classList.remove('active');
});
event.target.classList.add('active');
```

### Pattern 4: Option Mapping (v2 to v3)
**What:** Map old Isotope v2 options to v3 equivalents
**When to use:** Reference when converting existing configuration

| Isotope v2 (jQuery) | Isotope v3 (Vanilla) | Notes |
|---------------------|---------------------|-------|
| `$container.isotope({...})` | `new Isotope(elem, {...})` | Constructor-based |
| `$container.isotope({filter: x})` | `iso.arrange({filter: x})` | Method-based filtering |
| `animationOptions.duration: 750` | `transitionDuration: '0.75s'` | CSS time string |
| `$(window).on('load')` | DOMContentLoaded or direct | No jQuery wrapper |
| `$(this).attr('data-filter')` | `event.target.getAttribute('data-filter')` | Native attribute access |
| `$filter.find('a').on('click')` | `addEventListener('click')` | Native event listener |

### Anti-Patterns to Avoid
- **Using jQuery Bridget with vanilla JS:** Isotope v3 doesn't need bridget for vanilla JS. Only use if also using as jQuery plugin.
- **Calling isotope() method in vanilla JS:** Use `iso.arrange()` not `$container.isotope()`.
- **Missing itemSelector:** Without itemSelector, Isotope targets all direct children which may include non-item elements.
- **Using old animationOptions:** v3 uses `transitionDuration` CSS string, not animationOptions object.
- **Forgetting event.preventDefault():** Filter links without preventDefault will cause page jump to `#`.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS transition animations | Custom CSS transitions per item | Isotope's built-in transitions | Handles stagger, position calculation, overlap prevention |
| Layout recalculation | Manual position/float CSS | Isotope's masonry mode | Handles responsive, dynamic sizing, gap filling |
| Filter state management | Custom filter tracking | Isotope's filter option | Handles filter combinations, counts, callbacks |
| Animation easing | Custom JavaScript animation | Isotope's CSS transitions | Hardware accelerated, configurable via transitionDuration |
| Item hiding/showing | display:none toggling | Isotope's filter system | Animated hiding, position recalculation, no layout shift |

**Key insight:** Isotope handles the complex interaction between CSS transitions and DOM layout changes. Hand-rolling filter animations leads to layout thrashing and janky animations.

## Common Pitfalls

### Pitfall 1: Isotope Not Defined Error
**What goes wrong:** Console error "Isotope is not defined"
**Why it happens:** Script loaded before Isotope CDN, or Isotope CDN failed to load
**How to avoid:** Ensure Isotope script tag is before custom.js; verify CDN URL is correct
**Warning signs:** JavaScript error in console, filter buttons do nothing

### Pitfall 2: Items Not Positioned Correctly
**What goes wrong:** Items stack vertically instead of grid layout
**Why it happens:** Missing itemSelector or incorrect selector
**How to avoid:** Set `itemSelector` to match actual grid item class (`.col-lg-4`)
**Warning signs:** Items in single column, no masonry effect

### Pitfall 3: Filter Doesn't Match Any Items
**What goes wrong:** "All" shows items but categories show nothing
**Why it happens:** Filter selector doesn't match item classes; case sensitivity
**How to avoid:** Verify filter selectors (`.webdesign`, `.programming`, `.photography`) match item classes exactly
**Warning signs:** Filter shows 0 items, no animation occurs

### Pitfall 4: Active State Not Updating
**What goes wrong:** All buttons look the same after click, or multiple buttons appear active
**Why it happens:** Not removing `.active` from previous button before adding to new
**How to avoid:** Query all buttons, remove `.active` from all, then add to clicked
**Warning signs:** Multiple highlighted buttons, no highlight on clicked button

### Pitfall 5: Click Event Bubbles to Wrong Handler
**What goes wrong:** PhotoSwipe lightbox opens when clicking filter buttons
**Why it happens:** Event propagation from filter area to gallery
**How to avoid:** Ensure filter buttons are outside gallery container; use event.stopPropagation() if needed
**Warning signs:** Lightbox opens unexpectedly when filtering

### Pitfall 6: Layout Breaks on Window Resize
**What goes wrong:** Items overlap or have gaps after resize
**Why it happens:** Isotope not recalculating layout on resize
**How to avoid:** Isotope v3 handles resize automatically by default (`resize: true` option)
**Warning signs:** Overlapping items after browser resize

## Code Examples

Verified patterns from official sources:

### Complete Vanilla JS Implementation
```javascript
// Source: https://isotope.metafizzy.co/ and https://codepen.io/desandro/pen/LYpbOL
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
};
```

### HTML Structure (Unchanged)
```html
<!-- Filter buttons - no changes needed -->
<ul class="text-center list-unstyled list-inline mb-0 text-capitlize work_menu" id="menu-filter">
    <li class="list-inline-item"><a class="active" data-filter="*">All</a></li>
    <li class="list-inline-item"><a class="" data-filter=".programming">Programming</a></li>
    <li class="list-inline-item"><a class="" data-filter=".webdesign">Webdesign</a></li>
    <li class="list-inline-item"><a class="" data-filter=".photography">Photography</a></li>
</ul>

<!-- Grid container - no changes needed -->
<div class="row mt-5 work-filter pswp-gallery" id="portfolio-gallery">
    <div class="col-lg-4 webdesign">
        <!-- portfolio item -->
    </div>
    <div class="col-lg-4 programming">
        <!-- portfolio item -->
    </div>
</div>
```

### CDN Include Update
```html
<!-- Replace local js/isotope.js with CDN -->
<!-- Old: <script src="js/isotope.js"></script> -->
<script src="https://cdn.jsdelivr.net/npm/isotope-layout@3.0.6/dist/isotope.pkgd.min.js"></script>
```

### Initialization Without Window Load Wrapper
```javascript
// The ElvishApp pattern already runs on document ready via jQuery
// For vanilla JS timing, can use:

// Option 1: Already in custom.js's init() which runs at end of body
ElvishApp.prototype.initPortfolioFilter = function() {
    // Grid should already exist when custom.js runs (it's at end of body)
    var grid = document.querySelector('.work-filter');
    // ... rest of implementation
};

// Option 2: If timing issues occur, wrap in DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    var grid = document.querySelector('.work-filter');
    var iso = new Isotope(grid, { /* options */ });
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Isotope v2 (jQuery-required) | Isotope v3 (vanilla JS supported) | v3.0 (2016) | jQuery optional, same functionality |
| jQuery `$(selector).isotope()` | `new Isotope(elem, options)` | v3.0 (2016) | Constructor-based, cleaner API |
| `animationOptions` object | `transitionDuration` CSS string | v3.0 (2016) | Simpler configuration |
| jQuery event handlers | Native addEventListener | v3.0 (2016) | No jQuery dependency |

**Deprecated/outdated:**
- Isotope v2: Still works but no longer maintained. v3 is actively maintained.
- jQuery Bridget: Only needed if using Isotope as jQuery plugin. Not needed for vanilla JS.
- `animationOptions`: Replaced by `transitionDuration` in v3.
- `isAnimated` option: Removed in v3, use `transitionDuration: 0` instead.

## Open Questions

Things that couldn't be fully resolved:

1. **Photography filter category**
   - What we know: `.photography` filter exists in buttons but no items currently have this class
   - What's unclear: Whether photography items will be added, or filter should be removed
   - Recommendation: Keep the filter for now; it will simply show no results if no items match

2. **ImagesLoaded dependency**
   - What we know: Isotope recommends imagesLoaded for layouts with images
   - What's unclear: Whether current layout needs it (items may have fixed aspect ratios via CSS)
   - Recommendation: Test without first. If layout shifts occur on slow connections, add imagesLoaded

3. **GPL License implications**
   - What we know: Isotope is GPLv3, project source is public on GitHub
   - What's unclear: Whether GPLv3 license notice needs to be added to project
   - Recommendation: For open source project, GPLv3 is acceptable. If concerns exist, Shuffle.js (MIT) is alternative

## Sources

### Primary (HIGH confidence)
- [Isotope Official Documentation](https://isotope.metafizzy.co/) - Installation, vanilla JS initialization, options
- [Isotope Filtering Documentation](https://isotope.metafizzy.co/filtering.html) - Filter syntax, arrange method
- [Isotope Methods Documentation](https://isotope.metafizzy.co/methods.html) - arrange(), vanilla JS method syntax
- [GitHub - metafizzy/isotope](https://github.com/metafizzy/isotope) - v3.0.6 (current), license info
- [jsDelivr - isotope-layout](https://www.jsdelivr.com/package/npm/isotope-layout) - CDN URLs, v3.0.6 confirmed

### Secondary (MEDIUM confidence)
- [CodePen - Isotope filtering, vanilla JS](https://codepen.io/desandro/pen/LYpbOL) - Official example by library author
- [Isotope License Page](https://isotope.metafizzy.co/license.html) - GPLv3 for open source, commercial options
- [Isotope Options Documentation](https://isotope.metafizzy.co/options.html) - Full options reference

### Tertiary (LOW confidence)
- [Shuffle.js](https://shuffle.js.org/) - MIT-licensed alternative (jsDelivr shows v6.1.2)
- [GitHub Issue #657](https://github.com/metafizzy/isotope/issues/657) - Vanilla JS selector discussion

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official documentation confirms v3.0.6 with vanilla JS support
- Architecture: HIGH - Code patterns verified from official docs and author's CodePens
- Pitfalls: HIGH - Derived from official docs, GitHub issues, and migration experience
- Option mapping: HIGH - Direct comparison of v2 and v3 official documentation

**Research date:** 2026-01-20
**Valid until:** 2026-04-20 (90 days - Isotope v3 is stable, last release 2018 indicates maturity)
