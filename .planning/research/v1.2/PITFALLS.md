# Pitfalls Research: Performance & SEO

**Domain:** Static portfolio site performance and SEO optimization
**Project:** mitchellmeffert.com (CloudFront + S3)
**Researched:** 2026-01-21
**Confidence:** HIGH (Google official docs, AWS documentation verified)

---

## Executive Summary

Adding performance and SEO optimizations to an existing static site has several common failure modes. The most critical pitfalls fall into three categories:

1. **Core Web Vitals anti-patterns** - Especially lazy-loading the LCP image, which the current site may do unintentionally via the preloader overlay
2. **Structured data validation failures** - JSON-LD syntax errors and schema mismatches that silently fail without affecting page render
3. **CloudFront cache conflicts** - Cache invalidation and compression configuration that prevent optimizations from being served

The current site already has some performance foundations (minified CSS, CDN delivery, responsive images). The risks are primarily in the implementation details of new optimizations conflicting with existing patterns.

---

## Core Web Vitals Pitfalls

### Pitfall 1: Lazy-Loading the LCP Hero Image

**What goes wrong:** The largest above-the-fold image (likely the hero background or headshot) is lazy-loaded, telling the browser to intentionally delay loading the most important visual element.

**Why it matters for this site:** The site has a `#preloader` div that hides content until page load. If images use `loading="lazy"`, they won't start loading until the preloader clears AND the browser determines they're in viewport - creating a double delay.

**Warning signs:**
- LCP score > 2.5s in PageSpeed Insights
- "Largest Contentful Paint element was lazy loaded" warning in Lighthouse
- Hero section appears last even though it's first in DOM

**Prevention:**
1. Identify the LCP element (likely hero background or profile image)
2. Remove `loading="lazy"` from LCP image
3. Add `fetchpriority="high"` to LCP image
4. Add preload link in `<head>`: `<link rel="preload" as="image" href="images/hero.jpg" fetchpriority="high">`
5. Never use CSS background-image for LCP element - use `<img>` tag

**Affects phase:** Core Web Vitals phase - must be addressed first

