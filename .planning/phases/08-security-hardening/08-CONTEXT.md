# Phase 8: Security Hardening - Context

**Gathered:** 2026-01-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Scope IAM wildcard permissions to follow least-privilege. Review Lambda execution role (SES access) and GitHub Actions role (S3/CloudFront access). No new infrastructure — just tightening existing policies.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion

User delegated all security decisions to Claude. Apply standard AWS security best practices:

**Lambda SES permissions:**
- Scope from `ses:*` to specific actions needed (SendEmail, SendRawEmail)
- Scope Resource to specific verified identity if applicable
- Review whether SendRawEmail is actually needed (contact form likely uses SendEmail only)

**GitHub Actions S3/CloudFront permissions:**
- Scope S3 actions to specific bucket ARN (not `*`)
- Scope CloudFront actions to specific distribution ARN
- Review whether all current actions are needed for static site deploy

**Testing strategy:**
- Test contact form after Lambda scoping (send test email)
- Test GitHub Actions deploy after role scoping (trigger workflow)
- Verify CDK synth has no new security warnings

**Risk mitigation:**
- Make incremental changes (one role at a time)
- Test after each change before proceeding
- CDK allows easy rollback via `cdk deploy` with prior code

</decisions>

<specifics>
## Specific Ideas

No specific requirements — apply AWS security best practices and least-privilege principle.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 08-security-hardening*
*Context gathered: 2026-01-20*
