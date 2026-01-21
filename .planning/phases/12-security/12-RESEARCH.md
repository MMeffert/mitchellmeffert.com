# Phase 12: Security - Research

**Researched:** 2026-01-20
**Domain:** Subresource Integrity (SRI) for CDN resources
**Confidence:** HIGH

## Summary

Subresource Integrity (SRI) is a security feature that enables browsers to verify that resources fetched from CDNs are delivered without unexpected manipulation. It works by providing a cryptographic hash in the `integrity` attribute that the fetched resource must match.

The site currently loads 7 CDN resources (1 CSS + 6 JavaScript files) from jsDelivr, plus 1 Google reCAPTCHA script. All jsDelivr resources can and should have SRI hashes added. Google reCAPTCHA does NOT support SRI due to its dynamically-updated content.

This phase is straightforward: add `integrity` and `crossorigin="anonymous"` attributes to all jsDelivr CDN resources, leave Google reCAPTCHA unchanged, and verify no console errors occur.

**Primary recommendation:** Add SRI hashes to all jsDelivr resources with `crossorigin="anonymous"`. Document that Google reCAPTCHA cannot use SRI due to dynamic content.

## Standard Stack

### Core Requirements
| Component | Purpose | Why Required |
|-----------|---------|--------------|
| `integrity` attribute | Contains cryptographic hash | Browser compares this to computed hash of fetched resource |
| `crossorigin="anonymous"` | Enables CORS checking | Required for cross-origin SRI to work; without it, browser "fails open" and ignores integrity check |
| SHA-384 algorithm | Hash algorithm | Industry standard balance of security and performance |

### Tools
| Tool | Purpose | Source |
|------|---------|--------|
| OpenSSL | Generate SRI hashes locally | Already installed on macOS |
| srihash.org | Online hash generator | https://srihash.org/ |
| jsDelivr API | Get pre-computed hashes | https://www.jsdelivr.com/ |

## CDN Resources Inventory

### Resources That Support SRI (jsDelivr - 7 total)

**CSS Files (2):**
| Resource | URL | Generated Hash |
|----------|-----|----------------|
| PhotoSwipe CSS | `https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.css` | `sha384-IfxC36XL/toUyJ939C73PcgMuRzAZuIzZxE38drsmO5p6jD7ei+Zx/1oA/0l8ysE` |
| Splide CSS | `https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css` | `sha384-RQYEYzAnHyG0swTqlleCCsKHN9pUKyYMflAk6KEjvY6KhE5MLlvjwZkai5538g2T` |

**JavaScript Files (5):**
| Resource | URL | Generated Hash |
|----------|-----|----------------|
| PhotoSwipe Core | `https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/umd/photoswipe.umd.min.js` | `sha384-k8EKyYcONphQ7zH4cQ0888JapXwrLTXQl/Ue1/jYgjVYahln1NWpnt2S4IC56LNh` |
| PhotoSwipe Lightbox | `https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/umd/photoswipe-lightbox.umd.min.js` | `sha384-IiBVbUz6+U+Tbm/ijO2P0XRwcVzNfrMzloNLkrqHkbi6w5H0v6ie4fI9BIO4SwdK` |
| Isotope | `https://cdn.jsdelivr.net/npm/isotope-layout@3.0.6/dist/isotope.pkgd.min.js` | `sha384-vtH+5pZsjdWxaTWlFSCrWM6i0TIG0HKOqJbPo91LB35dvWpVzuWdJeVoNweP+eoY` |
| Splide JS | `https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js` | `sha384-RbYB5yr9jD1p+2OHlV3KzOBLAY48CbFsJ87bXEFYINGgOlQJNE4cEjTUf+Q2fygb` |
| Typed.js | `https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js` | `sha384-cMrTlShXEGSdSFA359p+3aVUxK/R+0TAfbRZMcTlAn8yqzxEDj05QsS65nTFMMj4` |

### Resources That CANNOT Use SRI (1)

| Resource | URL | Reason |
|----------|-----|--------|
| Google reCAPTCHA Enterprise | `https://www.google.com/recaptcha/enterprise.js?render=...` | Google frequently updates the script content without versioning. The script loads additional dynamic resources. No CORS headers provided. This is a known limitation documented by Google. |

## Architecture Patterns

### Correct SRI Syntax

