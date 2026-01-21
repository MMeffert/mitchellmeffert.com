# Roadmap: mitchellmeffert.com

## Milestones

- [x] **v1.0 Portfolio Modernization** - Phases 1-8 (shipped 2026-01-20)
- [ ] **v1.1 Accessibility & Security Hardening** - Phases 9-12 (in progress)

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
- IAM least-privilege permissions

</details>

### v1.1 Accessibility & Security Hardening (In Progress)

**Milestone Goal:** Address accessibility violations, security gaps, and CSS maintainability issues discovered during full site review.

#### Phase 9: CSS Foundation

**Goal**: Establish CSS custom properties and responsive breakpoints as foundation for accessibility fixes
**Depends on**: Phase 8 (v1.0 complete)
**Requirements**: CSS-01, CSS-02
**Success Criteria** (what must be TRUE):
  1. All color values in style.css reference CSS custom properties (no hardcoded hex values)
  2. Site layout adapts appropriately at tablet (992px), large desktop (1200px), and extra-large (1400px) breakpoints
  3. Custom properties use semantic names (--color-primary, --color-text-muted, etc.) not generic names
**Plans**: 1 plan

Plans:
- [x] 09-01-PLAN.md -- Extract colors to CSS custom properties and add responsive breakpoints

#### Phase 10: Accessibility Core

**Goal**: Users can navigate site with keyboard and all text meets WCAG contrast requirements
**Depends on**: Phase 9 (custom properties available for contrast fixes)
**Requirements**: A11Y-01, A11Y-02
**Success Criteria** (what must be TRUE):
  1. User can tab through all interactive elements (links, buttons, form fields) with visible focus outline
  2. Focus indicator is clearly visible against all background colors
  3. All body text meets WCAG 4.5:1 contrast ratio against its background
  4. All interactive element text (links, buttons) meets WCAG 4.5:1 contrast ratio
  5. No CSS rules suppress or hide focus outlines (outline: none, outline: 0)
**Plans**: 2 plans

Plans:
- [ ] 10-01-PLAN.md -- Restore keyboard focus styles (A11Y-01)
- [ ] 10-02-PLAN.md -- Fix color contrast to meet WCAG 4.5:1 (A11Y-02)

#### Phase 11: Semantic HTML

**Goal**: Screen reader users can navigate page structure and understand all interactive elements
**Depends on**: Phase 10 (core accessibility complete)
**Requirements**: A11Y-03, A11Y-04, A11Y-05
**Success Criteria** (what must be TRUE):
  1. All icon-only links have aria-label attributes describing their purpose
  2. Page has exactly one h1 element identifying the page purpose
  3. Page has semantic landmark elements: main, nav, footer
  4. Screen reader announces page regions correctly (navigation, main content, footer)
  5. Heading hierarchy is logical (h1 > h2 > h3, no skipped levels)
**Plans**: TBD

Plans:
- [ ] 11-01: Aria-labels and heading hierarchy
- [ ] 11-02: Semantic landmarks

#### Phase 12: Security

**Goal**: CDN resources protected against tampering via Subresource Integrity
**Depends on**: Nothing (independent of accessibility work)
**Requirements**: SEC-02
**Success Criteria** (what must be TRUE):
  1. All CDN-loaded JavaScript files have integrity and crossorigin attributes
  2. All CDN-loaded CSS files have integrity and crossorigin attributes
  3. Site loads without console errors after SRI implementation
  4. Browser blocks resource loading if integrity check fails (verified in dev tools)
**Plans**: TBD

Plans:
- [ ] 12-01: SRI hashes for CDN resources

## Progress

**Execution Order:**
Phases execute in numeric order: 9 -> 10 -> 11 -> 12

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1-8 | v1.0 | 12/12 | Complete | 2026-01-20 |
| 9. CSS Foundation | v1.1 | 1/1 | Complete | 2026-01-20 |
| 10. Accessibility Core | v1.1 | 0/2 | Not started | - |
| 11. Semantic HTML | v1.1 | 0/2 | Not started | - |
| 12. Security | v1.1 | 0/1 | Not started | - |

---
*Created: 2026-01-20 for v1.1 milestone*
