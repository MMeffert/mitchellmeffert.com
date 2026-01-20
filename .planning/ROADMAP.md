# Roadmap: mitchellmeffert.com Portfolio Modernization

## Overview

This roadmap transforms a 2018 Bootstrap 4 + jQuery portfolio site into a modern Bootstrap 5 + vanilla JavaScript site with updated professional content. The migration follows a carefully sequenced approach: Bootstrap upgrade first (unlocks everything), then plugin replacement (removes jQuery dependencies), then jQuery removal (after all dependencies gone), then content updates, cleanup, and optional design enhancements. This order prevents "big bang" migrations and ensures each phase can be verified independently.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3...): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Bootstrap Migration** - Upgrade Bootstrap 4 to 5.3.8 with all class and attribute changes
- [x] **Phase 2: Carousel Migration** - Replace Owl Carousel with Splide.js
- [x] **Phase 3: Lightbox Migration** - Replace Magnific Popup with PhotoSwipe
- [ ] **Phase 4: Filter Migration** - Modernize Isotope usage with vanilla JS syntax
- [ ] **Phase 5: jQuery Removal** - Convert contact form and custom.js to vanilla JS, remove jQuery
- [ ] **Phase 6: Content Update** - Modernize About, skills, stats, GitHub link, resume download
- [ ] **Phase 7: SEO and Cleanup** - Refresh meta tags, remove unused files, clean HTML
- [ ] **Phase 8: Security Hardening** - Scope IAM wildcards, review Lambda permissions
- [ ] **Phase 9: Design Enhancement** - Dark/light mode toggle, accessibility (OPTIONAL/DEFERRED)

## Phase Details

### Phase 1: Bootstrap Migration
**Goal**: Site renders correctly with Bootstrap 5.3.8, all CSS classes updated
**Depends on**: Nothing (first phase)
**Requirements**: BOOT-01 (Update Bootstrap 4 to Bootstrap 5)
**Success Criteria** (what must be TRUE):
  1. Bootstrap 5.3.8 CSS and JS load without console errors
  2. ~~Navigation hamburger menu opens/closes on mobile~~ (NOT APPLICABLE - no hamburger in design)
  3. All sections display with correct spacing and alignment (ml-* to ms-*, etc.)
  4. ~~No deprecated `data-toggle` attributes remain~~ (NOT APPLICABLE - site uses no Bootstrap data attributes)
  5. Link underlines render correctly (Bootstrap 5 text-decoration change addressed)
**Plans**: 1 plan

Plans:
- [x] 01-01-PLAN.md - Bootstrap CSS/JS upgrade and class migration

### Phase 2: Carousel Migration
**Goal**: Testimonial carousel works with Splide.js instead of Owl Carousel
**Depends on**: Phase 1
**Requirements**: JS-01 (Update/replace dated JavaScript dependencies - carousel component)
**Success Criteria** (what must be TRUE):
  1. Testimonial carousel auto-rotates through items
  2. Carousel responds to swipe gestures on mobile
  3. Carousel has accessible keyboard navigation (arrow keys)
  4. Owl Carousel JS/CSS files removed from project
**Plans**: 1 plan

Plans:
- [x] 02-01-PLAN.md - Splide.js integration and Owl Carousel removal

### Phase 3: Lightbox Migration
**Goal**: Portfolio images open in PhotoSwipe lightbox instead of Magnific Popup
**Depends on**: Phase 1
**Requirements**: JS-01 (Update/replace dated JavaScript dependencies - lightbox component)
**Success Criteria** (what must be TRUE):
  1. Clicking portfolio image opens full-size in lightbox overlay
  2. Lightbox supports pinch-to-zoom on mobile
  3. Lightbox navigates between images with arrow keys
  4. Magnific Popup JS/CSS files removed from project
**Plans**: 1 plan

Plans:
- [x] 03-01-PLAN.md - PhotoSwipe integration and Magnific Popup removal

### Phase 4: Filter Migration
**Goal**: Portfolio filtering works with vanilla JS Isotope syntax (no jQuery dependency)
**Depends on**: Phase 1
**Requirements**: JS-01 (Update/replace dated JavaScript dependencies - filter component)
**Success Criteria** (what must be TRUE):
  1. Portfolio filter buttons highlight selected category
  2. Clicking filter shows only matching portfolio items with animation
  3. "All" filter shows all portfolio items
  4. No jQuery selectors in Isotope initialization code
**Plans**: 1 plan

Plans:
- [ ] 04-01-PLAN.md - Isotope vanilla JS conversion

### Phase 5: jQuery Removal
**Goal**: Site runs without jQuery, contact form uses native fetch(), bundle size reduced
**Depends on**: Phase 2, Phase 3, Phase 4
**Requirements**: JS-01 (Update/replace dated JavaScript dependencies - jQuery removal)
**Success Criteria** (what must be TRUE):
  1. Contact form submits successfully (sends email via Lambda)
  2. Contact form shows success/error messages correctly
  3. All custom.js functions work without jQuery (11 functions converted)
  4. No `$` or `jQuery` references remain in codebase
  5. jQuery library removed from project (~87KB eliminated)
