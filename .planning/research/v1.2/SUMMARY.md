# Project Research Summary

**Project:** mitchellmeffert.com v1.2 Performance & SEO
**Domain:** Static Portfolio Performance Optimization & Technical SEO
**Researched:** 2026-01-21
**Confidence:** HIGH

## Executive Summary

This milestone focuses on proactive performance and SEO optimization for a static portfolio site on CloudFront/S3. The site already has solid foundations (CDN delivery, responsive design, semantic HTML), but lacks modern image formats, structured data, and technical SEO files that differentiate top-performing portfolios in 2026.

**Key insight:** No new frameworks or build tools needed. The existing vanilla JS + Bootstrap 5 stack is well-suited for optimization. Focus on manual improvements: image optimization, JSON-LD structured data, and CloudFront configuration refinements.

**Primary opportunities:**
1. **Core Web Vitals** - LCP likely passing due to CDN, but CLS and INP unknown; image dimensions and third-party script loading need audit
2. **Structured data** - Person + ProfilePage JSON-LD enables knowledge panel potential and AI citation
3. **Technical SEO files** - robots.txt and sitemap.xml are missing quick wins

**Estimated impact:** Achieving green Core Web Vitals (all 3 passing) positions the site in the top 36% of websites. Structured data improves AI visibility as AI Overviews have reduced organic CTR by up to 55%.

## Key Findings

### Recommended Stack Additions

| Addition | Purpose | Complexity |
|----------|---------|------------|
| WebP images | 25-34% smaller than JPEG, 97% browser support | Medium |
| JSON-LD structured data | Person + ProfilePage + WebSite schemas | Low |
| robots.txt + sitemap.xml | Technical SEO fundamentals | Low |
| CloudFront Response Headers Policy | Security + SEO headers | Low |
| Preconnect hints | Save 100-300ms per third-party origin | Low |

**Not recommended:**
- Build systems (Webpack/Vite) - overkill for single-page site
- Third-party RUM services - adds JS weight, Search Console suffices
- Image CDN services - CloudFront already serves globally
- Critical CSS extraction - high effort, diminishing returns for fast static site

### Expected Feature Coverage

**Table Stakes (must have):**
- LCP < 2.5s, INP < 200ms, CLS < 0.1 (Core Web Vitals thresholds)
- Person schema with sameAs social links
- XML sitemap and robots.txt
- Explicit image dimensions (width/height attributes)

**Differentiators:**
- LCP < 1.5s (top 10% performance)
- WebP/AVIF images with fallbacks
- ProfilePage schema wrapping Person schema
- Preconnect hints for reCAPTCHA and CDN origins

### Architecture Approach

The existing CloudFront/S3 architecture requires minimal changes:

1. **Static files added:** robots.txt, sitemap.xml
2. **HTML changes:** JSON-LD in `<head>`, preconnect hints, image dimensions
3. **Image optimization:** WebP conversion (manual via cwebp/Squoosh)
4. **CDK addition:** ResponseHeadersPolicy for security/SEO headers
5. **Deploy refinement:** Differentiated caching by content type

**No breaking changes** - all additions are backward compatible.

### Critical Pitfalls

| # | Pitfall | Risk | Prevention |
|---|---------|------|------------|
| 1 | Lazy-loading LCP image | HIGH | Remove `loading="lazy"` from hero, add `fetchpriority="high"` |
| 2 | Preloader blocking LCP | HIGH | Audit preloader timing, consider removal |
| 3 | Font-display causing CLS | MEDIUM | Use `font-display: optional` or metric overrides |
| 4 | reCAPTCHA blocking INP | MEDIUM | Move script to defer, or lazy-load on form interaction |
| 5 | JSON-LD syntax errors | MEDIUM | Always validate with Rich Results Test before deploy |
| 6 | CloudFront cache stale | MEDIUM | Invalidate after adding preload hints |

## Implications for Roadmap

### Suggested Phase Structure

**Phase 13: Quick Wins (No CDK)**
- Add robots.txt and sitemap.xml
- Add Person + WebSite JSON-LD to index.html
- Add preconnect hints for third-party origins
- Verify/add explicit dimensions to all images
- Delivers: TECH-01, STRUCT-01, STRUCT-02

**Phase 14: Core Web Vitals**
- Run PageSpeed Insights baseline
- Identify and optimize LCP element
- Audit/fix CLS issues (image dimensions, font loading)
- Audit/fix INP issues (defer reCAPTCHA)
- Delivers: CWV-01, CWV-02, CWV-03

**Phase 15: Image Optimization**
- Convert images to WebP format
- Update HTML with `<picture>` elements and fallbacks
- Add responsive srcset for key images (optional)
- Delivers: CWV-04

**Phase 16: Infrastructure**
- Add ResponseHeadersPolicy to CDK stack
- Update deploy workflow caching strategy
- Deploy and verify headers
- Delivers: TECH-02

### Phase Ordering Rationale

1. **Quick wins first** - Zero infrastructure risk, immediate SEO benefit
2. **CWV second** - Requires baseline measurement before other changes
3. **Image optimization third** - Highest effort, requires HTML changes
4. **Infrastructure last** - CDK deployment risk isolated at end

### Research Flags

**Phases with standard patterns (skip research-phase):**
- All phases - research complete, no additional domain research needed

**Implementation notes:**
- Phase 14 should run PageSpeed Insights BEFORE any changes to establish baseline
- Phase 16 CDK changes are additive and low-risk

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Core Web Vitals | HIGH | Google official docs, web.dev, MDN all verified |
| Structured Data | HIGH | schema.org specs, Google guidelines confirmed |
| Technical SEO | HIGH | Standard patterns, well-documented |
| CloudFront Integration | HIGH | AWS CDK official documentation |
| Image Optimization | HIGH | Multiple sources agree on WebP as primary format |

**Overall confidence:** HIGH

### Gaps Addressed

- Current LCP element unknown → Phase 14 will identify via PageSpeed audit
- Current CLS/INP scores unknown → Phase 14 establishes baseline
- reCAPTCHA impact unknown → Phase 14 will audit

## Sources

### Primary (HIGH confidence)
- [Google Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [web.dev Performance](https://web.dev/learn/performance/)
- [schema.org Person](https://schema.org/Person)
- [AWS CloudFront Response Headers](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/understanding-response-headers-policies.html)
- [AWS CDK ResponseHeadersPolicy](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.ResponseHeadersPolicy.html)

### Secondary (MEDIUM confidence)
- [Elementor AVIF vs WebP 2026](https://elementor.com/blog/webp-vs-avif/)
- [NitroPack Resource Hints](https://nitropack.io/blog/post/resource-hints-performance-optimization)
- [DebugBear Web Font CLS](https://www.debugbear.com/blog/web-font-layout-shift)
- [Search Engine Land robots.txt SEO 2026](https://searchengineland.com/robots-txt-seo-453779)

---
*Research completed: 2026-01-21*
*Ready for roadmap: yes*
