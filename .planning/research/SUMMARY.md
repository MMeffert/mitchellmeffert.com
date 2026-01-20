# Project Research Summary

**Project:** mitchellmeffert.com Portfolio Modernization
**Domain:** Personal Developer Portfolio (Bootstrap 4 to 5 Migration + Content Update)
**Researched:** 2026-01-19
**Confidence:** HIGH

## Executive Summary

This project modernizes a 2018 Bootstrap 4 + jQuery portfolio site to Bootstrap 5.3.x with vanilla JavaScript replacements. The migration is **medium complexity** because most changes are class renames and data attribute updates, not architectural rewrites. The key insight: **jQuery is no longer needed**. Bootstrap 5 dropped jQuery entirely, and all current plugins (Owl Carousel, Magnific Popup, Isotope) have lightweight vanilla JS alternatives (Splide.js, PhotoSwipe, Shuffle.js) that collectively reduce bundle size by ~57% (350KB to 150KB).

The recommended approach is **phased migration**: First update Bootstrap core and CSS classes (Phase 1), then replace jQuery-dependent plugins one at a time (Phase 2), convert custom JavaScript to vanilla (Phase 3), and finally remove jQuery entirely (Phase 4). This order prevents "big bang" migrations where it's impossible to debug which change caused a problem. Critical: do NOT remove jQuery until ALL dependent plugins are replaced.

Key risks center on the **contact form** (uses `$.ajax()` and jQuery selectors) and **data attribute namespace changes** (`data-toggle` to `data-bs-toggle`). Both must be addressed before jQuery removal or the contact form silently fails and Bootstrap components stop working. Content updates (AWS/AI focus, GitHub link, resume download, removing skill percentage bars) can largely proceed in parallel with the technical migration.

## Key Findings

### Recommended Stack

Replace the 2018 jQuery-dependent stack with modern vanilla JS alternatives. All replacements are mature, well-documented, and purpose-built for their use cases.