**Sources:**
- [web.dev - Optimize Largest Contentful Paint](https://web.dev/articles/optimize-lcp)
- [MDN - Fix LCP by optimizing image loading](https://developer.mozilla.org/en-US/blog/fix-image-lcp/)

---

### Pitfall 2: Preloader Overlay Blocking LCP Paint

**What goes wrong:** The `#preloader` div with `#status` spinner creates a visual overlay that the browser counts as blocking LCP. The actual hero content isn't painted until JavaScript removes the preloader.

**Why it matters for this site:** The current `index.html` lines 136-141 show a preloader pattern that may delay LCP measurement.

**Warning signs:**
- LCP reports spinner or preloader background as LCP element
- LCP timing is equal to preloader hide timing
- "Reduce JavaScript execution time" warning

**Prevention:**
1. Consider removing preloader entirely (modern sites rarely need them)
2. If keeping preloader, ensure it's a CSS-only animation that doesn't block paint
3. Use `content-visibility: auto` for below-fold sections instead of JS preloader
4. Measure LCP before and after preloader removal to validate improvement

**Affects phase:** Core Web Vitals phase

---

### Pitfall 3: Font-Display Swap Causing CLS

**What goes wrong:** Using `font-display: swap` causes visible layout shift when web fonts load and have different metrics than fallback fonts.

**Why it matters for this site:** The site loads external fonts (mobiriseicons, materialdesignicons). If the main content font differs significantly from system fallback, text will reflow when fonts load.

**Warning signs:**
- CLS score > 0.1
- Text visibly jumps/reflows during page load
- "Avoid large layout shifts" warning pointing to text elements

**Prevention:**
1. Use `font-display: optional` instead of `swap` for non-critical fonts
2. For critical fonts, use font metric overrides (`size-adjust`, `ascent-override`)
3. Preload critical fonts: `<link rel="preload" as="font" href="..." crossorigin>`
4. Consider using modern system font stacks for body text
5. Reserve explicit dimensions for elements containing icon fonts

**Affects phase:** Core Web Vitals phase

**Sources:**
- [DebugBear - Fixing Layout Shifts Caused by Web Fonts](https://www.debugbear.com/blog/web-font-layout-shift)
- [web.dev - Optimize CLS](https://web.dev/articles/optimize-cls)

---

### Pitfall 4: Third-Party Scripts Blocking INP

**What goes wrong:** Third-party scripts (reCAPTCHA, analytics) block the main thread, causing slow response to user interactions.

**Why it matters for this site:** The site loads reCAPTCHA Enterprise in `<head>` which blocks initial render and can delay interaction response.

**Warning signs:**
- INP score > 200ms
- "Reduce JavaScript execution time" in Lighthouse
- "Minimize main-thread work" warning
- Contact form interactions feel sluggish

**Prevention:**
1. Move reCAPTCHA script to just before `</body>` with `defer` attribute
2. Load reCAPTCHA only on contact form interaction (lazy load on focus)
3. Use `loading="lazy"` pattern for reCAPTCHA:
```javascript
// Load reCAPTCHA only when form is interacted with
document.querySelector('form').addEventListener('focusin', function() {
    if (!window.grecaptcha) {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/enterprise.js?render=...';
        document.head.appendChild(script);
    }
}, { once: true });
```
4. Add `async` or `defer` to any analytics scripts

**Affects phase:** Core Web Vitals phase

---

### Pitfall 5: Relying Only on Lab Data

**What goes wrong:** Site passes Lighthouse/PageSpeed lab tests but fails Google Search Console field data. Team celebrates false success.

**Why it happens:** Lab data uses simulated conditions. Field data uses real Chrome users over 28 days - including old phones on slow connections.

**Warning signs:**
- Green scores in Lighthouse but yellow/red in Search Console
- "Origin has no data" message (need traffic for field data)
- Scores vary wildly between lab test runs

**Prevention:**
1. Use Google Search Console "Core Web Vitals" report as source of truth
2. Test with throttling enabled (Lighthouse: "Applied slow 4G, 4x CPU slowdown")
3. Test on actual mid-range Android device
4. Set up Real User Monitoring (RUM) via web-vitals library
5. Don't optimize only for Lighthouse - optimize for 75th percentile users

**Affects phase:** All phases - ongoing validation

**Sources:**
- [Google - Understanding Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)

---

## Structured Data Pitfalls

### Pitfall 6: Using Wrong Schema Type for Page Type

**What goes wrong:** Using generic "WebPage" or "Article" schema when more specific types exist. Or using "LocalBusiness" for a personal portfolio that's not a business.

**Why it matters for this site:** A personal portfolio should use "Person" and "ProfilePage" schemas, not "Organization" or "LocalBusiness".

**Warning signs:**
- Rich Results Test shows "no eligible rich results"
- Knowledge Panel doesn't appear despite correct implementation
- Schema validates but doesn't match page content type

**Prevention:**
1. For personal portfolio, use these schemas:
   - `Person` - for the individual (Mitchell Meffert)
   - `ProfilePage` - for the page itself
   - `WebSite` - for site-level structured data
2. DO NOT use `Organization` or `LocalBusiness` unless the site represents a business entity
3. Include `sameAs` links to social profiles (LinkedIn, GitHub)
4. Ensure visible content matches schema claims

**Affects phase:** Structured Data phase

**Sources:**
- [schema.org - Person](https://schema.org/Person)
- [AIOSEO - Person Schema Markup](https://aioseo.com/seo-glossary/person-schema-markup/)

---

### Pitfall 7: JSON-LD Syntax Errors Silently Fail

**What goes wrong:** Invalid JSON syntax in structured data markup. Page renders fine but structured data is ignored by search engines.

**Why it happens:** JSON-LD is unforgiving - missing comma, extra comma, unescaped quote all break parsing. Browser shows no visible error.

**Warning signs:**
- Rich Results Test shows "Couldn't read structured data"
- No console errors (JSON-LD fails silently)
- Schema Markup Validator shows syntax errors

**Prevention:**
1. Always validate with Google Rich Results Test before deploying
2. Use JSON validator during development
3. Build JSON-LD in JavaScript template literals to avoid manual escaping:
```javascript
const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mitchell Meffert",
    "jobTitle": "AWS Cloud Architect"
};
const script = document.createElement('script');
script.type = 'application/ld+json';
script.text = JSON.stringify(schema);
document.head.appendChild(script);
```
4. Use VS Code JSON schema validation for inline JSON-LD

**Affects phase:** Structured Data phase

**Sources:**
- [Google - Rich Results Test](https://search.google.com/test/rich-results)
- [thegray.company - Implement Schema Avoid Mistakes](https://thegray.company/blog/implement-schema-avoid-mistakes)

---

### Pitfall 8: Schema Markup Doesn't Match Visible Content

**What goes wrong:** Schema claims differ from what users see on page. Google may issue manual penalty or ignore schema entirely.

**Example:** Schema says `"jobTitle": "Senior Cloud Architect"` but page says "Web Developer & IT Lead"

**Warning signs:**
- Manual actions in Search Console for "Misleading structured data"
- Rich results stop appearing
- Significant discrepancy between schema and visible text

**Prevention:**
1. Schema content must match visible page content exactly (< 5% discrepancy recommended)
2. Audit schema claims against actual page text before deployment
3. If page content changes, update schema simultaneously
4. Don't add schema for content that isn't visible to users

**Affects phase:** Structured Data phase

---

### Pitfall 9: Expecting Guaranteed Rich Results

**What goes wrong:** Implementing schema markup and expecting immediate rich results (Knowledge Panel, enhanced snippets). Disappointment when nothing changes.

**Why it happens:** Structured data only increases likelihood of rich results - Google decides what to show. Many factors affect display.

**Warning signs:**
- Spending excessive time tweaking schema for "better" rich results
- Adding unnecessary schema types hoping for more features
- Frustration when valid schema doesn't produce visible results

**Prevention:**
1. Set realistic expectations: schema helps Google understand content, doesn't guarantee rich results
2. Focus on accuracy over comprehensiveness
3. Personal sites rarely get Knowledge Panels unless the person is notable
4. Primary value is helping AI/voice assistants extract accurate information

**Affects phase:** Structured Data phase - expectation setting

---

## Technical SEO Pitfalls

### Pitfall 10: Sitemap Lists Canonicalized or Noindexed URLs

**What goes wrong:** XML sitemap includes URLs that have `rel="canonical"` pointing elsewhere or have `noindex` meta tags. Google flags this as conflicting signals.

**Why it matters for this site:** Single-page site may have only one canonical URL (mitchellmeffert.com). Ensure sitemap doesn't list variants.

**Warning signs:**
- Search Console shows "Submitted URL marked 'noindex'"
- Search Console shows "Page with redirect"
- Sitemap includes both `/` and `/index.html` URLs

**Prevention:**
1. Sitemap should only include canonical, indexable URLs
2. For single-page site, sitemap may only have one URL - that's fine
3. Don't include URL variants (`/`, `/index.html`, `www.` vs non-www)
4. Sitemap URL must use same protocol and domain as canonical

**Affects phase:** Technical SEO phase

**Sources:**
- [SE Ranking - Robots.txt Guide](https://seranking.com/blog/guide-robots-txt/)

---

### Pitfall 11: Robots.txt Blocking Critical Assets

**What goes wrong:** robots.txt disallows CSS, JavaScript, or image directories. Google can't render pages properly and may consider them not mobile-friendly.

**Warning signs:**
- "Blocked resources" in Search Console
- Mobile Usability issues
- "Googlebot could not access the page"

**Prevention:**
1. Never disallow `/css/`, `/js/`, `/images/` directories
2. For static portfolio, robots.txt should be minimal:
```
User-agent: *
Allow: /

Sitemap: https://mitchellmeffert.com/sitemap.xml
```
3. Only disallow paths with no SEO value (admin panels, which this site doesn't have)
4. Test with Google Search Console's robots.txt tester

**Affects phase:** Technical SEO phase

**Sources:**
- [Search Engine Land - Robots.txt and SEO 2026](https://searchengineland.com/robots-txt-seo-453779)

---

### Pitfall 12: Exposing "Hidden" Paths via Disallow

**What goes wrong:** Using `Disallow: /admin/` or `Disallow: /secret/` in robots.txt actually advertises these paths exist. Security through obscurity fails.

**Why it matters for this site:** LOW risk - this is a static site without hidden paths. But worth knowing if adding any.

**Prevention:**
1. Don't use robots.txt to "hide" sensitive paths
2. If path shouldn't be crawled AND shouldn't be known, use authentication instead
3. For static sites, only disallow what's truly not useful for SEO

**Affects phase:** Technical SEO phase

---

### Pitfall 13: Duplicate or Missing Meta Descriptions

**What goes wrong:** Same meta description on every page, or no meta description at all. Google rewrites descriptions (62% of the time in 2026) or shows poor snippets.

**Why it matters for this site:** Single-page site has one meta description - but ensure it's unique, compelling, and under 160 characters.

**Warning signs:**
- Search Console shows "Duplicate meta descriptions"
- Search results show snippet that doesn't match page content
- Very long or very short meta descriptions

**Prevention:**
1. Each unique page needs unique meta description
2. Keep under 160 characters (Google may truncate)
3. Include target keyword naturally
4. Write for users, not search engines - it's a preview
5. Current site description (line 81) looks good - verify it's under limit

**Affects phase:** Technical SEO phase

---

## CloudFront/S3 Specific Pitfalls

### Pitfall 14: Compression Not Enabled or Misconfigured

**What goes wrong:** CloudFront serves uncompressed files, or compression configuration conflicts prevent Brotli from working.

**Why it matters for this site:** The site serves CSS/JS files that benefit significantly from compression. Incorrect config wastes bandwidth and slows load.

**Warning signs:**
- Response headers show no `Content-Encoding: br` or `Content-Encoding: gzip`
- Files larger than expected in Network tab
- CloudFront cost higher than expected

**Prevention:**
1. Use CloudFront cache policy with both Gzip and Brotli enabled
2. Use CachingOptimized managed policy (includes compression)
3. Upload files uncompressed to S3 - let CloudFront compress
4. Ensure origin doesn't return `Content-Encoding` header
5. Verify TTL > 0 (compression disabled when caching disabled)
6. Note: Brotli only works over HTTPS (which this site uses)

**Affects phase:** Any deployment phase

**Sources:**
- [AWS Docs - Serve Compressed Files](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html)
- [CloudFix - CloudFront Compression Guide](https://cloudfix.com/blog/cloudfront-compression/)

---

### Pitfall 15: Cache Invalidation Timing Issues

**What goes wrong:** Deploy new optimized assets, but CloudFront continues serving old cached versions. Users don't see improvements.

**Why it matters for this site:** After adding preload hints, optimized images, or structured data - old HTML may be cached for up to 24 hours (default TTL).

**Warning signs:**
- Local testing shows improvements but production doesn't
- Network tab shows old file versions
- Changes work after clearing browser cache but not for new visitors

**Prevention:**
1. Use versioned filenames for CSS/JS: `style.css?v=20260121`
2. For HTML changes, run CloudFront invalidation: `/*` or `/index.html`
3. Set appropriate Cache-Control headers per file type:
   - HTML: `max-age=300` (5 minutes) or lower
   - CSS/JS: `max-age=31536000` (1 year) with versioned filenames
   - Images: `max-age=604800` (1 week) to `max-age=31536000`
4. The current site uses versioning (`style.css?v=20260120b`) - continue this pattern
5. GitHub Actions deployment should include invalidation step

**Affects phase:** All deployments

**Sources:**
- [AWS Docs - Controlling Cache Duration](https://docs.aws.amazon.com/whitepapers/latest/build-static-websites-aws/controlling-how-long-amazon-s3-content-is-cached-by-amazon-cloudfront.html)
- [AWS re:Post - Cache Invalidations](https://repost.aws/questions/QUepJkToU0TbSTLIm6pLKzOw/cache-invalidations-with-cloudfront-and-s3)

---

### Pitfall 16: Preload Hints Cached Without Resource

**What goes wrong:** Adding `<link rel="preload">` for a resource, but CloudFront cache already has HTML without the hint. New visitors get old HTML and don't benefit from preload.

**Why it happens:** Browser fetches cached HTML (no preload), then fetches resource normally. Preload optimization never kicks in.

**Prevention:**
1. After adding preload hints, immediately invalidate HTML in CloudFront
2. Test from incognito/private browser to verify new HTML served
3. Check response headers for CloudFront `X-Cache: Hit from cloudfront` vs `Miss from cloudfront`

**Affects phase:** Core Web Vitals phase

---

### Pitfall 17: S3 Website Endpoint vs REST API Endpoint

**What goes wrong:** CloudFront origin configured as S3 static website endpoint (`s3-website-...amazonaws.com`) instead of REST API endpoint. Results in 503 errors under load and no OAI/OAC support.

**Why it matters for this site:** Need to verify current configuration. Website endpoint has lower concurrency limits.

**Warning signs:**
- Intermittent 503 errors under traffic
- "LimitExceeded" errors in CloudFront
- Can't use Origin Access Identity

**Prevention:**
1. Use S3 REST API endpoint: `bucket-name.s3.region.amazonaws.com`
2. Configure Origin Access Control (OAC) for security
3. Check current CDK configuration for origin type

**Affects phase:** Infrastructure verification

**Sources:**
- [AWS re:Post - 503 LimitExceeded with S3 Static Website](https://repost.aws/questions/QU5KtVWPsfRQikpRW4xnCgpg/cloudfront-with-s3-bucket-static-page-consistent-503-limitexceeded-errors)

---

### Pitfall 18: Response Headers Missing Security or Performance Headers

**What goes wrong:** Missing `X-Content-Type-Options`, `Strict-Transport-Security`, or performance headers like `Cache-Control` because they're not configured in CloudFront response headers policy.

**Why it matters for this site:** Security headers affect SEO indirectly (site reputation). Performance headers directly affect caching.

**Prevention:**
1. Create/use CloudFront Response Headers Policy with:
   - `X-Content-Type-Options: nosniff`
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
   - `X-Frame-Options: DENY` (if not using iframes)
2. Verify with browser DevTools Network tab
3. Use securityheaders.com to audit

**Affects phase:** Infrastructure phase

---

## Phase-Specific Warnings Summary

| Phase | Topic | Pitfalls to Address | Risk Level |
|-------|-------|--------------------|----|
| Core Web Vitals | LCP/CLS/INP optimization | #1-4 (LCP image, preloader, fonts, third-party scripts) | HIGH |
| Structured Data | JSON-LD implementation | #6-9 (schema type, syntax, content match, expectations) | MEDIUM |
| Technical SEO | Sitemap, robots.txt, meta | #10-13 (conflicting signals, blocking, duplicates) | MEDIUM |
| CloudFront Config | Caching and compression | #14-18 (compression, invalidation, origins, headers) | MEDIUM |

---

## Pre-Implementation Checklist

Before starting optimizations, verify current state:

- [ ] Run PageSpeed Insights and record baseline scores
- [ ] Identify current LCP element (may be preloader or hero)
- [ ] Check if any images have `loading="lazy"` above fold
- [ ] Note current reCAPTCHA script loading position
- [ ] Verify CloudFront compression enabled (check response headers)
- [ ] Confirm GitHub Actions has CloudFront invalidation step
- [ ] Review existing meta description length and quality
- [ ] Check for existing structured data (likely none currently)

After each phase, verify:

- [ ] PageSpeed Insights scores improved or maintained
- [ ] No console errors
- [ ] Rich Results Test validates structured data
- [ ] CloudFront serving compressed responses
- [ ] Changes visible in production (not cached old version)

---

## Sources

### Official Documentation (HIGH confidence)
- [Google - Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [web.dev - Optimize LCP](https://web.dev/articles/optimize-lcp)
- [web.dev - Optimize CLS](https://web.dev/articles/optimize-cls)
- [AWS - CloudFront Compression](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html)
- [AWS - S3 Caching with CloudFront](https://docs.aws.amazon.com/whitepapers/latest/build-static-websites-aws/controlling-how-long-amazon-s3-content-is-cached-by-amazon-cloudfront.html)
- [schema.org - Person](https://schema.org/Person)

### Developer Resources (HIGH confidence)
- [MDN - Fix Image LCP](https://developer.mozilla.org/en-US/blog/fix-image-lcp/)
- [DebugBear - Web Font Layout Shift](https://www.debugbear.com/blog/web-font-layout-shift)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

### Industry Resources (MEDIUM confidence)
- [Search Engine Land - Robots.txt SEO 2026](https://searchengineland.com/robots-txt-seo-453779)
- [WP Rocket - SEO Mistakes 2026](https://wp-rocket.me/blog/seo-mistakes/)
- [AIOSEO - Person Schema Markup](https://aioseo.com/seo-glossary/person-schema-markup/)
- [CloudFix - CloudFront Compression](https://cloudfix.com/blog/cloudfront-compression/)

### AWS Community Resources (MEDIUM confidence)
- [AWS re:Post - Cache Invalidations](https://repost.aws/questions/QUepJkToU0TbSTLIm6pLKzOw/cache-invalidations-with-cloudfront-and-s3)
- [AWS re:Post - S3 Static Website 503 Errors](https://repost.aws/questions/QU5KtVWPsfRQikpRW4xnCgpg/cloudfront-with-s3-bucket-static-page-consistent-503-limitexceeded-errors)
