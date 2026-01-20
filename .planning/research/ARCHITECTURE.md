# Architecture Patterns: Bootstrap 4 to 5 Migration

**Domain:** Static portfolio site migration
**Researched:** 2026-01-19
**Confidence:** HIGH (Official Bootstrap docs + codebase analysis)

## Current Site Architecture

### Technology Stack (Current)
| Component | Version | Purpose | jQuery Dependency |
|-----------|---------|---------|-------------------|
| Bootstrap | 4.x | CSS framework, grid, utilities | Required for JS plugins |
| jQuery | 3.x | DOM manipulation, plugins | Core dependency |
| Popper.js | 1.x | Tooltip/popover positioning | Required by Bootstrap |
| Owl Carousel | 2.3.4 | Testimonial slider | jQuery required |
| Isotope | 3.x | Portfolio filtering/masonry | jQuery optional (vanilla JS supported) |
| Magnific Popup | 1.x | Lightbox for images | jQuery required |
| Typed.js | 2.x | Typing animation effect | No jQuery required |
| jquery.easing | 1.x | Smooth scroll animations | jQuery required |

### Component Boundaries

```
index.html
├── CSS Dependencies (loaded in <head>)
│   ├── bootstrap.min.css      [MIGRATE: Replace with v5]
│   ├── owl.carousel.css       [MIGRATE: Replace with alternative]
│   ├── magnific-popup.css     [MIGRATE: Replace with alternative]
│   ├── animate.min.css        [KEEP: No changes needed]
│   ├── materialdesignicons.css [KEEP: No changes needed]
│   └── style.css              [MIGRATE: Update Bootstrap classes]
│
├── HTML Content
│   ├── Bootstrap Grid Classes  [MIGRATE: Update directional classes]
│   ├── Bootstrap Utilities     [MIGRATE: ml-* → ms-*, etc.]
│   ├── Form Classes            [MIGRATE: Add form-label, etc.]
│   └── Custom Classes          [KEEP: No changes needed]
│
└── JS Dependencies (loaded before </body>)
    ├── jquery.min.js          [REMOVE or KEEP for plugins]
    ├── popper.min.js          [MIGRATE: v1 → v2]
    ├── bootstrap.min.js       [MIGRATE: v4 → v5]
    ├── jquery.easing.min.js   [MIGRATE: Convert to vanilla JS]
    ├── scrollspy.min.js       [MIGRATE: Use Bootstrap 5 native]
    ├── typed.js               [KEEP: Already vanilla JS compatible]
    ├── jquery.magnific-popup.min.js [MIGRATE: Replace with GLightbox]
    ├── isotope.js             [KEEP: Supports vanilla JS]
    ├── owl.carousel.min.js    [MIGRATE: Replace with Tiny Slider]
    └── custom.js              [MIGRATE: Convert jQuery to vanilla JS]
```

## Migration Component Groups

### Group 1: Bootstrap Core (Must change together)

These files are interdependent and must be migrated as a unit.

| File | Change Required |
|------|-----------------|
| `css/bootstrap.min.css` | Replace with Bootstrap 5.3.x |
| `js/bootstrap.min.js` | Replace with Bootstrap 5.3.x |
| `js/popper.min.js` | Upgrade to Popper 2.x |
| `index.html` | Update all data-* attributes to data-bs-* |
| `css/style.css` | Update all Bootstrap utility class overrides |

**Why together:** Bootstrap CSS and JS must match versions. Data attributes changed between versions. Popper API changed.

### Group 2: CSS Utility Classes (Cascading changes)

All files using Bootstrap utility classes. Changes cascade from the framework update.

| Bootstrap 4 Class | Bootstrap 5 Class | Files Affected |
|-------------------|-------------------|----------------|
| `ml-*`, `mr-*` | `ms-*`, `me-*` | index.html |
| `pl-*`, `pr-*` | `ps-*`, `pe-*` | index.html, style.css |
| `float-left`, `float-right` | `float-start`, `float-end` | index.html, style.css |
| `text-left`, `text-right` | `text-start`, `text-end` | index.html |
| `font-weight-bold` | `fw-bold` | index.html |
| `text-muted` | `text-body-secondary` (optional) | index.html |

**Current usage in codebase:**
- `font-weight-bold`: 12 occurrences in index.html
- `float-left`, `float-right`: 2 occurrences each in index.html
- `text-right`: 1 occurrence in index.html
- `mr-0`: 3 occurrences in index.html
- `pl-2`, `pr-2`: 2 occurrences each in index.html

