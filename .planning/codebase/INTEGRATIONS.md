# External Integrations

**Analysis Date:** 2025-01-19

## AWS Services

**S3 (Storage):**
- Purpose: Static website content hosting
- Bucket: `mitchellmeffert-website-241654197557`
- Configuration: Private, encrypted (S3_MANAGED), versioned, SSL enforced
- Access: CloudFront OAC only (no public access)
- Defined in: `cdk/lib/static-site-stack.ts` lines 43-50

**CloudFront (CDN):**
- Purpose: HTTPS delivery, caching, HTTP/2+3
- Origin: S3 bucket via Origin Access Control
- Cache: CACHING_OPTIMIZED policy
- Price class: PRICE_CLASS_100 (North America & Europe)
- Defined in: `cdk/lib/static-site-stack.ts` lines 71-93

**ACM (Certificate Manager):**
- Purpose: TLS certificate for HTTPS
- Domains: mitchellmeffert.com, www.mitchellmeffert.com
- Validation: DNS via Route 53
- Defined in: `cdk/lib/static-site-stack.ts` lines 59-63

**Route 53 (DNS):**
- Purpose: Domain DNS management
- Hosted Zone: mitchellmeffert.com (looked up at deploy time)
- Records: A records aliased to CloudFront
- Defined in: `cdk/lib/static-site-stack.ts` lines 53-104

**Lambda (Serverless):**
- Purpose: Contact form processing
- Function: `mitchellmeffert-website-contact-form`
- Runtime: Node.js 24.x
- Trigger: Function URL (public, no auth)
- URL Pattern: `https://*.lambda-url.us-east-1.on.aws/`
- Defined in: `cdk/lib/static-site-stack.ts` lines 147-184, `cdk/lambda/contact-form/index.js`

**SES (Email):**
- Purpose: Sending contact form emails
- Sender: mitchell@mitchellmeffert.com
- Receiver: mitchell@mitchellmeffert.com
- Client: `@aws-sdk/client-ses`
- Defined in: `cdk/lambda/contact-form/index.js` lines 1, 130-152

**Secrets Manager:**
- Purpose: Store reCAPTCHA API key securely
- Secret: `mitchellmeffert-website/recaptcha-api-key`
- Client: `@aws-sdk/client-secrets-manager`
- Defined in: `cdk/lib/static-site-stack.ts` lines 141-145, `cdk/lambda/contact-form/index.js` lines 21-29

**IAM (Identity):**
- GitHub OIDC Provider: `token.actions.githubusercontent.com`
- Role: `mitchellmeffert-website-github-actions`
- Permissions: S3 read/write, CloudFront invalidation, CloudFormation describe
- Defined in: `cdk/lib/static-site-stack.ts` lines 106-136

## Google Cloud

**reCAPTCHA Enterprise:**
- Purpose: Spam protection for contact form
- Project ID: `mitchellmeffertcom`
- Site Key: `6LclXjYsAAAAAOGddQLVaLNDsjXeDfajOgJtvdfD`
- Score Threshold: 0.5
- Action: `contact_submit`
- API Endpoint: `https://recaptchaenterprise.googleapis.com/v1/projects/{project}/assessments`
- Frontend: `index.html` lines 6, 31
- Backend: `cdk/lambda/contact-form/index.js` lines 95-128

## GitHub

**Actions OIDC:**
- Purpose: CI/CD deployment without stored credentials
- Provider: `token.actions.githubusercontent.com`
- Audience: `sts.amazonaws.com`
- Subject: `repo:MMeffert/mitchellmeffert.com:*`
- Workflow: `.github/workflows/deploy.yml`

**Dependabot:**
- Purpose: Automated dependency updates
- Ecosystems: npm, github-actions
- Schedule: Weekly (Mondays)
- Auto-merge: Minor/patch versions
- Config: `.github/dependabot.yml`

## CDN/External Assets

**Frontend Libraries (bundled locally):**
- jQuery 3.x - `js/jquery.min.js`
- Bootstrap 5.x - `js/bootstrap.min.js`, `css/bootstrap.min.css`
- Popper.js - `js/popper.min.js`

**External Scripts:**
- Google reCAPTCHA Enterprise JS: `https://www.google.com/recaptcha/enterprise.js`
- Loaded in: `index.html` line 6

## Environment Configuration

**Required AWS Resources (pre-existing):**
- Route 53 Hosted Zone for mitchellmeffert.com
- GitHub OIDC Provider in AWS account
- SES verified identity for mitchell@mitchellmeffert.com

**Required Secrets:**
- AWS Secrets Manager: `mitchellmeffert-website/recaptcha-api-key` (Google API key)
- GitHub Secrets: `AWS_ROLE_ARN` (IAM role ARN for deployments)

**CDK Stack Outputs:**
- `S3BucketName` - Bucket for sync operations
- `CloudFrontDistributionId` - For cache invalidation
- `CloudFrontDomainName` - Distribution endpoint
- `GitHubActionsRoleArn` - Role ARN for CI/CD
- `WebsiteUrl` - Final website URL
- `ContactFormUrl` - Lambda Function URL

## Data Flow

**Website Request:**
1. User requests mitchellmeffert.com
2. Route 53 resolves to CloudFront
3. CloudFront serves from cache or fetches from S3
4. Response delivered over HTTPS (HTTP/2 or HTTP/3)

**Contact Form Submission:**
1. User fills form on website
2. reCAPTCHA Enterprise generates token (client-side)
3. Form + token POSTed to Lambda Function URL
4. Lambda fetches API key from Secrets Manager
5. Lambda validates token with reCAPTCHA Enterprise API
6. If valid (score >= 0.5), Lambda sends email via SES
7. Success/error response returned to client

## Webhooks & Callbacks

**Incoming:**
- Lambda Function URL accepts POST from website origin only
- CORS restricted to: `https://mitchellmeffert.com`, `https://www.mitchellmeffert.com`

**Outgoing:**
- Lambda to Google reCAPTCHA API (assessment creation)
- Lambda to AWS SES (email sending)

## Monitoring & Observability

**Logging:**
- Lambda: CloudWatch Logs (automatic)
- CloudFront: Standard logging disabled (not configured)

**Error Tracking:**
- None configured (console.log/console.error only)

**Metrics:**
- CloudFront: Standard metrics (automatic)
- Lambda: Standard metrics (automatic)
- S3: Standard metrics (automatic)

---

*Integration audit: 2025-01-19*
