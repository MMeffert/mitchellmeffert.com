# Requirements: mitchellmeffert.com v1.2

**Defined:** 2026-01-21
**Core Value:** Present Mitchell's professional capabilities accurately and make it easy for potential clients/employers to understand his expertise and get in touch.

## v1.2 Requirements

Requirements for Performance & SEO milestone. Each maps to roadmap phases.

### Core Web Vitals

- [ ] **CWV-01**: Site achieves LCP < 2.5 seconds (largest contentful paint)
- [ ] **CWV-02**: Site achieves INP < 200 milliseconds (interaction to next paint)
- [ ] **CWV-03**: Site achieves CLS < 0.1 (cumulative layout shift)
- [ ] **CWV-04**: All images have explicit width and height attributes
- [ ] **CWV-05**: Hero/LCP image has fetchpriority="high" and preload hint
- [ ] **CWV-06**: Third-party scripts (reCAPTCHA) do not block main thread

### Image Optimization

- [ ] **IMG-01**: All JPEG/PNG images converted to WebP format
- [ ] **IMG-02**: HTML uses `<picture>` elements with JPEG/PNG fallbacks
- [ ] **IMG-03**: Images retain original dimensions after conversion

### Structured Data

- [ ] **STRUCT-01**: Person JSON-LD schema with name, jobTitle, url, image, sameAs
- [ ] **STRUCT-02**: ProfilePage JSON-LD schema wrapping Person entity
- [ ] **STRUCT-03**: WebSite JSON-LD schema with name, url, description
- [ ] **STRUCT-04**: Structured data validates in Google Rich Results Test

### Technical SEO

- [ ] **TECH-01**: robots.txt file at site root with sitemap reference
- [ ] **TECH-02**: sitemap.xml file with canonical URL and lastmod
- [ ] **TECH-03**: Preconnect hints for Google reCAPTCHA and CDN origins
- [ ] **TECH-04**: CloudFront Response Headers Policy with security headers
- [ ] **TECH-05**: HSTS, X-Content-Type-Options, X-Frame-Options headers present

## Future Requirements

Deferred to future milestones. Tracked but not in current roadmap.

### Performance Enhancements

- **PERF-01**: Critical CSS inlining for above-fold content
- **PERF-02**: AVIF image format for maximum compression
- **PERF-03**: Responsive images with srcset for multiple viewport sizes

### Advanced SEO

- **SEO-01**: Credential schema for AWS certifications
- **SEO-02**: Early Hints (HTTP 103) via CloudFront

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Build system (Webpack/Vite) | Over-engineering for single-page static site |
| Third-party RUM (SpeedCurve, DebugBear) | Adds JS weight, Search Console suffices |
| Image CDN services (Cloudinary, imgix) | CloudFront already serves globally, one-time conversion suffices |
| Service Worker / PWA | Complexity without benefit for portfolio site |
| Perfect 100 Lighthouse score | Requires trade-offs that hurt DX more than help SEO |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CWV-01 | Phase 15 | Pending |
| CWV-02 | Phase 15 | Pending |
| CWV-03 | Phase 15 | Pending |
| CWV-04 | Phase 13 | Pending |
| CWV-05 | Phase 15 | Pending |
| CWV-06 | Phase 15 | Pending |
| IMG-01 | Phase 16 | Pending |
| IMG-02 | Phase 16 | Pending |
| IMG-03 | Phase 16 | Pending |
| STRUCT-01 | Phase 14 | Pending |
| STRUCT-02 | Phase 14 | Pending |
| STRUCT-03 | Phase 14 | Pending |
| STRUCT-04 | Phase 14 | Pending |
| TECH-01 | Phase 13 | Pending |
| TECH-02 | Phase 13 | Pending |
| TECH-03 | Phase 13 | Pending |
| TECH-04 | Phase 17 | Pending |
| TECH-05 | Phase 17 | Pending |

**Coverage:**
- v1.2 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0

---
*Requirements defined: 2026-01-21*
*Last updated: 2026-01-21 after roadmap creation*