### Group 3: jQuery-Dependent Plugins (Can migrate incrementally)

Each plugin can be migrated independently after Group 1 completes.

#### 3A: Owl Carousel → Tiny Slider or Swiper

| Aspect | Current (Owl) | Target (Tiny Slider) |
|--------|---------------|----------------------|
| Dependency | jQuery required | Vanilla JS |
| File size | ~46KB | ~15KB |
| Files | owl.carousel.min.js, 3 CSS files | tns.min.js, tns.min.css |
| Init code | `$("#owl-demo").owlCarousel({...})` | `tns({container: '#owl-demo', ...})` |

**HTML changes:** Minimal - same container/slide structure
**JS changes:** Complete rewrite of initialization in custom.js

#### 3B: Magnific Popup → GLightbox or PhotoSwipe

| Aspect | Current (Magnific) | Target (GLightbox) |
|--------|-------------------|---------------------|
| Dependency | jQuery required | Vanilla JS |
| File size | ~20KB | ~10KB |
| Files | jquery.magnific-popup.min.js, magnific-popup.css | glightbox.min.js, glightbox.min.css |
| Init code | `$('.img-zoom').magnificPopup({...})` | `GLightbox({selector: '.img-zoom'})` |

**HTML changes:** None - same link structure works
**JS changes:** Replace initialization in custom.js

#### 3C: Isotope (Already supports vanilla JS)

| Aspect | Current | Target |
|--------|---------|--------|
| Dependency | jQuery (used as plugin) | Vanilla JS (native support) |
| Init code | `$('.work-filter').isotope({...})` | `new Isotope('.work-filter', {...})` |

**HTML changes:** None
**JS changes:** Update initialization syntax in custom.js

### Group 4: Custom JavaScript (custom.js)

The custom.js file contains 11 functions that need conversion:

| Function | jQuery Usage | Migration Approach |
|----------|--------------|-------------------|
| `initPreLoader` | `$('#status').fadeOut()` | CSS transitions + JS classList |
| `initNavbarStickey` | `$(window).on('scroll')` | `window.addEventListener('scroll')` |
| `initNavbarSmooth` | `$('.navbar-nav a').on('click')` | `document.querySelectorAll().forEach()` |
| `initNavbarScrollSpy` | `$("#navbarCollapse").scrollspy()` | Bootstrap 5 native ScrollSpy |
| `initFunFacts` | `$('.lan_fun_value').each()` | `document.querySelectorAll().forEach()` |
| `initPortfolioFilter` | `$('.work-filter').isotope()` | `new Isotope()` |
| `initMfpImages` | `$('.img-zoom').magnificPopup()` | `GLightbox()` |
| `initClientSlider` | `$("#owl-demo").owlCarousel()` | `tns()` |
| `initMfpVideo` | `$('.blog_play').magnificPopup()` | `GLightbox()` |
| `initBackToTop` | `$('.back_top').click()` | `addEventListener('click')` |
| `initTypedText` | `$(".element").typed()` | Already vanilla: `new Typed()` |

### Group 5: Inline Scripts (index.html)

| Script | Current | Migration |
|--------|---------|-----------|
| Contact form `submitToAPI` | Uses `$()` selectors, `$.ajax()` | Use `document.querySelector()`, `fetch()` |
| Typed.js initialization | `$(".element").typed({...})` | `new Typed('.element', {...})` |
| Copyright year | `document.getElementById()` | Already vanilla JS - no change |

## Migration Order (Dependency-Based)

