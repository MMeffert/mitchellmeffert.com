# Phase 1: Bootstrap Migration - Research

**Researched:** 2026-01-19
**Domain:** Bootstrap 4 to Bootstrap 5.3.8 migration
**Confidence:** HIGH

## Summary

This phase upgrades the portfolio site from Bootstrap 4.x to Bootstrap 5.3.8. The migration requires updating CSS class names (logical properties for RTL support), namespacing data attributes with `data-bs-` prefix, and replacing the local Bootstrap CSS/JS files with Bootstrap 5.3.8 versions.

The scope is intentionally limited to Bootstrap framework only. jQuery and jQuery-dependent plugins (Owl Carousel, Magnific Popup, Isotope) remain untouched this phase - they continue to work alongside Bootstrap 5 since Bootstrap 5 simply no longer requires jQuery, but doesn't break it.

**Primary recommendation:** Update Bootstrap files, rename CSS classes in index.html, update data attributes, add link underline fix to style.css. Keep jQuery and all plugins running unchanged.

## Files Requiring Modification

### Must Change (Phase 1 Scope)

| File | Changes Required | Priority |
|------|------------------|----------|
| `css/bootstrap.min.css` | Replace with Bootstrap 5.3.8 | Critical |
| `js/bootstrap.min.js` | Replace with Bootstrap 5.3.8 bundle | Critical |
| `index.html` | Update CSS class names, data-bs-* attributes | Critical |
| `css/style.css` | Add link underline fix, update responsive class selectors | High |
| `js/popper.min.js` | Remove (bundled in bootstrap.bundle.min.js) | Medium |

### Do NOT Change (Deferred to Later Phases)

| File | Reason |
|------|--------|
| `js/jquery.min.js` | Still needed by plugins (Owl Carousel, Magnific Popup, etc.) |
| `js/custom.js` | jQuery-based code continues to work - migrate in Phase 3 |
| `js/owl.carousel.min.js` | Replace in Phase 2 |
| `js/jquery.magnific-popup.min.js` | Replace in Phase 2 |
| `js/isotope.js` | Works with jQuery - migrate in Phase 2 |

## Standard Stack

### Core (This Phase)

| Library | Version | Source | Purpose |
|---------|---------|--------|---------|
| Bootstrap CSS | 5.3.8 | Local file or CDN | CSS framework |
| Bootstrap Bundle JS | 5.3.8 | Local file or CDN | JS components (includes Popper 2.x) |

**CDN URLs (if using CDN approach):**
```html
<!-- CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- JS Bundle (includes Popper) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
```

**Local file approach (recommended for this project):**
Download and replace:
- `css/bootstrap.min.css` with Bootstrap 5.3.8
- `js/bootstrap.min.js` with `bootstrap.bundle.min.js` (includes Popper)
- Remove `js/popper.min.js` (no longer needed separately)

## Specific Class Mappings for This Codebase

Based on analysis of `index.html`, these are the exact changes needed:

### CSS Class Renames

| Line(s) | Current | Change To | Element |
|---------|---------|-----------|---------|
| 142, 175, 185, 199, 206, 224, etc. | `font-weight-bold` | `fw-bold` | Multiple headings, labels |
| 187-189 | `mr-0` | `me-0` | About work list items |
| 735, 751 | `pl-2 pr-2` | `ps-2 pe-2` | Blog card descriptions |
| 826 | `text-right` | `text-end` | Contact form submit wrapper |
| 849 | `float-left` | `float-start` | Footer copyright |
| 852 | `float-right` | `float-end` | Footer social icons |

**Full class replacement map:**

| Bootstrap 4 Class | Bootstrap 5 Class | Count in index.html |
|-------------------|-------------------|---------------------|
| `font-weight-bold` | `fw-bold` | 12 occurrences |
| `mr-0` | `me-0` | 3 occurrences |
| `pl-2` | `ps-2` | 2 occurrences |
| `pr-2` | `pe-2` | 2 occurrences |
| `text-right` | `text-end` | 1 occurrence |
| `float-left` | `float-start` | 1 occurrence |
| `float-right` | `float-end` | 1 occurrence |

### Data Attribute Changes

The site does NOT currently use Bootstrap JavaScript components that require data attributes. Scanning `index.html`:
- No `data-toggle` attributes found
- No `data-target` attributes found
- No `data-dismiss` attributes found
- No Bootstrap modals, dropdowns, or collapses using data attributes

The only data attributes in use are:
- `data-elements` (Typed.js - not Bootstrap)
- `data-count` (Custom counter animation - not Bootstrap)
- `data-filter` (Isotope filtering - not Bootstrap)

