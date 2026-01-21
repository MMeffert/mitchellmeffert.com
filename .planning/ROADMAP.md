# Roadmap: mitchellmeffert.com

## Milestones

- [x] **v1.0 Portfolio Modernization** - Phases 1-8 (shipped 2026-01-20)
- [x] **v1.1 Accessibility & Security Hardening** - Phases 9-12 (shipped 2026-01-21)
- [ ] **v1.2 Performance & SEO** - Phases 13-17 (in progress)

## Phases

<details>
<summary>v1.0 Portfolio Modernization (Phases 1-8) - SHIPPED 2026-01-20</summary>

See `.planning/milestones/v1.0-ROADMAP.md` for complete details.

**Summary:**
- Phase 1: Bootstrap Migration (BOOT-01)
- Phase 2: Carousel Migration (JS-01)
- Phase 3: Lightbox Migration (JS-01)
- Phase 4: Filter Migration (JS-01)
- Phase 5: jQuery Removal (JS-01)
- Phase 6: Content Update (CONT-01, CONT-02, CONT-03)
- Phase 7: SEO and Cleanup (SEO-01, TECH-01)
- Phase 8: Security Hardening (SEC-01)

**Key accomplishments:**
- Bootstrap 4 to 5.3.8 migration
- jQuery completely removed (~241KB bundle reduction)
- Modern vanilla JS plugins: Splide.js, PhotoSwipe, Isotope

</details>

<details>
<summary>v1.1 Accessibility & Security Hardening (Phases 9-12) - SHIPPED 2026-01-21</summary>

See `.planning/milestones/v1.1-ROADMAP.md` for complete details.

**Summary:**
- Phase 9: CSS Foundation (CSS-01, CSS-02)
- Phase 10: Accessibility Core (A11Y-01, A11Y-02)
- Phase 11: Semantic HTML (A11Y-03, A11Y-04, A11Y-05)
- Phase 12: Security (SEC-02)

**Key accomplishments:**
- CSS custom properties system (32 semantic color variables)
- WCAG accessibility compliance (keyboard focus, color contrast, aria-labels)
- Semantic HTML landmarks and heading hierarchy
- SRI hashes on 7 CDN resources

</details>

### v1.2 Performance & SEO (In Progress)

**Milestone Goal:** Achieve green Core Web Vitals, implement structured data for knowledge panel potential, and add security headers via CloudFront.

- [x] **Phase 13: Quick Wins** - robots.txt, sitemap.xml, preconnect hints, image dimensions
- [x] **Phase 14: Structured Data** - JSON-LD schemas for Person, ProfilePage, WebSite
- [x] **Phase 15: Core Web Vitals** - LCP, INP, CLS optimization
- [x] **Phase 16: Image Optimization** - WebP conversion with fallbacks
- [x] **Phase 17: Infrastructure** - CloudFront Response Headers Policy

## Phase Details

### Phase 13: Quick Wins
**Goal**: Establish technical SEO foundation and eliminate layout shift from images
**Depends on**: Phase 12
**Requirements**: TECH-01, TECH-02, TECH-03, CWV-04
**Success Criteria** (what must be TRUE):
  1. robots.txt exists at site root and references sitemap.xml
  2. sitemap.xml exists with canonical URL and lastmod date
  3. Preconnect hints exist for google.com and gstatic.com (reCAPTCHA)
  4. All images have explicit width and height attributes
**Plans**: TBD

Plans:
- [ ] 13-01: TBD

### Phase 14: Structured Data
**Goal**: Enable rich search results and AI citation through JSON-LD schemas
**Depends on**: Nothing (can run parallel to Phase 13)
**Requirements**: STRUCT-01, STRUCT-02, STRUCT-03, STRUCT-04
**Success Criteria** (what must be TRUE):
  1. Person schema contains name, jobTitle, url, image, and sameAs with social links
  2. ProfilePage schema wraps Person entity correctly
  3. WebSite schema contains name, url, and description
  4. All structured data validates in Google Rich Results Test with no errors
**Plans**: TBD

Plans:
- [ ] 14-01: TBD

### Phase 15: Core Web Vitals
**Goal**: Achieve green Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1)
**Depends on**: Phase 13 (image dimensions must be set first)
**Requirements**: CWV-01, CWV-02, CWV-03, CWV-05, CWV-06
**Success Criteria** (what must be TRUE):
  1. PageSpeed Insights shows LCP < 2.5 seconds on mobile
  2. PageSpeed Insights shows INP < 200 milliseconds
  3. PageSpeed Insights shows CLS < 0.1
  4. Hero/LCP image has fetchpriority="high" and preload link in head
  5. reCAPTCHA script does not block main thread (deferred or lazy-loaded)
**Plans**: TBD

Plans:
- [ ] 15-01: TBD

### Phase 16: Image Optimization
**Goal**: Reduce image payload through WebP format while maintaining compatibility
**Depends on**: Phase 15 (baseline CWV established first)
**Requirements**: IMG-01, IMG-02, IMG-03
**Success Criteria** (what must be TRUE):
  1. All JPEG/PNG images have WebP versions in assets directory
  2. HTML uses picture elements with WebP source and JPEG/PNG fallback
  3. WebP images retain same dimensions as originals (no sizing changes)
**Plans**: TBD

Plans:
- [ ] 16-01: TBD

### Phase 17: Infrastructure
**Goal**: Add security headers via CloudFront without manual configuration
**Depends on**: Phase 16 (all HTML/asset changes complete before CDK deploy)
**Requirements**: TECH-04, TECH-05
**Success Criteria** (what must be TRUE):
  1. CDK stack includes ResponseHeadersPolicy attached to distribution
  2. Response includes Strict-Transport-Security header (HSTS)
  3. Response includes X-Content-Type-Options: nosniff
  4. Response includes X-Frame-Options: DENY or SAMEORIGIN
**Plans**: TBD

Plans:
- [ ] 17-01: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1-8 | v1.0 | 12/12 | Complete | 2026-01-20 |
| 9-12 | v1.1 | 7/7 | Complete | 2026-01-21 |
| 13. Quick Wins | v1.2 | 1/1 | Complete | 2026-01-21 |
| 14. Structured Data | v1.2 | 1/1 | Complete | 2026-01-21 |
| 15. Core Web Vitals | v1.2 | 1/1 | Complete | 2026-01-21 |
| 16. Image Optimization | v1.2 | 1/1 | Complete | 2026-01-21 |
| 17. Infrastructure | v1.2 | 1/1 | Complete | 2026-01-21 |

---
*Last updated: 2026-01-21 — v1.2 all phases complete*
