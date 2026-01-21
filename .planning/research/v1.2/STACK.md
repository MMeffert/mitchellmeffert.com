# Stack Research: Performance & SEO

**Project:** mitchellmeffert.com
**Researched:** 2026-01-21
**Overall Confidence:** HIGH

## Executive Summary

For a static portfolio site on CloudFront/S3, performance and SEO optimization requires no new frameworks or build tools. The existing stack is well-suited for Core Web Vitals optimization. Focus on: (1) manual HTML/CSS optimizations for LCP/CLS/INP, (2) JSON-LD structured data for Person and ProfilePage schemas, and (3) standard technical SEO files (robots.txt, sitemap.xml). The CloudFront CDN already provides excellent edge caching - this milestone is about tuning the content it serves, not changing infrastructure.

## Recommended Additions

### Core Web Vitals Measurement

**PageSpeed Insights + Search Console** (FREE, No Install)
- Use PageSpeed Insights for lab + field data during development
- Search Console Core Web Vitals report for ongoing monitoring
- These are authoritative Google tools that show actual ranking impact

| Tool | Purpose | When to Use |
|------|---------|-------------|
| [PageSpeed Insights](https://pagespeed.web.dev/) | Lab + field data, diagnostics | Development, before/after changes |
| [Google Search Console](https://search.google.com/search-console) | Real user data (CrUX), indexing | Ongoing monitoring, sitemap submission |
| Chrome DevTools Lighthouse | Local testing, detailed audits | Development iteration |

**Rationale:** These free tools provide all necessary measurement. Do NOT add third-party RUM scripts (like SpeedCurve, DebugBear) - they add JavaScript weight that hurts the very metrics you are trying to improve. For a personal portfolio with modest traffic, Search Console field data is sufficient.

### Core Web Vitals Optimization Techniques

**LCP (Largest Contentful Paint) - Target: < 2.5s**

Current LCP element is likely the hero section background or the typed text. Optimizations:

| Technique | Implementation | Impact |
|-----------|----------------|--------|
| Preload hero image | `<link rel="preload" as="image" href="images/..." fetchpriority="high">` | HIGH |
| Inline critical CSS | Move above-fold styles to `<style>` in `<head>` | MEDIUM |
| Defer non-critical CSS | Split CSS, load below-fold styles with `media="print" onload="this.media='all'"` | MEDIUM |
| Remove render-blocking JS | Move reCAPTCHA to contact section only, not global | HIGH |
| Optimize images | Convert to WebP with fallbacks | HIGH |

**INP (Interaction to Next Paint) - Target: < 200ms**

The site uses minimal JavaScript (Splide, Typed.js, Bootstrap). Key considerations:

| Technique | Implementation | Impact |
|-----------|----------------|--------|
| Defer third-party scripts | Add `defer` to Splide, Typed.js | MEDIUM |
| Minimize main thread work | Keep JS interactions simple | LOW (already good) |
| Avoid layout thrashing | Batch DOM reads/writes | LOW (minimal JS) |

**CLS (Cumulative Layout Shift) - Target: < 0.1**

| Technique | Implementation | Impact |
|-----------|----------------|--------|
| Explicit image dimensions | Add `width` and `height` attributes to all `<img>` tags | HIGH |
| Font display swap | Add `font-display: swap` to font loading | MEDIUM |
| Reserve space for dynamic content | CSS `min-height` for testimonial carousel | MEDIUM |

### Image Optimization

**Recommended Format Strategy:**

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="..." width="..." height="..." loading="lazy">
</picture>
```

| Format | Use Case | Browser Support | Compression |
|--------|----------|-----------------|-------------|
| AVIF | Hero images, large photos | ~89% | Best (50% smaller than JPEG) |
| WebP | All images | ~97% | Good (25-34% smaller than JPEG) |
| JPEG/PNG | Fallback only | 100% | Baseline |

**Conversion Tools (No Build System Required):**
- [Squoosh](https://squoosh.app/) - Google's free image optimizer, manual conversion
- `cwebp` CLI - Batch WebP conversion: `cwebp -q 80 input.jpg -o output.webp`
- `avifenc` CLI - Batch AVIF conversion

**Installation (macOS):**
```bash
# WebP tools
brew install webp

# AVIF tools
brew install libavif

# Batch convert all JPG to WebP
for f in images/**/*.jpg; do cwebp -q 80 "$f" -o "${f%.jpg}.webp"; done
```

**Rationale:** For a static site without a build system, manual conversion with Squoosh is appropriate. Do NOT add a build system (Webpack, Vite, etc.) just for image optimization - the complexity is not justified for a single-page portfolio.

### Structured Data (JSON-LD)

**Required Schemas for Portfolio Site:**

1. **Person** - Professional profile information
2. **ProfilePage** - The page containing the Person (helps with author knowledge panels)
3. **WebSite** - Site-level information with sitelinks searchbox potential

**Person + ProfilePage Schema (Recommended):**

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "name": "Mitchell Meffert",
    "jobTitle": "AWS Cloud Architect & Web Developer",
    "url": "https://mitchellmeffert.com/",
    "image": "https://mitchellmeffert.com/images/profile.jpg",
    "description": "AWS-certified cloud architect and web developer with 19+ years experience.",
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "University of Wisconsin - Whitewater"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Roundhouse Marketing"
    },
    "sameAs": [
      "https://www.linkedin.com/in/mitchellmeffert",
      "https://github.com/MMeffert",
      "https://stackoverflow.com/users/6115073/mitchell-meffert",
      "https://www.facebook.com/mitchell.meffert",
      "https://www.instagram.com/mitchellmeffert"
    ],
    "knowsAbout": ["AWS", "Cloud Architecture", "Web Development", "Python", "Claude Code"]
  }
}
```

**WebSite Schema:**

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Mitchell Meffert",
  "url": "https://mitchellmeffert.com/",
  "description": "Personal portfolio of Mitchell Meffert - AWS Cloud Architect and Web Developer"
}
```

**Placement:** Both schemas go in `<script type="application/ld+json">` tags in the `<head>` section.

**Validation Tools:**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

### Technical SEO Files

**robots.txt:**

```txt
User-agent: *
Allow: /

Sitemap: https://mitchellmeffert.com/sitemap.xml
```

Simple and permissive. No need to block anything on a single-page portfolio. The sitemap declaration helps search engines find it without Search Console submission.

**sitemap.xml:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mitchellmeffert.com/</loc>
    <lastmod>2026-01-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

For a single-page site, the sitemap is minimal but still valuable for: (1) explicit canonical declaration, (2) lastmod signals freshness, (3) Search Console tracking.

## Integration Notes

### CloudFront Cache Configuration

The existing CloudFront distribution should use these cache behaviors:

| Path Pattern | Cache Policy | TTL | Notes |
|--------------|--------------|-----|-------|
| `*.html` | Custom | 5 min | Short TTL, frequent updates |
| `*.css`, `*.js` | CachingOptimized | 1 year | Version via query string `?v=` |
| `images/*` | CachingOptimized | 1 year | Immutable after upload |
| `robots.txt` | Custom | 5 min | Crawlers check frequently |
| `sitemap.xml` | Custom | 5 min | Update with content changes |

**Cache-Control Headers (set via S3 metadata or deploy script):**
- Static assets: `Cache-Control: public, max-age=31536000, immutable`
- HTML: `Cache-Control: public, max-age=300, must-revalidate`
- robots.txt/sitemap.xml: `Cache-Control: public, max-age=300`

**Compression:**
CloudFront automatically compresses with CachingOptimized policy. Brotli and gzip are enabled by default.

### Content Security Policy Considerations

Current third-party scripts that need CSP allowlist (if implementing CSP):
- `https://www.google.com/recaptcha/` (reCAPTCHA)
- `https://cdn.jsdelivr.net/` (Splide, Typed.js)

No changes needed if CSP is not currently implemented. CSP is optional for a personal portfolio.

### Response Headers Policy (CDK)

Add security and SEO headers via CloudFront:

| Header | Value | Purpose |
|--------|-------|---------|
| X-Content-Type-Options | nosniff | Prevents MIME sniffing |
| X-Frame-Options | DENY | Prevents clickjacking |
| Referrer-Policy | strict-origin-when-cross-origin | Privacy protection |
| Strict-Transport-Security | max-age=31536000; includeSubdomains; preload | HSTS |
| X-Robots-Tag | index, follow | SEO indexing directive |

## Not Recommended

### Avoid These for a Static Portfolio Site

| Technology | Why Avoid |
|------------|-----------|
| **Build systems** (Webpack, Vite, Parcel) | Overkill for single-page site. Manual optimization is sufficient. Adds maintenance burden. |
| **Third-party RUM** (SpeedCurve, DebugBear, New Relic) | Adds JavaScript weight. Search Console field data is free and authoritative. |
| **Framework migration** (Next.js, Astro, Gatsby) | Massive over-engineering. The site works well as static HTML. |
| **Service Worker / PWA** | Complexity without benefit. CloudFront provides edge caching. Users won't "install" a portfolio. |
| **Critical CSS extractors** (Critical, Penthouse) | Build tool dependency. Manual inline of ~50 lines of critical CSS is simpler. |
| **Image CDN services** (Cloudinary, imgix, ImageKit) | Additional cost and complexity. Manual WebP/AVIF conversion is one-time work. CloudFront already serves images globally. |
| **AMP** | Deprecated approach. Google no longer prioritizes AMP in rankings. |
| **Prerender.io / Rendertron** | For SPAs with JS rendering. This site is already static HTML. |
| **llms.txt** | No SEO benefit. Only relevant for AI training permissions, not search ranking. |
| **Font subsetting services** | Complexity for minimal gain. Site uses system fonts primarily. |

### Why Not Over-Optimize

The site is a personal portfolio, not an e-commerce platform. Goals:
- Good enough Core Web Vitals to pass Google's threshold (not perfect 100 scores)
- Basic structured data for knowledge panel potential
- Standard technical SEO hygiene

Perfect Lighthouse scores require trade-offs (removing useful libraries, aggressive code splitting) that hurt developer experience more than they help SEO for a low-traffic portfolio.

## Implementation Checklist

### Phase 1: Measurement Baseline
- [ ] Run PageSpeed Insights on current site
- [ ] Document current LCP, INP, CLS scores
- [ ] Identify LCP element using DevTools

### Phase 2: Quick Wins (HTML/CSS changes only)
- [ ] Add `width` and `height` to all images (CLS fix)
- [ ] Add `loading="lazy"` to below-fold images
- [ ] Add `fetchpriority="high"` to hero/LCP image
- [ ] Add `defer` attribute to external scripts

### Phase 3: Image Optimization
- [ ] Convert images to WebP (primary)
- [ ] Optionally convert hero image to AVIF
- [ ] Implement `<picture>` elements with fallbacks
- [ ] Verify dimensions preserved after conversion

### Phase 4: Structured Data
- [ ] Add Person + ProfilePage JSON-LD to `<head>`
- [ ] Add WebSite JSON-LD to `<head>`
- [ ] Validate with Rich Results Test

### Phase 5: Technical SEO Files
- [ ] Create robots.txt
- [ ] Create sitemap.xml
- [ ] Deploy and verify accessibility
- [ ] Submit sitemap to Search Console

### Phase 6: CDK Updates
- [ ] Add ResponseHeadersPolicy to CloudFront
- [ ] Update deploy workflow caching strategy
- [ ] Deploy and verify headers with curl

### Phase 7: Validation
- [ ] Re-run PageSpeed Insights
- [ ] Compare before/after scores
- [ ] Monitor Search Console Core Web Vitals over 28 days

## Sources

### Core Web Vitals
- [Google: Understanding Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [web.dev: Most Effective Ways to Improve Core Web Vitals](https://web.dev/articles/top-cwv)
- [PageSpeed Insights Documentation](https://developers.google.com/speed/docs/insights/v5/about)
- [Sky SEO Digital: Core Web Vitals Optimization Guide 2026](https://skyseodigital.com/core-web-vitals-optimization-complete-guide-for-2026/)
- [NitroPack: Most Important Core Web Vitals Metrics 2026](https://nitropack.io/blog/most-important-core-web-vitals-metrics/)

### Structured Data
- [Google: Introduction to Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Schema.org: Person Type](https://schema.org/Person)
- [Schema.org: ProfilePage Type](https://schema.org/ProfilePage)
- [jsonld.com: Person Example](https://jsonld.com/person/)
- [Aubrey Yung: ProfilePage Schema Markup Guide](https://aubreyyung.com/profilepage-schema/)
- [AIOSEO: Person Schema Markup](https://aioseo.com/seo-glossary/person-schema-markup/)

### Technical SEO
- [Google: Create and Submit robots.txt](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt)
- [Search Engine Land: Robots.txt and SEO 2026](https://searchengineland.com/robots-txt-seo-453779)
- [GK Web Agency: Robots.txt & SEO 2026 Guide](https://www.gkwebagency.com.au/robots-txt-seo-in-2026-the-complete-guide/)

### Image Optimization
- [The CSS Agency: Best Web Image Format for 2026](https://www.thecssagency.com/blog/best-web-image-format)
- [Elementor: AVIF vs WebP Comparison 2026](https://elementor.com/blog/webp-vs-avif/)
- [web.dev: Image Performance](https://web.dev/learn/performance/image-performance)
- [Request Metrics: High Performance Images Guide 2026](https://requestmetrics.com/web-performance/high-performance-images/)

### CloudFront/AWS
- [AWS: Optimize SEO with Amazon CloudFront](https://aws.amazon.com/blogs/networking-and-content-delivery/optimize-seo-with-amazon-cloudfront/)
- [AWS: Managed Cache Policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html)
- [pump.co: CloudFront + S3 for SEO](https://www.pump.co/blog/aws-cloudfront-s3)
- [AWS: CloudFront Response Headers Policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/understanding-response-headers-policies.html)
