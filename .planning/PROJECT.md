# mitchellmeffert.com

## What This Is

Personal portfolio website for Mitchell Meffert - a Web Developer/IT Lead at Roundhouse with expertise in AWS, cloud infrastructure, and web development. The site showcases professional experience, certifications, portfolio work, and provides a contact form. Currently deployed as a static site on AWS (S3 + CloudFront) with a serverless contact form (Lambda + SES).

## Core Value

Present Mitchell's professional capabilities accurately and make it easy for potential clients/employers to understand his expertise and get in touch.

## Requirements

### Validated

These capabilities exist and work in the current codebase:

- Static portfolio website served via CloudFront - existing
- HTTPS with custom domain (mitchellmeffert.com) - existing
- Contact form with reCAPTCHA spam protection - existing
- Responsive design for mobile/desktop - existing
- CI/CD deployment via GitHub Actions - existing
- CDK infrastructure as code - existing
- ✓ Bootstrap 5.3.8 (BOOT-01) — v1.0
- ✓ Modern vanilla JS plugins: Splide.js, PhotoSwipe, Isotope (JS-01) — v1.0
- ✓ jQuery removed, 241KB bundle reduction (JS-01) — v1.0
- ✓ About section with AWS/cloud/AI expertise (CONT-01) — v1.0
- ✓ Skills badges with modern tech stack (CONT-02) — v1.0
- ✓ Stats: 19 years, 14 ownership, 29 computer exp (CONT-03) — v1.0
- ✓ Meta tags and SEO refresh (SEO-01) — v1.0
- ✓ Tech debt cleanup (TECH-01) — v1.0
- ✓ IAM least-privilege permissions (SEC-01) — v1.0
- ✓ CSS custom properties for theming (CSS-01) — v1.1
- ✓ Responsive breakpoints 992px/1200px/1400px (CSS-02) — v1.1
- ✓ Keyboard focus with visible indicators (A11Y-01) — v1.1
- ✓ WCAG 4.5:1 color contrast (A11Y-02) — v1.1
- ✓ Aria-labels on icon-only links (A11Y-03) — v1.1
- ✓ Semantic landmarks main/footer (A11Y-04) — v1.1
- ✓ Single h1 heading hierarchy (A11Y-05) — v1.1
- ✓ SRI hashes on CDN resources (SEC-02) — v1.1

### Active

**Current Milestone: v1.2 Performance & SEO**

**Goal:** Comprehensive performance and SEO optimization for better search visibility and user experience.

**Target features:**
- Core Web Vitals optimization (LCP, FID/INP, CLS)
- JSON-LD structured data (Person, WebSite schemas)
- Technical SEO (sitemap, robots.txt, canonical URLs)

### Out of Scope

- Full site redesign/rewrite - keeping existing structure and visual style
- New framework (React/Next.js/Astro) - modernize in place
- Blog integration - keep linking to external mysmallbusinessblog.com
- User authentication - not needed for portfolio site
- CMS/admin interface - static content is fine
- Dark/light mode toggle - deferred to future milestone if desired

## Context

**Current State (v1.1 shipped 2026-01-21):**
- Site uses Bootstrap 5.3.8 with CSS custom properties (32 semantic color variables)
- Vanilla JavaScript with modern plugins: Splide.js, PhotoSwipe, Isotope
- jQuery completely removed (~241KB bundle reduction)
- WCAG accessibility compliant (keyboard focus, color contrast, aria-labels, semantic landmarks)
- CDN resources protected with SRI hashes (7 resources)
- Infrastructure: CDK v2, Lambda Node.js 24, GitHub Actions OIDC
- IAM policies follow least-privilege (scoped SES, CloudFormation)

**Technical Environment:**
- AWS Account: 241654197557
- Region: us-east-1
- Stack: S3, CloudFront, Lambda, SES, Route 53, Secrets Manager
- CDK v2 for infrastructure

## Constraints

- **Platform**: Modernize in place - no full rewrite to new framework
- **Visual Style**: Keep existing look and feel, just update underlying tech
- **Deployment**: Must continue working with existing GitHub Actions workflow
- **AWS Resources**: Use existing account (241654197557) and infrastructure patterns

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Bootstrap 4 to 5 in place | Preserves design while updating EOL framework | ✓ Good |
| Remove jQuery | Research showed all plugins have vanilla alternatives; 57% bundle reduction | ✓ Good |
| Keep VB/.NET skills | Part of professional history even if not current focus | ✓ Good |
| Static content (no CMS) | Simple portfolio doesn't need CMS complexity | ✓ Good |
| LinkedIn over resume PDF | User preference for live profile over static download | ✓ Good |
| Splide.js for carousel | Modern, accessible, lightweight replacement for Owl Carousel | ✓ Good |
| PhotoSwipe for lightbox | Modern, touch-friendly, no jQuery dependency | ✓ Good |
| Domain identity for SES | More secure than wildcard, scopes to mitchellmeffert.com | ✓ Good |
| CSS custom properties | Semantic naming (--color-text-muted) enables future theming | ✓ Good |
| :focus-visible over :focus | Keyboard-only focus rings, no distracting mouse focus | ✓ Good |
| Context-aware focus colors | Blue on light backgrounds, white on dark for contrast | ✓ Good |
| reCAPTCHA excluded from SRI | Dynamic content incompatible with fixed hashes - documented limitation | ✓ Good |
| nav landmark N/A | Single-page portfolio has no navigation menu | ✓ Good |
| Dark/light mode deferred | Feature enhancement, not requirement - can add in v1.2+ | ✓ Good |

---
*Last updated: 2026-01-21 — v1.2 milestone started*