**Conclusion:** No data-bs-* namespace changes needed for this codebase.

### style.css Updates Required

The `style.css` file references Bootstrap 4 class names that need updating:

| Line | Current Selector | Change To |
|------|------------------|-----------|
| 55-62 | `h1.font-weight-bold` etc. | `h1.fw-bold` |
| 1420-1424 | `.float_none.float-right, .float_none.float-left` | `.float_none.float-end, .float_none.float-start` |

### Link Underline Fix

Bootstrap 5 adds underlines to links by default. The current site design doesn't have underlined navigation/social links. Add to `css/style.css`:

```css
/* Bootstrap 5 link underline fix - maintain design consistency */
a {
    text-decoration: none;
}
a:hover {
    text-decoration: none;
}
```

**Note:** The existing `style.css` already has `a { text-decoration: none !important; }` on line 69, so this is already handled.

## Order of Operations

Execute changes in this sequence to minimize issues:

### Step 1: Replace Bootstrap Files
1. Download Bootstrap 5.3.8 CSS and Bundle JS
2. Replace `css/bootstrap.min.css`
3. Replace `js/bootstrap.min.js` with `bootstrap.bundle.min.js`
4. Remove reference to `js/popper.min.js` from index.html (bundled now)

### Step 2: Update index.html Classes
1. Find/replace CSS classes (use exact mappings above)
2. Verify no data-bs-* changes needed (confirmed none required)

### Step 3: Update style.css Selectors
1. Update `.font-weight-bold` selectors to `.fw-bold`
2. Update `.float-left`/`.float-right` selectors to `.float-start`/`.float-end`
3. Verify link underline handling (already present)

### Step 4: Test
1. Load page in browser
2. Check console for errors
3. Test mobile hamburger menu (if navbar collapse exists)
4. Verify all sections render correctly

## Don't Hand-Roll

Problems with existing solutions - use Bootstrap 5's built-in features:

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Scroll spy navigation | Custom scroll tracking | Bootstrap 5 native ScrollSpy |
| Mobile hamburger menu | Custom toggle logic | Bootstrap 5 Offcanvas or Collapse |
| Responsive breakpoints | Custom media queries | Bootstrap 5 grid (now includes xxl) |

**Note:** The current site uses a custom `scrollspy.min.js` which may conflict with Bootstrap 5. However, since the contact form uses jQuery, and custom.js heavily uses jQuery, we keep the existing scrollspy for now and address in Phase 3.

## Common Pitfalls

### Pitfall 1: Forgetting Responsive Class Variants

**What goes wrong:** Classes like `text-md-right` also need updating to `text-md-end`

**In this codebase:** No responsive variants of directional classes found - safe.

**Prevention:** When searching for classes, also search for breakpoint variants (sm, md, lg, xl, xxl).

### Pitfall 2: Partial Class Name Matches

**What goes wrong:** Find/replace of `mr-` might match unintended content.

**Prevention:** Use word-boundary matching or carefully review each replacement. Search for `mr-0` not just `mr-`.

### Pitfall 3: Breaking jQuery Plugins

**What goes wrong:** Removing jQuery or changing data attributes breaks Owl Carousel, Magnific Popup, Isotope.

**Prevention:** DO NOT remove jQuery this phase. DO NOT touch plugin-related code. jQuery and Bootstrap 5 coexist fine.

### Pitfall 4: Missing the Bundle

**What goes wrong:** Using `bootstrap.min.js` instead of `bootstrap.bundle.min.js` means Popper is missing, breaking tooltips/popovers (if used).

**Prevention:** Always use `bootstrap.bundle.min.js` which includes Popper 2.x.

### Pitfall 5: Navbar Collapse on Mobile

**What goes wrong:** If the navbar hamburger menu uses `data-toggle="collapse"`, it will stop working.

**In this codebase:** Examining index.html - no navbar collapse found (the site uses a single-page scroll design without a hamburger menu collapse).

**Conclusion:** Not applicable to this site.

## Code Examples

### Bootstrap File Replacement

**index.html - Head section:**
```html
<!-- Before (line 96) -->
<link rel="stylesheet" href="css/bootstrap.min.css" />

<!-- After -->
<link rel="stylesheet" href="css/bootstrap.min.css" />
<!-- No change to link, just replace the file content -->
```