```html
<!-- For CSS -->
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/example@1.0.0/dist/style.css"
      integrity="sha384-[base64-hash]"
      crossorigin="anonymous">

<!-- For JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/example@1.0.0/dist/script.min.js"
        integrity="sha384-[base64-hash]"
        crossorigin="anonymous"></script>
```

### Hash Format

The `integrity` attribute value format:
```
sha384-[base64-encoded-hash]
```

- **sha384**: The hash algorithm prefix (SHA-384 is the standard)
- **-**: Separator (hyphen)
- **[base64-encoded-hash]**: The Base64-encoded hash value

### Generating Hashes (Command Line)

```bash
# Using curl and OpenSSL
curl -s "https://cdn.jsdelivr.net/npm/package@version/dist/file.js" | \
    openssl dgst -sha384 -binary | \
    openssl base64 -A
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Hash generation | Manual hash calculation | OpenSSL or srihash.org | Already handles encoding, algorithm selection |
| CORS configuration | Custom CORS handling | `crossorigin="anonymous"` attribute | Browser-native, works with any CORS-enabled CDN |
| Hash verification | Custom integrity checking | Browser built-in SRI | Browsers handle verification automatically |

**Key insight:** SRI is entirely browser-native. You only need to add attributes; the browser handles all verification.

## Common Pitfalls

### Pitfall 1: Missing crossorigin Attribute
**What goes wrong:** SRI hash is added but `crossorigin` is omitted.
**Why it happens:** Developers assume only `integrity` is needed.
**How to avoid:** ALWAYS add `crossorigin="anonymous"` when adding `integrity`.
**Warning signs:** Site loads resources normally (no errors), but SRI is silently disabled - browser "fails open".

### Pitfall 2: Attempting SRI on Dynamic Scripts
**What goes wrong:** Trying to add SRI to Google reCAPTCHA or other dynamic scripts.
**Why it happens:** Not understanding that SRI requires static, versioned content.
**How to avoid:** Verify CDN provides versioned, immutable files before attempting SRI.
**Warning signs:** Console errors about integrity mismatch, broken functionality.

### Pitfall 3: Hash Mismatch After CDN Update
**What goes wrong:** Hash was computed at one time, but CDN content changed.
**Why it happens:** Using unversioned CDN URLs (e.g., `@latest` instead of `@5.4.4`).
**How to avoid:** ALWAYS use exact version numbers in CDN URLs.
**Warning signs:** Console error: "Failed to find a valid digest in the 'integrity' attribute".

### Pitfall 4: Wrong Hash Algorithm Prefix
**What goes wrong:** Hash computed with SHA-256 but prefix says SHA-384, or prefix omitted entirely.
**Why it happens:** Copy-paste errors or incomplete understanding.
**How to avoid:** Always verify the complete format: `sha384-[hash]`.
**Warning signs:** Resource blocked, console errors about invalid integrity value.

### Pitfall 5: Incorrect Attribute Placement
**What goes wrong:** Attributes placed outside the tag or with wrong syntax.
**Why it happens:** HTML typos or malformed attribute strings.
**How to avoid:** Place attributes inside the opening tag, use proper quoting.
**Warning signs:** HTML validation errors, attributes not applied.

## Code Examples

### Before (Current State)
```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css" />

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/umd/photoswipe.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/umd/photoswipe-lightbox.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/isotope-layout@3.0.6/dist/isotope.pkgd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js"></script>
```

### After (With SRI)
```html
<!-- CSS -->
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.css"
      integrity="sha384-IfxC36XL/toUyJ939C73PcgMuRzAZuIzZxE38drsmO5p6jD7ei+Zx/1oA/0l8ysE"
      crossorigin="anonymous">
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css"
      integrity="sha384-RQYEYzAnHyG0swTqlleCCsKHN9pUKyYMflAk6KEjvY6KhE5MLlvjwZkai5538g2T"
      crossorigin="anonymous">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/umd/photoswipe.umd.min.js"
        integrity="sha384-k8EKyYcONphQ7zH4cQ0888JapXwrLTXQl/Ue1/jYgjVYahln1NWpnt2S4IC56LNh"
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/umd/photoswipe-lightbox.umd.min.js"
        integrity="sha384-IiBVbUz6+U+Tbm/ijO2P0XRwcVzNfrMzloNLkrqHkbi6w5H0v6ie4fI9BIO4SwdK"
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/isotope-layout@3.0.6/dist/isotope.pkgd.min.js"
        integrity="sha384-vtH+5pZsjdWxaTWlFSCrWM6i0TIG0HKOqJbPo91LB35dvWpVzuWdJeVoNweP+eoY"
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"
        integrity="sha384-RbYB5yr9jD1p+2OHlV3KzOBLAY48CbFsJ87bXEFYINGgOlQJNE4cEjTUf+Q2fygb"
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js"
        integrity="sha384-cMrTlShXEGSdSFA359p+3aVUxK/R+0TAfbRZMcTlAn8yqzxEDj05QsS65nTFMMj4"
        crossorigin="anonymous"></script>
