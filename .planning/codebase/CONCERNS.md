# Codebase Concerns

**Analysis Date:** 2026-01-19

## Tech Debt

**Unused Contact Form JavaScript:**
- Issue: `js/contact.js` is included in project but not used; inline script in `index.html` handles form submission instead
- Files: `js/contact.js`
- Impact: Confusing for maintainers; dead code
- Fix approach: Remove `js/contact.js` or refactor inline script to use it

**Hardcoded Lambda Function URL:**
- Issue: Lambda function URL is hardcoded in `index.html` line 43
- Files: `index.html`
- Impact: Requires manual HTML update if Lambda URL changes; no environment separation
- Fix approach: Consider using CloudFront Function to inject URL, or accept as static site limitation

**Hardcoded reCAPTCHA Site Key:**
- Issue: reCAPTCHA site key hardcoded in `index.html` (lines 6, 31)
- Files: `index.html`
- Impact: Same as Lambda URL - requires manual updates
- Fix approach: Accept as static site limitation or use build-time variable injection

**Template-Derived Codebase:**
- Issue: Project uses "Elvish" Bootstrap 4 template (ThemesBoss, May 2018) with minimal customization
- Files: `css/style.css`, `js/custom.js`, all vendor JS/CSS files
- Impact: Template is 7+ years old; Bootstrap 4 is EOL; difficult to upgrade
- Fix approach: Accept for now; consider modern rewrite for major updates

**Commented Out HTML Sections:**
- Issue: Large commented HTML blocks (Services section, Download Resume button)
- Files: `index.html` (lines 251-337, 152-154)
- Impact: Bloats file size; unclear if intended features or removed features
- Fix approach: Remove commented code or document intent

## Known Bugs

**No known bugs identified.**

## Security Considerations

**Wildcard IAM Resources:**
- Risk: Two IAM policies use `resources: ['*']` for CloudFormation DescribeStacks and SES SendEmail
- Files: `cdk/lib/static-site-stack.ts` (lines 134, 172)
- Current mitigation: Limited actions (cloudformation:DescribeStacks, ses:SendEmail/SendRawEmail)
- Recommendations: Scope SES resources to specific email identities if possible

**Lambda Logs Sensitive Data:**
- Risk: Full event body logged including user data (name, email, message)
- Files: `cdk/lambda/contact-form/index.js` (line 32)
- Current mitigation: CloudWatch logs have retention; data is user-submitted
- Recommendations: Consider logging only non-PII fields or sanitized summaries

**reCAPTCHA API Key in Secrets Manager:**
- Risk: API key stored in Secrets Manager - good practice
- Files: `cdk/lambda/contact-form/index.js`, `cdk/lib/static-site-stack.ts`
- Current mitigation: Secret name referenced by environment variable; Lambda has explicit read permission
- Recommendations: Current approach is appropriate

**Contact Form Open to Internet:**
- Risk: Lambda Function URL has no authentication (authType: NONE)
- Files: `cdk/lib/static-site-stack.ts` (line 178)
- Current mitigation: reCAPTCHA Enterprise validation; CORS restricts origins
- Recommendations: Current approach is standard for public contact forms

**Outdated jQuery:**
- Risk: `jquery.min.js` version unknown; older jQuery versions have known vulnerabilities
- Files: `js/jquery.min.js`
- Current mitigation: Static site with no server-side processing limits attack surface
- Recommendations: Update jQuery to latest 3.x; verify all vendor libraries are current

## Performance Bottlenecks

**Large Single-Page HTML:**
- Problem: `index.html` is 902 lines (56KB) with all content inline
- Files: `index.html`
- Cause: Single-page design with all sections; no lazy loading
- Improvement path: Acceptable for portfolio site; CloudFront caching mitigates

**Multiple External Font Loads:**
- Problem: Google Fonts loaded via CSS import; potential render-blocking
- Files: `css/style.css` (line 35)
- Cause: Standard template approach
- Improvement path: Self-host fonts or use `font-display: swap`

**No Image Optimization Pipeline:**
- Problem: Images are static files with no optimization/compression pipeline
- Files: `images/` directory
- Cause: Manual image management
- Improvement path: Add image optimization to deployment workflow or pre-optimize

## Fragile Areas

**Contact Form Integration:**
- Files: `index.html` (lines 9-67), `cdk/lambda/contact-form/index.js`
- Why fragile: Tightly coupled frontend inline JS with Lambda backend; hardcoded URLs; reCAPTCHA dependency on external service
- Safe modification: Test locally with mock API; verify reCAPTCHA integration after changes
- Test coverage: No tests exist

**CDK Stack:**
- Files: `cdk/lib/static-site-stack.ts`
- Why fragile: OIDC GitHub Actions role trust; DNS/certificate dependencies
- Safe modification: Use `cdk diff` before deploy; test in separate environment first
- Test coverage: No tests exist

## Scaling Limits

**Not applicable** - Static site with CloudFront edge caching handles traffic scaling automatically.

**SES Sending Limits:**
- Current capacity: AWS SES has default sending limits (may be in sandbox mode)
- Limit: 200 emails/24hr in sandbox; 1 email/second
- Scaling path: Request SES production access if needed

## Dependencies at Risk

**Bootstrap 4:**
- Risk: End of life; no security updates
- Impact: Potential security vulnerabilities in CSS/JS; no new features
- Migration plan: Upgrade to Bootstrap 5 (breaking changes) or modern CSS framework

**Owl Carousel:**
- Risk: Last updated 2017; may have compatibility issues with modern browsers
- Files: `js/owl.carousel.min.js`, `css/owl.*.css`
- Impact: Testimonial slider may break on new browsers
- Migration plan: Replace with modern carousel (Swiper, Splide)

**Magnific Popup:**
- Risk: Last updated 2016; jQuery dependency
- Files: `js/jquery.magnific-popup.min.js`, `css/magnific-popup.css`
- Impact: Image lightbox may break
- Migration plan: Replace with modern lightbox (GLightbox, Lightbox2)

**Isotope:**
- Risk: Older version; no visible version number
- Files: `js/isotope.js`
- Impact: Portfolio filtering may break
- Migration plan: Update to latest Isotope or use CSS Grid filtering

## Missing Critical Features

**No 404 Page:**
- Problem: CloudFront 404 redirects to `/index.html` (SPA pattern for static site)
- Blocks: Users get homepage instead of error; confusing UX for broken links

## Test Coverage Gaps

**No Test Infrastructure:**
- What's not tested: Entire codebase - frontend, Lambda function, CDK stack
- Files: All source files
- Risk: Changes may break functionality undetected
- Priority: Medium - small project, but Lambda and CDK warrant tests

**Lambda Contact Form:**
- What's not tested: reCAPTCHA validation logic, email sending, error handling
- Files: `cdk/lambda/contact-form/index.js`
- Risk: Breaking changes to reCAPTCHA API or SES could go unnoticed
- Priority: High - user-facing functionality

**CDK Infrastructure:**
- What's not tested: Stack synthesis, resource configuration
- Files: `cdk/lib/static-site-stack.ts`
- Risk: Infrastructure changes may have unintended consequences
- Priority: Medium - CDK snapshots would catch drift

---

*Concerns audit: 2026-01-19*
