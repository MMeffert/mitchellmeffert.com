# Phase 3: Lightbox Migration - Research

**Researched:** 2026-01-20
**Domain:** JavaScript Lightbox Libraries (Magnific Popup to PhotoSwipe)
**Confidence:** HIGH

## Summary

This research documents the migration path from Magnific Popup v0.9.9 (jQuery-dependent, deprecated since 2016, created 2013) to PhotoSwipe v5.4.4 (vanilla JS, actively maintained, mobile-optimized). Both libraries were created by the same developer (Dmitry Semenov), making PhotoSwipe the official successor.

The current implementation uses Magnific Popup for portfolio images via the `.img-zoom` class with gallery mode enabled. The configuration is simple: image type, close-on-content-click, fade animation, and gallery navigation. PhotoSwipe provides equivalent functionality with significantly better mobile support (pinch-to-zoom, swipe gestures) and accessibility features.

Key migration consideration: PhotoSwipe requires predefined image dimensions (`data-pswp-width` and `data-pswp-height` attributes) on each gallery link. This is the main structural change from Magnific Popup which auto-detected dimensions.

**Primary recommendation:** Use PhotoSwipe v5.4.4 via jsDelivr CDN (UMD build for compatibility with existing non-module script setup). Replace Magnific Popup initialization with PhotoSwipe Lightbox, update gallery links with dimension attributes, and remove Magnific Popup files.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| PhotoSwipe | 5.4.4 | Image lightbox/gallery | Zero dependencies, mobile-optimized, same author as Magnific Popup, 40K+ GitHub dependents |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| photoswipe.css | 5.4.4 | Lightbox styles | Always required - single file, dynamically generated icons |
| photoswipe-lightbox.umd.min.js | 5.4.4 | Lightbox initialization | Always required - handles opening/closing |
| photoswipe.umd.min.js | 5.4.4 | Core functionality | Always required - main gallery logic |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| PhotoSwipe | lightGallery | More features (video, inline), larger bundle, more complex setup |
| PhotoSwipe | GLightbox | Simpler API, lighter, but less mobile-optimized |
| PhotoSwipe | FsLightbox | Good mobile support, but premium features require paid license |
| PhotoSwipe | SimpleLightbox | Smaller, but fewer features and less active development |

**Installation (CDN):**
```html
<!-- CSS in <head> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.css">

<!-- JS before </body> -->
<script src="https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/umd/photoswipe.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/umd/photoswipe-lightbox.umd.min.js"></script>
```

**Bundle Sizes:**
- photoswipe.css: 7.25 KB
- photoswipe.umd.min.js: 53.22 KB
- photoswipe-lightbox.umd.min.js: 14.23 KB
- **Total: ~75 KB** (vs Magnific Popup ~20 KB, but PhotoSwipe provides significantly more mobile features)

## Architecture Patterns

### Current Magnific Popup Structure (to be replaced)
```html
<!-- Gallery link structure -->
<div class="work_img_box rounded">
    <a class="img-zoom" href="images/works/image.jpg"></a>
    <div class="work_images">
        <img src="images/works/image.jpg" alt="Description" class="img-fluid mx-auto d-block">
        <div class="work_overlay">
            <h4 class="mb-0">Category</h4>
            <h6 class="mb-0">Title</h6>
        </div>
    </div>
</div>
```

```javascript
// Current Magnific Popup initialization
$('.img-zoom').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    mainClass: 'mfp-fade',
    gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1]
    }
});
```

### Target PhotoSwipe Structure
```html
<!-- Gallery container with aria-label for accessibility -->
<div class="pswp-gallery" id="portfolio-gallery">
    <div class="work_img_box rounded">
        <a href="images/works/image.jpg"
           data-pswp-width="1200"
           data-pswp-height="800"
           target="_blank">
            <div class="work_images">
                <img src="images/works/image.jpg" alt="Description" class="img-fluid mx-auto d-block">
                <div class="work_overlay">
                    <h4 class="mb-0">Category</h4>
                    <h6 class="mb-0">Title</h6>
                </div>
            </div>
        </a>
    </div>
</div>
```

