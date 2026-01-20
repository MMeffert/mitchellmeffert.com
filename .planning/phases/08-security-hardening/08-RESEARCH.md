# Phase 8: Security Hardening - Research

**Researched:** 2026-01-20
**Domain:** AWS IAM least-privilege policies, SES permissions, CDK security patterns
**Confidence:** HIGH

## Summary

This phase focuses on scoping IAM wildcard permissions in the existing CDK infrastructure. The current codebase has three areas requiring attention: Lambda SES permissions using `ses:*` with `Resource: '*'`, CloudFormation DescribeStacks using `Resource: '*'`, and S3/CloudFront permissions granted via CDK helper methods.

Research confirms that AWS SES supports resource-level permissions using identity ARNs in the format `arn:aws:ses:${region}:${account}:identity/${identity}`. The Lambda contact form only uses `ses:SendEmail` (not `SendRawEmail`), so the policy can be scoped to that single action plus the specific verified identity. CloudFormation `DescribeStacks` does support resource-level permissions but commonly requires wildcards when used to query stack outputs; however, it can be scoped to a specific stack ARN pattern. The CDK's `bucket.grantReadWrite()` method already scopes S3 permissions to the specific bucket ARN automatically.

**Primary recommendation:** Scope Lambda SES to `ses:SendEmail` on `arn:aws:ses:us-east-1:241654197557:identity/mitchellmeffert.com`, scope CloudFormation DescribeStacks to the specific stack ARN pattern, and verify existing S3 grants are already bucket-scoped.

## Standard Stack

This phase uses existing CDK infrastructure with no new libraries.

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| aws-cdk-lib | ^2.170.0 | Infrastructure as Code | Already in use, provides IAM constructs |
| @aws-cdk/aws-iam | (bundled) | IAM policy management | L2 constructs with least-privilege helpers |

### Supporting
No additional libraries required - using native CDK IAM constructs.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual PolicyStatement | cdk-nag | Adds validation but overkill for 2 policy changes |
| Inline policy | Managed policy | Inline is simpler for Lambda-specific permissions |

## Architecture Patterns

### Current IAM Structure
```
cdk/lib/static-site-stack.ts
├── Lambda execution role (auto-created)
│   ├── SES permissions (currently ses:* on *)  <-- NEEDS SCOPING
│   └── Secrets Manager (already scoped via grantRead)
├── GitHub Actions role
│   ├── S3 permissions (via grantReadWrite)     <-- VERIFY SCOPED
│   ├── CloudFront (already scoped to distribution ARN)
│   └── CloudFormation (currently * on *)       <-- NEEDS SCOPING
```

### Pattern 1: SES Identity-Scoped Policy
**What:** Replace wildcard SES permissions with identity-specific ARN
**When to use:** Any Lambda sending email via SES
**Example:**
```typescript
// Source: https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonses.html
this.contactFormFunction.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['ses:SendEmail'],  // Remove SendRawEmail - not used
    resources: [
      `arn:aws:ses:${this.region}:${this.account}:identity/mitchellmeffert.com`
    ],
  })
);
```