```
Phase 1: Bootstrap Core
└── Must complete before any other changes
    ├── 1.1 Replace bootstrap.min.css
    ├── 1.2 Replace bootstrap.min.js
    ├── 1.3 Replace popper.min.js (v1 → v2)
    ├── 1.4 Update data-* → data-bs-* in HTML
    └── 1.5 Update CSS utility classes in HTML/CSS

Phase 2: Plugin Replacements (can parallelize)
├── 2A: Owl Carousel → Tiny Slider
│   ├── Add tns.min.js, tns.min.css
│   ├── Remove owl.carousel.min.js, owl.*.css
│   └── Update initClientSlider() in custom.js
│
├── 2B: Magnific Popup → GLightbox
│   ├── Add glightbox.min.js, glightbox.min.css
│   ├── Remove jquery.magnific-popup.min.js, magnific-popup.css
│   └── Update initMfpImages(), initMfpVideo() in custom.js
│
└── 2C: Isotope (jQuery → Vanilla)
    └── Update initPortfolioFilter() in custom.js

Phase 3: Custom JS Conversion
├── 3.1 Convert custom.js to vanilla JavaScript
│   ├── Replace $() selectors with querySelector/querySelectorAll
│   ├── Replace .on() with addEventListener
│   ├── Replace $.animate() with CSS transitions
│   └── Replace $.fadeOut/fadeIn with CSS opacity transitions
│
└── 3.2 Convert inline scripts in index.html
    ├── Replace $.ajax() with fetch()
    └── Replace $() selectors with querySelector

Phase 4: jQuery Removal (Final)
├── 4.1 Remove jquery.min.js
├── 4.2 Remove jquery.easing.min.js
├── 4.3 Remove scrollspy.min.js (use Bootstrap 5 native)
└── 4.4 Test all functionality
```

## Risk Areas

### HIGH RISK: CSS Class Regression

**What could break:** Visual layout differences after class name changes

**Affected areas:**
- Footer: Uses `float-left`, `float-right` → `float-start`, `float-end`
- About section: Uses `float-left`, `float-right` for skill labels
- Contact form: Uses `text-right` for submit button alignment
- Blog cards: Use `pl-2`, `pr-2` for content padding

**Detection:** Visual regression testing, browser inspection

**Mitigation:**
1. Create before/after screenshots of each section
2. Update CSS custom overrides in style.css if targeting old class names
3. Test at all responsive breakpoints (xs, sm, md, lg, xl, xxl)

### MEDIUM RISK: jQuery to Vanilla Conversion Bugs

**What could break:** Interactive functionality (animations, events, AJAX)

**Affected areas:**
- Preloader fade animation
- Smooth scroll behavior
- Counter animation in "Fun Facts" section
- Contact form submission

**Detection:** Manual testing of all interactive elements

**Mitigation:**
1. Convert one function at a time
2. Test each function immediately after conversion
3. Keep jQuery temporarily as fallback during migration

### MEDIUM RISK: Plugin API Differences

**What could break:** Carousel behavior, lightbox behavior

**Owl Carousel → Tiny Slider differences:**
- Autoplay configuration syntax different
- Navigation/pagination markup may differ
- Events have different names

**Magnific Popup → GLightbox differences:**
- Gallery grouping syntax different
- Animation options different
- Callback names changed

**Mitigation:**
1. Review new plugin documentation before implementing
2. Match existing behavior (autoplay timing, transitions)
3. Test touch/swipe on mobile devices

### LOW RISK: Popper.js Version Incompatibility

**What could break:** Tooltip/popover positioning (if used)

**Current site:** Does not use tooltips or popovers

**Mitigation:** Standard Bootstrap 5 bundle includes Popper 2 - no action needed

### LOW RISK: Bootstrap 5 XXL Breakpoint

**What could break:** Layouts on very large screens (>1400px)

**Current site:** Uses container max-widths, not full-width layouts

**Mitigation:** Test on 1400px+ screens, adjust container if needed

## Patterns to Follow

### Pattern 1: Progressive Enhancement for jQuery Removal

Don't remove jQuery immediately. Follow this pattern:

```javascript
// Phase 1: Keep jQuery, update Bootstrap
// custom.js works unchanged

// Phase 2: Convert functions one at a time
// Before:
initPreLoader: function() {
    $('#status').fadeOut();
    $('#preloader').delay(350).fadeOut('slow');
}

// After:
initPreLoader: function() {
    const status = document.getElementById('status');
    const preloader = document.getElementById('preloader');

    status.style.transition = 'opacity 0.3s';
    status.style.opacity = '0';

    setTimeout(() => {
        preloader.style.transition = 'opacity 0.5s';
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.style.overflow = 'visible';
        }, 500);
    }, 350);
}

// Phase 3: After all functions converted, remove jQuery
```

### Pattern 2: CSS Class Find-Replace with Verification

Use systematic find-replace with manual verification:

```bash
# Step 1: Find all instances
grep -n "ml-" index.html  # Lists line numbers

# Step 2: Replace with sed (or editor)
# ml-0 → ms-0, ml-1 → ms-1, etc.

# Step 3: Visual verification
# Check each section in browser
```