**Plans**: TBD

Plans:
- [ ] 05-01: Contact form fetch() conversion
- [ ] 05-02: custom.js vanilla JS conversion
- [ ] 05-03: jQuery removal and verification

### Phase 6: Content Update
**Goal**: Professional content reflects current expertise (AWS, AI, 19+ years experience)
**Depends on**: Nothing (can parallel Phases 1-5, but recommended after for clean diffs)
**Requirements**: CONT-01 (About section), CONT-02 (Skills display), CONT-03 (Stats update)
**Success Criteria** (what must be TRUE):
  1. About section mentions AWS/cloud expertise and Claude Code/AI tooling
  2. About section reflects "nearly a decade at Roundhouse" (not "6 years")
  3. GitHub profile link visible in header/footer or hero section
  4. Resume download button works (downloads PDF)
  5. Skills section shows AWS, Cloud Architecture, Claude Code/AI alongside existing skills
  6. Skills section uses list/badge format (no percentage bars)
  7. Stats show: Years Worked 19, Business Ownership 14, Computer Exp 29
**Plans**: TBD

Plans:
- [ ] 06-01: Hero and About section content update
- [ ] 06-02: Skills section redesign
- [ ] 06-03: Stats and links update

### Phase 7: SEO and Cleanup
**Goal**: Site has current meta tags and no dead code or unused files
**Depends on**: Phase 6 (content finalized first)
**Requirements**: SEO-01 (Refresh meta tags), TECH-01 (Clean up tech debt)
**Success Criteria** (what must be TRUE):
  1. Meta description reflects AWS/cloud/AI expertise
  2. Open Graph tags have correct images and descriptions
  3. No commented-out HTML blocks in index.html
  4. No unused CSS/JS files in assets folder
  5. No broken internal links or references
**Plans**: TBD

Plans:
- [ ] 07-01: Meta tags and SEO refresh
- [ ] 07-02: Dead code and file cleanup

### Phase 8: Security Hardening
**Goal**: IAM policies follow least-privilege, no unnecessary wildcard permissions
**Depends on**: Nothing (independent infrastructure work)
**Requirements**: SEC-01 (Improve security - scope IAM wildcards)
**Success Criteria** (what must be TRUE):
  1. Lambda execution role has scoped SES permissions (not ses:*)
  2. GitHub Actions role has scoped S3/CloudFront permissions where possible
  3. No new security warnings in CDK synth output
  4. Contact form still works after permission scoping (regression test)
**Plans**: TBD

Plans:
- [ ] 08-01: IAM policy audit and scoping

### Phase 9: Design Enhancement (OPTIONAL/DEFERRED)
**Goal**: Site has dark/light mode toggle and improved accessibility
**Depends on**: Phase 1 (Bootstrap 5 CSS custom properties required)
**Requirements**: None (v2 scope - differentiator, not requirement)
**Success Criteria** (what must be TRUE):
  1. Toggle switches between dark and light themes
  2. Theme preference persists across sessions (localStorage)
  3. Site respects `prefers-color-scheme` on first visit
  4. Site passes WCAG 2.2 AA contrast requirements
**Plans**: TBD

Plans:
- [ ] 09-01: CSS custom properties refactor
- [ ] 09-02: Dark/light mode implementation
- [ ] 09-03: Accessibility audit and fixes

## Progress

**Execution Order:**
Phases 1-5 are sequential (technical dependencies). Phase 6-8 can run after Phase 5 or interleave. Phase 9 is optional.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Bootstrap Migration | 1/1 | Complete | 2026-01-20 |
| 2. Carousel Migration | 1/1 | Complete | 2026-01-20 |
| 3. Lightbox Migration | 1/1 | Complete | 2026-01-20 |
| 4. Filter Migration | 0/1 | Not started | - |
| 5. jQuery Removal | 0/3 | Not started | - |
| 6. Content Update | 0/3 | Not started | - |
| 7. SEO and Cleanup | 0/2 | Not started | - |
| 8. Security Hardening | 0/1 | Not started | - |
| 9. Design Enhancement | 0/3 | Deferred | - |

## Requirement Coverage

| Requirement ID | Description | Phase | Status |
|----------------|-------------|-------|--------|
| BOOT-01 | Update Bootstrap 4 to Bootstrap 5 | Phase 1 | Complete |
| JS-01 | Update/replace dated JavaScript dependencies | Phases 2-5 | Pending |
| CONT-01 | Modernize About section content | Phase 6 | Pending |
| CONT-02 | Update skills display | Phase 6 | Pending |
| CONT-03 | Update stats | Phase 6 | Pending |
| SEO-01 | Refresh meta tags and SEO keywords | Phase 7 | Pending |
| TECH-01 | Clean up tech debt | Phase 7 | Pending |
| SEC-01 | Improve security (scope IAM wildcards) | Phase 8 | Pending |

**Coverage:** 8/8 requirements mapped (100%)
