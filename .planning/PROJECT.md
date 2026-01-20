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

### Active

(No active requirements - v1.0 milestone complete. Define next milestone with `/gsd:new-milestone`)

### Out of Scope

- Full site redesign/rewrite - keeping existing structure and visual style
- New framework (React/Next.js/Astro) - modernize in place
- Blog integration - keep linking to external mysmallbusinessblog.com
- User authentication - not needed for portfolio site
- CMS/admin interface - static content is fine
- Dark/light mode toggle - deferred to optional Phase 9

## Context

**Current State (v1.0 shipped 2026-01-20):**
- Site uses Bootstrap 5.3.8 (upgraded from Bootstrap 4)
- Vanilla JavaScript with modern plugins: Splide.js, PhotoSwipe, Isotope
- jQuery completely removed (~241KB bundle reduction)
- Content reflects current expertise (AWS, cloud, AI, 19 years experience)
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
| Phase 9 optional | Dark/light mode is differentiator, not requirement | ✓ Good |
| LinkedIn over resume PDF | User preference for live profile over static download | ✓ Good |
| Splide.js for carousel | Modern, accessible, lightweight replacement for Owl Carousel | ✓ Good |
| PhotoSwipe for lightbox | Modern, touch-friendly, no jQuery dependency | ✓ Good |
| Domain identity for SES | More secure than wildcard, scopes to mitchellmeffert.com | ✓ Good |

---
*Last updated: 2026-01-20 after v1.0 milestone completion*