**Class mapping reference:**
| Find | Replace | Context |
|------|---------|---------|
| `ml-` | `ms-` | Margin left → margin start |
| `mr-` | `me-` | Margin right → margin end |
| `pl-` | `ps-` | Padding left → padding start |
| `pr-` | `pe-` | Padding right → padding end |
| `float-left` | `float-start` | Float positioning |
| `float-right` | `float-end` | Float positioning |
| `text-left` | `text-start` | Text alignment |
| `text-right` | `text-end` | Text alignment |
| `font-weight-bold` | `fw-bold` | Font weight |
| `font-weight-normal` | `fw-normal` | Font weight |

### Pattern 3: Plugin Replacement Sequence

For each plugin replacement:

1. **Add new plugin** (both exist temporarily)
2. **Update initialization code** (new plugin only)
3. **Update HTML/CSS** if needed
4. **Test functionality**
5. **Remove old plugin files**

This prevents periods where functionality is broken.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Big-Bang Migration

**What:** Changing Bootstrap, removing jQuery, and replacing all plugins at once

**Why bad:**
- Impossible to debug which change caused a problem
- Can't revert selectively
- High cognitive load

**Instead:** Migrate in discrete phases with testing between each

### Anti-Pattern 2: Keeping Bootstrap 4 CSS with Bootstrap 5 JS

**What:** Updating only JS files, not CSS

**Why bad:**
- Version mismatch causes subtle bugs
- New components won't render correctly
- Deprecated classes may not work

**Instead:** Always update CSS and JS together as a unit

### Anti-Pattern 3: Removing jQuery Before Plugins Are Migrated

**What:** Removing jquery.min.js while Owl Carousel and Magnific Popup still depend on it

**Why bad:**
- Carousel and lightbox will completely break
- Console errors, no graceful degradation

**Instead:** Remove jQuery only after ALL dependent plugins are replaced

### Anti-Pattern 4: Using CDN for Some Files, Local for Others

**What:** Mixing CDN Bootstrap with local plugins

**Why bad:**
- Version synchronization issues
- Network latency differences
- Harder to maintain

**Instead:** Keep all files local (current approach) or move all to CDN

## File Change Summary

| File | Action | Priority |
|------|--------|----------|
| `css/bootstrap.min.css` | Replace (v4 → v5.3) | Phase 1 |
| `js/bootstrap.min.js` | Replace (v4 → v5.3) | Phase 1 |
| `js/popper.min.js` | Replace (v1 → v2) | Phase 1 |
| `index.html` | Update classes + data attrs | Phase 1 |
| `css/style.css` | Update class overrides | Phase 1 |
| `css/owl.carousel.css` | Remove | Phase 2A |
| `css/owl.theme.css` | Remove | Phase 2A |
| `css/owl.transitions.css` | Remove | Phase 2A |
| `js/owl.carousel.min.js` | Replace → tns.min.js | Phase 2A |
| `css/magnific-popup.css` | Replace → glightbox.min.css | Phase 2B |
| `js/jquery.magnific-popup.min.js` | Replace → glightbox.min.js | Phase 2B |
| `js/isotope.js` | Keep (update init code) | Phase 2C |
| `js/custom.js` | Rewrite to vanilla JS | Phase 3 |
| `js/jquery.min.js` | Remove | Phase 4 |
| `js/jquery.easing.min.js` | Remove | Phase 4 |
| `js/scrollspy.min.js` | Remove (use BS5 native) | Phase 4 |
| `js/typed.js` | Keep (already vanilla) | N/A |
| `css/animate.min.css` | Keep | N/A |
| `css/materialdesignicons.min.css` | Keep | N/A |
| `css/mobiriseicons.css` | Keep | N/A |

## Sources

- [Bootstrap v5.3 Migration Guide](https://getbootstrap.com/docs/5.3/migration/) - Official Bootstrap documentation (HIGH confidence)
- [Isotope Documentation](https://isotope.metafizzy.co/) - Vanilla JS support confirmed (HIGH confidence)
- [Typed.js GitHub](https://mattboldt.github.io/typed.js/) - No jQuery dependency confirmed (HIGH confidence)
- [GLightbox](https://biati-digital.github.io/glightbox/) - Magnific Popup alternative (MEDIUM confidence)
- [Tiny Slider](https://github.com/ganlanyuan/tiny-slider) - Owl Carousel alternative (MEDIUM confidence)
- [jQuery Script Blog - Carousel Alternatives](https://www.jqueryscript.net/blog/best-carousel.html) - Ecosystem survey (MEDIUM confidence)