**index.html - Before closing body:**
```html
<!-- Before (lines 874-876) -->
<script src="js/jquery.min.js"></script>
<script src="js/popper.min.js"></script>
<script src="js/bootstrap.min.js"></script>

<!-- After -->
<script src="js/jquery.min.js"></script>
<!-- popper.min.js removed - bundled in bootstrap -->
<script src="js/bootstrap.bundle.min.js"></script>
```

### Class Name Updates

**About section (line 187-189):**
```html
<!-- Before -->
<li class="list-inline-item mr-0 text-muted">Web Developer</li>
<li class="list-inline-item mr-0 text-muted">Programmer</li>
<li class="list-inline-item mr-0 text-muted">Business Owner</li>

<!-- After -->
<li class="list-inline-item me-0 text-muted">Web Developer</li>
<li class="list-inline-item me-0 text-muted">Programmer</li>
<li class="list-inline-item me-0 text-muted">Business Owner</li>
```

**Footer (lines 849, 852):**
```html
<!-- Before -->
<div class="float-left float_none mt-2 mb-2">
<div class="float-right float_none mt-2 mb-2">

<!-- After -->
<div class="float-start float_none mt-2 mb-2">
<div class="float-end float_none mt-2 mb-2">
```

**Contact form (line 826):**
```html
<!-- Before -->
<div class="col-sm-12 text-right">

<!-- After -->
<div class="col-sm-12 text-end">
```

**Blog cards (lines 735, 751):**
```html
<!-- Before -->
<p class="mt-3 desc_blog pl-2 pr-2 text-muted">

<!-- After -->
<p class="mt-3 desc_blog ps-2 pe-2 text-muted">
```

### style.css Updates

```css
/* Before (lines 55-62) */
h1.font-weight-bold,
h2.font-weight-bold,
h3.font-weight-bold,
h4.font-weight-bold,
h5.font-weight-bold,
h6.font-weight-bold {
    font-weight: 600 !important;
}

/* After */
h1.fw-bold,
h2.fw-bold,
h3.fw-bold,
h4.fw-bold,
h5.fw-bold,
h6.fw-bold {
    font-weight: 600 !important;
}
```

```css
/* Before (lines 1420-1424) */
.float_none.float-right,
.float_none.float-left {
    float: none !important;
    text-align: center;
}

/* After */
.float_none.float-end,
.float_none.float-start {
    float: none !important;
    text-align: center;
}
```

## Testing Checklist

### Success Criteria Validation

| Criteria | How to Test | Expected Result |
|----------|-------------|-----------------|
| Bootstrap 5.3.8 CSS/JS load without errors | Open browser console | No 404s, no JS errors |
| Navigation hamburger opens/closes | Resize to mobile, tap hamburger | (Not applicable - no hamburger in this design) |
| All sections display correctly | Visual inspection of each section | Layout matches current site |
| No deprecated data-toggle attributes | Search HTML for `data-toggle` | Zero matches |
| Link underlines render correctly | Visual inspection | No unexpected underlines |

### Visual Regression Checklist

- [ ] Hero section: Text styling, social icons
- [ ] About section: Skill progress bars, job titles alignment
- [ ] Fun Facts: Counter boxes, spacing
- [ ] Education: Timeline layout, year badges
- [ ] CTA: Button styling
- [ ] Work/Portfolio: Filter buttons, image grid
- [ ] Testimonials: Carousel (still working with jQuery)
- [ ] Certifications: Image grid
- [ ] Blog: Card layout, padding
- [ ] Contact: Form styling, button alignment
- [ ] Footer: Copyright left, social icons right

### Console Checklist

- [ ] No `$ is not defined` errors (jQuery still loaded)
- [ ] No Bootstrap-related errors
- [ ] No 404 errors for CSS/JS files

## Open Questions

None. All migration requirements are well-documented by Bootstrap's official migration guide and verified against this codebase.

## Sources

### Primary (HIGH confidence)
- [Bootstrap 5.3 Official Migration Guide](https://getbootstrap.com/docs/5.3/migration/) - Verified 2026-01-19
- Project codebase analysis (`index.html`, `style.css`, `custom.js`)

### Secondary (HIGH confidence)
- Project research files:
  - `.planning/research/STACK.md`
  - `.planning/research/PITFALLS.md`
  - `.planning/research/ARCHITECTURE.md`

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Bootstrap 5.3.8 CDN/files
- Class mappings: HIGH - Verified against actual index.html content
- Order of operations: HIGH - Based on official migration guide
- Pitfalls: HIGH - Verified against codebase (most don't apply)

**Research date:** 2026-01-19
**Valid until:** 2026-07-19 (Bootstrap 5.3.x stable, unlikely to change significantly)