```javascript
// PhotoSwipe UMD initialization
var lightbox = new PhotoSwipeLightbox({
    gallery: '#portfolio-gallery',
    children: 'a',
    pswpModule: PhotoSwipe,

    // Visual options
    bgOpacity: 0.9,

    // Navigation
    loop: true,
    arrowKeys: true,
    escKey: true,

    // Gestures (enabled by default)
    pinchToClose: true,
    closeOnVerticalDrag: true,

    // Accessibility
    trapFocus: true,
    returnFocus: true
});
lightbox.init();
```

### Pattern 1: UMD Initialization
**What:** Initialize PhotoSwipe using UMD build (non-module)
**When to use:** Static sites without bundlers (like this project)
**Example:**
```javascript
// Source: https://photoswipe.com/getting-started/
// UMD version - pswpModule takes PhotoSwipe directly, not a dynamic import
var lightbox = new PhotoSwipeLightbox({
    gallery: '#portfolio-gallery',
    children: 'a',
    pswpModule: PhotoSwipe  // Direct reference, NOT () => import()
});
lightbox.init();
```

### Pattern 2: Option Mapping (Magnific Popup to PhotoSwipe)
**What:** Direct mapping of Magnific Popup options to PhotoSwipe equivalents
**When to use:** Reference when converting existing configuration

| Magnific Popup | PhotoSwipe | Notes |
|----------------|------------|-------|
| `type: 'image'` | N/A | PhotoSwipe is image-only by default |
| `closeOnContentClick: true` | `clickToCloseNonZoomable: true` | Similar behavior |
| `mainClass: 'mfp-fade'` | `showAnimationDuration: 333` | Built-in fade transition |
| `gallery.enabled: true` | N/A | Gallery mode is default |
| `gallery.navigateByImgClick: true` | `allowPanToNext: true` | Similar swipe/click behavior |
| `gallery.preload: [0, 1]` | `preload: [1, 2]` | Preload adjacent slides |

### Pattern 3: Required Data Attributes
**What:** PhotoSwipe requires explicit image dimensions
**When to use:** Every gallery image link
**Example:**
```html
<!-- Each link MUST have width and height -->
<a href="images/works/fullsize.jpg"
   data-pswp-width="1200"
   data-pswp-height="800">
    <img src="images/works/thumbnail.jpg" alt="...">
</a>
```

### Anti-Patterns to Avoid
- **Missing dimension attributes:** PhotoSwipe will not display images without `data-pswp-width` and `data-pswp-height`. No fallback exists.
- **Using dynamic import with UMD:** UMD version doesn't support `pswpModule: () => import()`. Use direct reference: `pswpModule: PhotoSwipe`.
- **Forgetting to call `.init()`:** PhotoSwipe will not bind events without `init()` call.
- **Loading CSS after JS:** CSS must load before lightbox initialization for proper sizing.
- **Images larger than 3000x3000:** PhotoSwipe recommends max 3000x3000 for performance. Serve responsive images for larger files.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Pinch-to-zoom | Custom touch handlers | PhotoSwipe built-in | Handles multi-touch, momentum, bounds, edge cases |
| Swipe navigation | Custom gesture detection | PhotoSwipe built-in | Velocity detection, direction lock, native feel |
| Image preloading | Custom Image() loading | PhotoSwipe `preload` option | Handles parallel loading, cancellation, memory |
| Focus trapping | Custom tabindex management | PhotoSwipe `trapFocus` option | WCAG compliant, handles edge cases |
| Zoom levels | Custom transform calculations | PhotoSwipe zoom API | Handles secondary zoom, fit modes, constraints |
| Transition animations | Custom CSS transitions | PhotoSwipe animation system | Hardware accelerated, handles interruption |

**Key insight:** PhotoSwipe's mobile optimization is extremely mature. The library has been optimized for smooth 60fps touch interactions since 2014. Building custom gesture handling will result in janky performance compared to PhotoSwipe's battle-tested implementation.

## Common Pitfalls