### Pattern 2: CloudFormation Stack-Scoped Policy
**What:** Scope DescribeStacks to specific stack name pattern
**When to use:** CI/CD roles that query specific stack outputs
**Example:**
```typescript
// Source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/control-access-with-iam.html
this.githubActionsRole.addToPolicy(
  new iam.PolicyStatement({
    actions: ['cloudformation:DescribeStacks'],
    resources: [
      `arn:aws:cloudformation:${this.region}:${this.account}:stack/mitchellmeffert-website-stack/*`
    ],
  })
);
```

### Anti-Patterns to Avoid
- **Wildcard resources on SES:** `resources: ['*']` allows sending from any verified identity in the account
- **Wildcard on DescribeStacks without need:** Allows querying all stacks when only one is needed
- **Removing SendRawEmail without verification:** Always check Lambda code first (verified: only SendEmail is used)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| S3 bucket permissions | Manual policy with all actions | `bucket.grantReadWrite(role)` | CDK auto-scopes to bucket ARN and handles encryption key permissions |
| Lambda execution role | `new iam.Role()` manually | Let Lambda construct create it | CDK manages trust policy and basic permissions |
| CloudFront invalidation | `cloudfront:*` | Specific `cloudfront:CreateInvalidation` | Already correctly scoped in codebase |

**Key insight:** CDK L2 constructs generate least-privilege policies via `grant*()` methods. Only add custom PolicyStatements for services without grant methods (like SES SendEmail).

## Common Pitfalls

### Pitfall 1: SES Resource ARN Confusion
**What goes wrong:** Using email ARN when domain ARN is needed, or vice versa
**Why it happens:** SES has two identity types - email addresses and domains
**How to avoid:** Check which identity is verified in SES console; for domain-verified emails, use domain ARN
**Warning signs:** "AccessDenied" errors when sending, even though action is allowed

The verified identity for `mitchell@mitchellmeffert.com` is the domain `mitchellmeffert.com`, so use:
`arn:aws:ses:us-east-1:241654197557:identity/mitchellmeffert.com`

### Pitfall 2: CloudFormation DescribeStacks Scope
**What goes wrong:** Over-scoping to specific stack version ID breaks future deployments
**Why it happens:** Full stack ARN includes a unique ID that changes on stack updates
**How to avoid:** Use wildcard for the stack ID portion: `stack/stack-name/*`
**Warning signs:** Workflow works once, then fails after CDK deploy

### Pitfall 3: Breaking Lambda with Insufficient Permissions
**What goes wrong:** Scoping permissions too tightly breaks functionality
**Why it happens:** Removing permissions without testing
**How to avoid:** Test contact form after each permission change; keep rollback plan ready
**Warning signs:** Lambda invocation succeeds but returns 500 errors

### Pitfall 4: CDK Synth Drift Detection False Positives
**What goes wrong:** CDK shows "changes" when none exist
**Why it happens:** IAM policy statement ordering can differ between synth runs
**How to avoid:** Use `cdk diff` to review actual changes before deploying
**Warning signs:** Unexpected IAM policy modifications in diff output

## Code Examples

Verified patterns from official sources:

### Scoped SES SendEmail Policy
```typescript
// Source: https://docs.aws.amazon.com/ses/latest/dg/sending-authorization-policy-examples.html
// Current code (lines 169-174 of static-site-stack.ts):
this.contactFormFunction.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['ses:SendEmail', 'ses:SendRawEmail'],  // <-- Too broad
    resources: ['*'],                                  // <-- Wildcard
  })
);

// Recommended replacement:
this.contactFormFunction.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ['ses:SendEmail'],  // Only action actually used
    resources: [
      `arn:aws:ses:${this.region}:${this.account}:identity/mitchellmeffert.com`
    ],
  })
);
```

### Scoped CloudFormation DescribeStacks Policy
```typescript
// Source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/control-access-with-iam.html
// Current code (lines 131-136 of static-site-stack.ts):
this.githubActionsRole.addToPolicy(
  new iam.PolicyStatement({
    actions: ['cloudformation:DescribeStacks'],
    resources: ['*'],  // <-- Wildcard
  })
);

// Recommended replacement:
this.githubActionsRole.addToPolicy(
  new iam.PolicyStatement({
    actions: ['cloudformation:DescribeStacks'],
    resources: [
      `arn:aws:cloudformation:${this.region}:${this.account}:stack/${props.siteName}-stack/*`
    ],
  })
);
```

### Verify Existing S3 Grant (No Change Needed)
```typescript
// Source: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.Bucket.html
// Current code (line 124 of static-site-stack.ts):
this.bucket.grantReadWrite(this.githubActionsRole);

// This already generates a properly-scoped policy:
// - Actions: s3:GetObject*, s3:GetBucket*, s3:List*, s3:DeleteObject*, s3:PutObject*, s3:Abort*
// - Resource: arn:aws:s3:::mitchellmeffert-website-241654197557 and mitchellmeffert-website-241654197557/*
// NO CHANGE NEEDED - CDK handles this correctly
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `ses:*` wildcards | Specific actions (SendEmail) | Always recommended | Prevents accidental access to SES management APIs |
| `Resource: '*'` | Identity ARN scoping | SES supports this | Prevents cross-identity email spoofing |
| Manual S3 policies | `grantReadWrite()` | CDK v1.85.0+ | Auto-scopes and handles encryption keys |

**Deprecated/outdated:**
- Using `ses:SendRawEmail` when `ses:SendEmail` suffices (SendRawEmail is for MIME-formatted emails with attachments)
- ACL permissions in S3 grants (disabled by default since CDK v1.85.0 with feature flag)

## Open Questions

Things that couldn't be fully resolved:

1. **SES Configuration Set Permissions**
   - What we know: Current policy doesn't reference configuration sets
   - What's unclear: Whether a configuration set is used/needed for delivery tracking
   - Recommendation: Check AWS SES console; if no config set, no policy change needed

2. **CloudFormation DescribeStacks Edge Cases**
   - What we know: The workflow queries stack outputs by name
   - What's unclear: Whether AWS CLI handles the stack ID portion of ARN automatically
   - Recommendation: Test with scoped policy; if fails, may need to revert to `*`

## Testing Strategy

**Order matters - test after each change:**

1. **After SES scoping:**
   - Send test contact form submission
   - Verify email arrives at mitchell@mitchellmeffert.com
   - Check Lambda CloudWatch logs for any permission errors

2. **After CloudFormation scoping:**
   - Trigger GitHub Actions workflow manually
   - Verify "Get CloudFormation outputs" step succeeds
   - Confirm deployment completes successfully

3. **CDK validation:**
   - Run `cdk synth` - should have no security warnings
   - Run `cdk diff` - should show only expected IAM changes
   - Run `cdk deploy` - should complete without errors

## Sources

### Primary (HIGH confidence)
- [AWS SES Service Authorization Reference](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonses.html) - Resource ARN formats for SendEmail
- [AWS SES Sending Policy Examples](https://docs.aws.amazon.com/ses/latest/dg/sending-authorization-policy-examples.html) - Identity ARN patterns
- [AWS CloudFormation IAM Access Control](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/control-access-with-iam.html) - Stack-level permissions
- [AWS CDK S3 Bucket.grantReadWrite](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.Bucket.html) - Grant method behavior
- [AWS CDK Security Best Practices](https://docs.aws.amazon.com/cdk/v2/guide/best-practices-security.html) - CDK permission patterns

### Secondary (MEDIUM confidence)
- [AWS CDK IAM Module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam-readme.html) - PolicyStatement usage
- [cdk-nag GitHub](https://github.com/cdklabs/cdk-nag) - IAM validation rules (not used but referenced for context)

### Tertiary (LOW confidence)
- None - all findings verified with official AWS documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using existing CDK, no new dependencies
- Architecture: HIGH - Verified against AWS documentation and codebase analysis
- Pitfalls: HIGH - Based on official AWS guidance and common patterns

**Research date:** 2026-01-20
**Valid until:** 2026-02-20 (30 days - IAM patterns are stable)

---

## Implementation Checklist

For the planner to reference:

- [ ] Lambda SES: Change `ses:SendEmail, ses:SendRawEmail` to `ses:SendEmail` only
- [ ] Lambda SES: Change `resources: ['*']` to identity ARN
- [ ] GitHub Actions: Scope `cloudformation:DescribeStacks` to stack ARN pattern
- [ ] Verify: S3 `grantReadWrite()` already bucket-scoped (no change needed)
- [ ] Verify: CloudFront already distribution-scoped (no change needed)
- [ ] Test: Contact form after SES changes
- [ ] Test: GitHub Actions workflow after CloudFormation changes
- [ ] Validate: `cdk synth` and `cdk diff` show expected changes only