```

### Google reCAPTCHA (Unchanged)
```html
<!-- Cannot use SRI - Google updates content dynamically -->
<script src="https://www.google.com/recaptcha/enterprise.js?render=6LclXjYsAAAAAOGddQLVaLNDsjXeDfajOgJtvdfD"></script>
```

## Verification Process

### Step 1: Visual Verification
After adding SRI attributes:
1. Open the site in browser
2. Check that all functionality works (carousel, lightbox, typing effect, portfolio filter)
3. Verify no visual regressions

### Step 2: Console Check
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Refresh the page
4. Verify NO SRI-related errors appear

**Expected console output:** No errors related to integrity or CORS.

### Step 3: Intentional Failure Test
To verify SRI is actually working (not just silently ignored):
1. Temporarily modify one character of a hash (e.g., change first letter)
2. Refresh the page
3. Verify console shows error like: "Failed to find a valid digest in the 'integrity' attribute"
4. Verify the resource does NOT load (functionality breaks)
5. Restore correct hash

### Step 4: Network Tab Verification
1. Open Developer Tools > Network tab
2. Refresh page
3. Click on a CDN resource (e.g., photoswipe.css)
4. Verify it has status 200 and loaded successfully

## Browser Support

SRI is supported by all modern browsers:

| Browser | Supported |
|---------|-----------|
| Chrome | Yes (since v45) |
| Firefox | Yes (since v43) |
| Safari | Yes (since v11) |
| Edge | Yes (since v17) |
| Opera | Yes (since v32) |

**Note:** Older browsers that don't support SRI will ignore the `integrity` attribute and load resources normally. This is safe - SRI degrades gracefully.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| SHA-256 | SHA-384 preferred | ~2018 | Stronger hash, industry consensus |
| No crossorigin | Always use crossorigin | Spec clarification | Without it, browser fails open and ignores SRI |
| Manual hash management | CDNs provide hashes | Ongoing | jsDelivr and other CDNs support SRI natively |

## Open Questions

1. **reCAPTCHA security compensating control**
   - What we know: Google reCAPTCHA cannot use SRI
   - What's unclear: Whether CSP should be added as compensating control
   - Recommendation: Document this limitation; CSP is out of scope for this phase

## Sources

### Primary (HIGH confidence)
- [MDN - Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity) - Core specification, syntax, behavior
- [MDN - SRI Implementation Guide](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/SRI) - Practical implementation steps
- [OWASP - Subresource Integrity](https://owasp.org/www-community/controls/SubresourceIntegrity) - Security context
- [jsDelivr CDN](https://www.jsdelivr.com/) - Verified CORS headers: `Access-Control-Allow-Origin: *`

### Secondary (MEDIUM confidence)
- [jsDelivr Using SRI](https://www.jsdelivr.com/using-sri-with-dynamic-files) - jsDelivr SRI support
- [srihash.org](https://srihash.org/) - Hash generation tool
- [Google reCAPTCHA Forum - SRI Discussion](https://groups.google.com/g/recaptcha/c/BFY3TZ-2g3w) - Confirms reCAPTCHA cannot use SRI

### Hash Generation (Verified)
All hashes were generated on 2026-01-20 using:
```bash
curl -s "[URL]" | openssl dgst -sha384 -binary | openssl base64 -A
```

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - MDN documentation is authoritative
- Architecture: HIGH - HTML attribute syntax is well-documented
- Pitfalls: HIGH - Common issues are well-documented in MDN and OWASP
- Generated hashes: HIGH - Computed directly from current CDN content

**Research date:** 2026-01-20
**Valid until:** 2026-07-20 (hashes valid as long as CDN versions unchanged)