### Pitfall 1: Missing Image Dimensions
**What goes wrong:** Images don't open, console shows no error
**Why it happens:** PhotoSwipe requires `data-pswp-width` and `data-pswp-height` attributes
**How to avoid:** Always add dimension attributes; use actual image dimensions
**Warning signs:** Click on image does nothing, no console error

### Pitfall 2: Using ES Module Syntax with UMD Build
**What goes wrong:** "import is not defined" or "PhotoSwipe is not defined"
**Why it happens:** Mixing ES module syntax with UMD build
**How to avoid:** With UMD, use `pswpModule: PhotoSwipe` (direct reference), not `pswpModule: () => import(...)`
**Warning signs:** JavaScript errors in console

### Pitfall 3: Gallery Selector Mismatch
**What goes wrong:** Lightbox doesn't open any images
**Why it happens:** `gallery` selector doesn't match HTML, or `children` selector doesn't find links
**How to avoid:** Verify selectors match actual DOM structure; use browser DevTools to test
**Warning signs:** No images open, no console errors (lightbox just doesn't find items)

### Pitfall 4: Link Structure Changed
**What goes wrong:** Existing CSS hover effects break
**Why it happens:** Moving `<a>` tag to wrap the entire card changes CSS structure
**How to avoid:** Ensure existing `.work_img_box a` and `.work_overlay` CSS still applies after restructure
**Warning signs:** Hover overlay animation stops working

### Pitfall 5: Old Magnific Popup Initialization Still Running
**What goes wrong:** Both lightboxes try to open, weird behavior
**Why it happens:** Forgot to remove `initMfpImages()` from custom.js
**How to avoid:** Remove entire Magnific Popup initialization function and its call in `init()`
**Warning signs:** Multiple overlays, conflicting behavior

### Pitfall 6: Video Popup Code Still References Magnific Popup
**What goes wrong:** JavaScript error when video play button clicked
**Why it happens:** `initMfpVideo()` still uses Magnific Popup which is removed
**How to avoid:** Either remove video popup code (currently commented out in HTML) or migrate to PhotoSwipe video plugin
**Warning signs:** Console error on video play click

## Code Examples

Verified patterns from official sources:

### Complete UMD Setup
```html
<!-- In <head> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.css">

<!-- Before </body> -->
<script src="https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/umd/photoswipe.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/umd/photoswipe-lightbox.umd.min.js"></script>
<script>
// Source: https://photoswipe.com/getting-started/
var lightbox = new PhotoSwipeLightbox({
    gallery: '#portfolio-gallery',
    children: 'a',
    pswpModule: PhotoSwipe,

    // Match Magnific Popup behavior
    bgOpacity: 0.9,
    loop: true,

    // Keyboard navigation (Success Criteria requirement)
    arrowKeys: true,
    escKey: true,

    // Touch gestures (Success Criteria requirement)
    pinchToClose: true,
    closeOnVerticalDrag: true,

    // Accessibility
    trapFocus: true,
    returnFocus: true,

    // Preload adjacent slides like Magnific Popup did
    preload: [1, 2]
});
lightbox.init();
</script>
```

### Gallery HTML Structure
```html
<!-- Source: https://photoswipe.com/getting-started/ -->
<div class="row mt-5 work-filter pswp-gallery" id="portfolio-gallery">
    <div class="col-lg-4 webdesign">
        <div class="work_img_box rounded">
            <a href="images/works/fullsize.jpg"
               data-pswp-width="1200"
               data-pswp-height="800"
               target="_blank">
                <div class="work_images">
                    <img src="images/works/thumbnail.jpg"
                         alt="Description"
                         class="img-fluid mx-auto d-block">
                    <div class="work_overlay">
                        <h4 class="mb-0">Category</h4>
                        <h6 class="mb-0">Title</h6>
                    </div>
                </div>
            </a>
        </div>
    </div>
</div>
```

### CSS Adjustments for Click Area
```css
/* Ensure entire card is clickable */
.work_img_box a {
    display: block;
    text-decoration: none;
}

/* Maintain existing overlay behavior */
.work_img_box .work_images .work_overlay {
    pointer-events: none;  /* Allow click through to link */
}
```

### Custom PhotoSwipe Styling (Optional)
```css
/* Match site's dark theme */
.pswp {
    --pswp-bg: #0b0b0b;
}

/* Customize counter appearance */
.pswp__counter {
    font-size: 14px;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Magnific Popup (jQuery) | PhotoSwipe (vanilla JS) | 2016 (deprecated) | No jQuery dependency, better mobile |
| Auto-detect image size | Explicit dimensions required | PhotoSwipe v5 (2021) | Faster initial render, no layout shift |
| Single zoom level | Multi-level zoom with gestures | PhotoSwipe v5 (2021) | Better mobile experience |
| jQuery event system | Native events + custom system | PhotoSwipe v5 (2021) | Smaller bundle, faster execution |

**Deprecated/outdated:**
- Magnific Popup: Officially deprecated by author. Only critical/security fixes. Replaced by PhotoSwipe for images, native `<dialog>` for modals.
- PhotoSwipe v4: Significantly different API. v5 requires dimension attributes, different initialization.
- Fancybox (old jQuery version): jQuery dependency. Modern Fancybox 5 exists but PhotoSwipe is lighter for images-only use case.

## Open Questions

Things that couldn't be fully resolved:

1. **Actual image dimensions for portfolio items**
   - What we know: PhotoSwipe requires `data-pswp-width` and `data-pswp-height`
   - What's unclear: The actual dimensions of the four portfolio images
   - Recommendation: During implementation, check each image's actual dimensions and add to attributes. Can use browser DevTools Network panel or file properties.

2. **Video popup functionality**
   - What we know: `initMfpVideo()` exists in custom.js for `.blog_play` elements
   - What's unclear: Whether video popups are actually used (HTML shows Services section with video is commented out)
   - Recommendation: If video popup needed, use `photoswipe-video-plugin` package. Otherwise, remove the `initMfpVideo` function entirely.

3. **PhotoSwipe v6 timeline**
   - What we know: v6 is under development (mentioned in docs)
   - What's unclear: Release date, breaking changes
   - Recommendation: Use v5.4.4 (current stable). v6 changes unlikely to be breaking for basic usage.

## Sources

### Primary (HIGH confidence)
- [PhotoSwipe Getting Started](https://photoswipe.com/getting-started/) - Installation, HTML structure, initialization
- [PhotoSwipe Options](https://photoswipe.com/options/) - All configuration options with defaults
- [GitHub - dimsemenov/PhotoSwipe](https://github.com/dimsemenov/PhotoSwipe) - v5.4.4 (May 2024), 40K dependents
- [jsDelivr CDN - photoswipe](https://www.jsdelivr.com/package/npm/photoswipe) - CDN URLs, file sizes

### Secondary (MEDIUM confidence)
- [GitHub - dimsemenov/Magnific-Popup](https://github.com/dimsemenov/Magnific-Popup) - Deprecation notice, author recommendation
- [npm-compare: lightbox libraries](https://npm-compare.com/lightbox2,lightgallery,magnific-popup,photoswipe) - Feature comparison

### Tertiary (LOW confidence)
- [10 Best JavaScript Lightbox Libraries - Hongkiat](https://www.hongkiat.com/blog/responsive-lightbox-library/) - General recommendations
- [PhotoSwipe Accessibility Issue #1077](https://github.com/dimsemenov/PhotoSwipe/issues/1077) - Accessibility considerations (older issue, may be resolved in v5)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official documentation, same author as Magnific Popup, npm registry confirms v5.4.4
- Architecture: HIGH - Verified HTML structure and initialization from official docs
- Pitfalls: HIGH - Derived from official docs and common implementation errors
- Option mapping: MEDIUM - Derived from comparing both libraries' docs, not from official migration guide

**Research date:** 2026-01-20
**Valid until:** 2026-04-20 (90 days - PhotoSwipe v5 is stable, v6 development ongoing but not imminent)