**Core technologies:**
- **Bootstrap 5.3.8**: CSS framework upgrade; dropped jQuery, uses CSS custom properties, RTL-ready logical classes (ms/me instead of ml/mr)
- **Splide.js 4.1.3**: Testimonial carousel; 12KB gzipped (vs Owl's 47KB), WCAG 2.1 AA accessible, zero dependencies
- **Shuffle.js 6.1.2**: Portfolio filtering; 8KB gzipped, Isotope-like API, vanilla JS since v4
- **PhotoSwipe 5.4.4**: Image lightbox; same author as Magnific Popup (natural migration), excellent touch support, ES modules
- **Typed.js 2.1.0**: Typing animation; already vanilla JS, just version update needed
- **Bootstrap Icons 1.13.1** (optional): Replace Material Design Icons for consistency with Bootstrap ecosystem

**Bundle size impact:** ~350KB current to ~150KB proposed (57% reduction)

See [STACK.md](./STACK.md) for detailed rationale, version numbers, and CDN/npm installation commands.

### Expected Features

Based on 2026 portfolio best practices research, the site has strong fundamentals but needs content and design updates.

**Must have (table stakes) - Present:**
- Mobile responsiveness (Bootstrap-based)
- Custom domain, HTTPS (CloudFront)
- Contact form with reCAPTCHA
- Experience timeline, certifications display
- Skills display (needs format update)

**Must have - Missing/Needs Update:**
- GitHub profile link (critical gap for developer portfolio)
- Resume download button
- Updated bio reflecting AWS/AI focus and 17+ years experience
- AWS/cloud architecture project samples

**Should have (competitive differentiators):**
- Dark/light mode toggle (respect `prefers-color-scheme`, persist in localStorage)
- Case study format for 2-3 flagship projects (problem/solution/outcome)
- AWS architecture diagrams
- AI/Claude Code expertise section
- Quantified impact metrics ("reduced API response time by 40%")
- Accessibility compliance (WCAG 2.2 AA)

**Defer (v2+):**
- Complex custom animations
- Custom cursor effects
- Video content
- Major template redesign

**Anti-features to fix:**
- Remove percentage-based skill bars ("80% Development" is meaningless)
- Update outdated technology emphasis (lead with AWS, not VB.NET)
- Address stale blog posts (2013-2014) or reduce section prominence

See [FEATURES.md](./FEATURES.md) for complete feature landscape and implementation priority matrix.

### Architecture Approach

The migration follows a **progressive enhancement pattern**: Keep jQuery temporarily while upgrading Bootstrap, replace plugins one at a time with both old and new coexisting briefly, convert custom JavaScript function by function, then remove jQuery only after ALL dependencies are eliminated.

**Major components and migration order:**

1. **Bootstrap Core** (CSS + JS + data attributes) - Must migrate together as a unit; CSS and JS version mismatch causes bugs
2. **Plugin Layer** (Owl Carousel, Magnific Popup, Isotope) - Can migrate incrementally; each plugin independent
3. **Custom JavaScript** (custom.js + inline scripts) - 11 functions to convert from jQuery to vanilla JS
4. **jQuery Removal** - Final step after all dependencies converted

**Key patterns to follow:**
- Replace plugins before removing them (both coexist temporarily)
- Update CSS classes with find-replace but verify visually (no blind automation)
- Test each function immediately after conversion

See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete component boundaries, file change summary, and anti-patterns to avoid.

### Critical Pitfalls

Research identified 11 pitfalls. Top 5 with prevention strategies:

1. **jQuery removal breaking contact form** - Contact form uses `$.ajax()`. Convert to native `fetch()` API BEFORE removing jQuery. Warning sign: form submit does nothing, console shows `$ is not defined`.

2. **Data attribute namespace change breaking interactivity** - `data-toggle` must become `data-bs-toggle` (all Bootstrap data attributes). Warning sign: hamburger menu click does nothing. Run detection script: `document.querySelectorAll('[data-toggle]').length > 0`

3. **Owl Carousel is abandoned** - Last release 2017, requires jQuery, no Bootstrap 5 compatible version. Must replace with Splide.js (or similar) before jQuery removal. Warning sign: `owlCarousel is not a function`.

4. **Magnific Popup is deprecated** - Developer recommends PhotoSwipe instead. jQuery required. Replace before jQuery removal. Warning sign: clicking portfolio images navigates to file instead of lightbox.

5. **Utility class renames breaking layout** - `ml-*` to `ms-*`, `float-left` to `float-start`, etc. Affects footer, about section, contact form. Warning sign: elements misaligned, floats not working. Create mapping file, verify each change visually.

See [PITFALLS.md](./PITFALLS.md) for complete pitfall catalog, detection methods, and prevention strategies.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation (Bootstrap Migration)
**Rationale:** Bootstrap CSS/JS must be updated together before any other changes; this unlocks all subsequent phases.
**Delivers:** Working site with Bootstrap 5.3.8, updated CSS classes, fixed data attributes
**Addresses:**
- All Bootstrap 4 to 5 class renames (ml-* to ms-*, etc.)
- Data attribute namespace (`data-bs-*`)
- Link underline CSS fix
- Form control height adjustments
**Avoids:** Pitfalls #2 (data attributes), #5 (utility classes), #8-11 (minor CSS issues)
**Research flag:** Standard patterns - Bootstrap migration guide is authoritative

### Phase 2: Plugin Migration
**Rationale:** jQuery-dependent plugins must be replaced before jQuery can be removed; can parallelize these replacements.
**Delivers:** Modern vanilla JS plugins (Splide, PhotoSwipe, Shuffle.js), jQuery still present temporarily
**Uses:** Splide.js 4.1.3, PhotoSwipe 5.4.4, Shuffle.js 6.1.2
**Implements:** Plugin layer from architecture
**Addresses:**
- Testimonial carousel (Owl -> Splide)
- Portfolio lightbox (Magnific -> PhotoSwipe)
- Portfolio filtering (Isotope jQuery syntax -> vanilla)
**Avoids:** Pitfalls #3 (Owl abandoned), #4 (Magnific deprecated), #6 (Isotope flexbox conflicts)
**Research flag:** Standard patterns - all replacements have migration documentation

### Phase 3: jQuery Removal
**Rationale:** Only after ALL plugins are migrated can jQuery be safely removed.
**Delivers:** Fully vanilla JS site, ~57% bundle size reduction
**Implements:** Custom JavaScript conversion (11 functions in custom.js)
**Addresses:**
- Contact form conversion (`$.ajax()` to `fetch()`)
- Typed.js initialization (jQuery syntax to vanilla)
- All custom.js functions
- Inline scripts in index.html
**Avoids:** Pitfall #1 (contact form breaking), #7 (Typed.js initialization)
**Research flag:** Needs careful testing - contact form is business-critical

### Phase 4: Content Update
**Rationale:** Content changes can largely proceed in parallel with technical migration or follow it; this phase focuses on portfolio substance.
**Delivers:** Updated professional positioning, AWS/AI showcase
**Addresses:**
- Hero text update (AWS/AI focus)
- About section bio update
- GitHub profile link addition
- Resume download button
- Skill display modernization (remove percentage bars)
- AWS/cloud project samples
**Avoids:** Anti-features from FEATURES.md (percentage skill bars, outdated tech emphasis)
**Research flag:** Content-only - no technical research needed

### Phase 5: Design Enhancement (Optional)
**Rationale:** Visual polish after core functionality is stable; these are differentiators not requirements.
**Delivers:** Dark/light mode toggle, micro-interactions, accessibility compliance
**Addresses:**
- CSS custom properties refactor
- Theme toggle with localStorage persistence
- `prefers-color-scheme` and `prefers-reduced-motion` support
- WCAG 2.2 AA audit
**Research flag:** May need research - dark mode implementation has nuances (avoid pure #000)

### Phase Ordering Rationale

- **Phases 1-3 are sequentially dependent:** Bootstrap upgrade must precede plugin migration, which must precede jQuery removal
- **Phase 4 (content) can parallel Phases 1-3:** Content changes don't depend on technical migration
- **Phase 5 deferred:** Design enhancements are nice-to-have differentiators, not blockers

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 3 (jQuery Removal):** Contact form is business-critical; needs thorough testing plan
- **Phase 5 (Design Enhancement):** Dark mode implementation has accessibility nuances; may want deeper research on color system

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Foundation):** Bootstrap migration guide is comprehensive and authoritative
- **Phase 2 (Plugin Migration):** All replacement libraries have good documentation
- **Phase 4 (Content Update):** Content-only phase, no technical research needed

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified against official sources; mature libraries with active maintenance |
| Features | HIGH | Cross-verified across 10+ authoritative 2025/2026 portfolio best practices sources |
| Architecture | HIGH | Based on official Bootstrap 5 migration guide + codebase analysis |
| Pitfalls | HIGH | Combination of official docs, community experience reports, and codebase-specific analysis |

**Overall confidence:** HIGH

### Gaps to Address

- **Performance baseline:** Current load time unknown; should audit before and after migration
- **Accessibility current state:** Full WCAG audit not completed; flagged for Phase 5
- **Contact form testing:** Lambda + reCAPTCHA Enterprise integration needs test plan
- **Browser compatibility:** Assume modern browsers but should document minimum supported versions

## Sources

### Primary (HIGH confidence)
- [Bootstrap 5.3 Official Documentation](https://getbootstrap.com/docs/5.3/) - Migration guide, all class/attribute changes
- [Splide.js Official](https://splidejs.com/) - Carousel replacement
- [Shuffle.js Official](https://shuffle.js.org/) - Portfolio filtering
- [PhotoSwipe Official](https://photoswipe.com/) - Lightbox replacement
- [Typed.js GitHub](https://github.com/mattboldt/typed.js) - Version verification

### Secondary (MEDIUM confidence)
- [Elementor Portfolio Examples 2026](https://elementor.com/blog/best-web-developer-portfolio-examples/)
- [ZenCoder Software Engineer Portfolio 2026](https://zencoder.ai/blog/how-to-create-software-engineer-portfolio)
- [Isotope Extras](https://isotope.metafizzy.co/extras) - Bootstrap integration notes
- [freeCodeCamp Bootstrap 5 Migration](https://www.freecodecamp.org/news/bootstrap-5-vanilla-js-tutorial/)

### Tertiary (validated through cross-reference)
- [Talentica Bootstrap 4 to 5 Challenges](https://www.talentica.com/blogs/bootstrap-4-to-5-upgrade-challenges-mistakes-strategies/)
- Community blog posts on dark mode best practices

---
*Research completed: 2026-01-19*
*Ready for roadmap: yes*
