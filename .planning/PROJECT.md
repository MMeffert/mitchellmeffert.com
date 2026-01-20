# mitchellmeffert.com

## What This Is

Personal portfolio website for Mitchell Meffert - a Web Developer/IT Lead at Roundhouse with expertise in AWS, cloud infrastructure, and web development. The site showcases professional experience, certifications, portfolio work, and provides a contact form. Currently deployed as a static site on AWS (S3 + CloudFront) with a serverless contact form (Lambda + SES).

## Core Value

Present Mitchell's professional capabilities accurately and make it easy for potential clients/employers to understand his expertise and get in touch.

## Requirements

### Validated

These capabilities exist and work in the current codebase:

- ✓ Static portfolio website served via CloudFront — existing
- ✓ HTTPS with custom domain (mitchellmeffert.com) — existing
- ✓ Contact form with reCAPTCHA spam protection — existing
- ✓ Responsive design for mobile/desktop — existing
- ✓ CI/CD deployment via GitHub Actions — existing
- ✓ CDK infrastructure as code — existing

### Active

Current scope - building toward these:

- [ ] Update Bootstrap 4 → Bootstrap 5
- [ ] Update/replace dated JavaScript dependencies
- [ ] Modernize About section content (AWS focus, Claude Code/AI mention)
- [ ] Update skills display (add AWS, Claude Code; keep foundational skills)
- [ ] Update stats (years worked: ~19, ownership: ~14, computer exp: ~28-29)
- [ ] Clean up tech debt (remove unused files, commented HTML blocks)
- [ ] Refresh meta tags and SEO keywords
- [ ] Improve security (scope IAM wildcards where possible)

### Out of Scope

- Full site redesign/rewrite — keeping existing structure and visual style
- New framework (React/Next.js/Astro) — modernize in place
- Blog integration — keep linking to external mysmallbusinessblog.com
- User authentication — not needed for portfolio site
- CMS/admin interface — static content is fine

## Context

**Current State:**
- Site uses Bootstrap 4 template ("Elvish" from ThemesBoss, May 2018)
- jQuery-based with several dated plugins (Owl Carousel 2017, Magnific Popup 2016)
- Content last significantly updated several years ago
- Infrastructure is modern (CDK, Lambda Node.js 24, GitHub Actions OIDC)

**Technical Environment:**
- AWS Account: 241654197557
- Region: us-east-1
- Stack: S3, CloudFront, Lambda, SES, Route 53, Secrets Manager
- CDK v2 for infrastructure

**Content Updates Needed:**
- About: "last 6 years at Roundhouse" → "nearly a decade"
- About: Add AWS/cloud expertise, Claude Code/AI tooling
- Skills: Add AWS, Cloud Architecture, Claude Code/AI
- Skills: Keep Development, WordPress, Photoshop, HTML, Visual Basic, .NET
- Stats: Years Worked 17→19, Business Ownership 12→14, Computer Exp 26→29
- Stats: Websites Managed stays at 30

## Constraints

- **Platform**: Modernize in place — no full rewrite to new framework
- **Visual Style**: Keep existing look and feel, just update underlying tech
- **Deployment**: Must continue working with existing GitHub Actions workflow
- **AWS Resources**: Use existing account (241654197557) and infrastructure patterns

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Bootstrap 4 → 5 in place | Preserves design while updating EOL framework | — Pending |
| Keep jQuery | Many plugins depend on it; removing adds risk | — Pending |
| Keep VB/.NET skills | Part of professional history even if not current focus | ✓ Good |
| Static content (no CMS) | Simple portfolio doesn't need CMS complexity | ✓ Good |

---
*Last updated: 2026-01-19 after initialization*
