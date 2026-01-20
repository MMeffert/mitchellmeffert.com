---
phase: 08-security-hardening
plan: 01
subsystem: infra
tags: [iam, aws, cdk, least-privilege, security]

# Dependency graph
requires:
  - phase: 01-bootstrap-migration
    provides: CDK infrastructure stack with IAM roles
provides:
  - Scoped Lambda SES permissions (ses:SendEmail only, domain identity)
  - Scoped GitHub Actions CloudFormation permissions (specific stack ARN)
  - Eliminated all wildcard IAM resources in custom policies
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "IAM least-privilege: scope actions to minimal required and resources to specific ARNs"
    - "SES identity ARN pattern: arn:aws:ses:${region}:${account}:identity/${domain}"
    - "CloudFormation stack ARN pattern with /* suffix for ID changes"

key-files:
  created: []
  modified:
    - cdk/lib/static-site-stack.ts

key-decisions:
  - "Removed ses:SendRawEmail - contact form only uses SendEmail API"
  - "Scoped SES to domain identity (not email identity) - domain is what's verified"
  - "CloudFormation stack ARN uses /* suffix to handle CloudFormation's unique ID suffix"

patterns-established:
  - "IAM least-privilege: Always scope resources to specific ARNs, avoid wildcards"

# Metrics
duration: 4min
completed: 2026-01-20
---

# Phase 8 Plan 1: IAM Least-Privilege Summary

**Scoped IAM wildcard permissions to specific ARNs for Lambda SES and GitHub Actions CloudFormation access**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-20T21:37:00Z
- **Completed:** 2026-01-20T21:41:00Z
- **Tasks:** 3
- **Files modified:** 1

## Accomplishments

- Lambda SES permissions scoped from `*` to `arn:aws:ses:us-east-1:241654197557:identity/mitchellmeffert.com`
- Removed unused `ses:SendRawEmail` action from Lambda policy
- GitHub Actions CloudFormation permissions scoped from `*` to `arn:aws:cloudformation:us-east-1:241654197557:stack/mitchellmeffert-website-stack/*`
- CDK deployed successfully with scoped IAM policies

## Task Commits

Each task was committed atomically:

1. **Task 1: Scope Lambda SES permissions** - `6800e07` (security)
2. **Task 2: Scope CloudFormation DescribeStacks permissions** - `6d113d2` (security)
3. **Task 3: Deploy and verify changes** - (no code changes, verification only)

## Files Created/Modified

- `cdk/lib/static-site-stack.ts` - Scoped IAM policies for Lambda SES and GitHub Actions CloudFormation

## Decisions Made

- **Removed ses:SendRawEmail:** Contact form uses SES SendEmail API, not SendRawEmail (for MIME-formatted emails)
- **Scoped to domain identity:** The verified SES identity is `mitchellmeffert.com` (domain), not individual email addresses
- **CloudFormation ARN with /* suffix:** Required because CloudFormation stack ARNs include a unique ID suffix that changes on updates

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- **AWS Profile:** Default AWS credentials pointed to wrong account (919311966619 instead of 241654197557). Resolved by explicitly setting `AWS_PROFILE=personal` for CDK commands.
- **Contact form test:** Cannot test email sending directly due to reCAPTCHA protection. Lambda invocation succeeded and reached reCAPTCHA verification step, confirming Secrets Manager permissions work. SES permissions verified via CDK synth output showing correct ARN.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 8 (Security Hardening) complete. All IAM wildcard permissions have been scoped:
- Lambda SES: Domain identity ARN
- GitHub Actions CloudFormation: Specific stack ARN
- S3 and CloudFront: Already bucket/distribution scoped via CDK grants

Ready for Phase 9 (Design Enhancement) if pursued.

---
*Phase: 08-security-hardening*
*Completed: 2026-01-20*
