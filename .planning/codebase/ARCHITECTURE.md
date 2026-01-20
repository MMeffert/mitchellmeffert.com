# Architecture

**Analysis Date:** 2026-01-19

## Pattern Overview

**Overall:** Static Website with Serverless Backend

**Key Characteristics:**
- Single-page portfolio website served from S3/CloudFront
- Serverless contact form via Lambda Function URL
- Infrastructure-as-Code using AWS CDK
- CI/CD via GitHub Actions with OIDC authentication

## Layers

**Presentation Layer (Static Site):**
- Purpose: Render portfolio website in browser
- Location: `/` (root directory)
- Contains: HTML, CSS, JavaScript, images, fonts
- Depends on: Bootstrap 4, jQuery, third-party libraries
- Used by: End users via CloudFront

**Infrastructure Layer (CDK):**
- Purpose: Define and deploy AWS infrastructure
- Location: `cdk/`
- Contains: TypeScript CDK stack definitions
- Depends on: aws-cdk-lib, constructs
- Used by: Manual deployment and GitHub Actions

**Backend Layer (Lambda):**
- Purpose: Handle contact form submissions
- Location: `cdk/lambda/contact-form/`
- Contains: Node.js Lambda function
- Depends on: AWS SDK (SES, Secrets Manager), reCAPTCHA Enterprise API
- Used by: Frontend contact form via Function URL

**CI/CD Layer:**
- Purpose: Automated deployment on push to main
- Location: `.github/workflows/`
- Contains: GitHub Actions workflow definitions
- Depends on: AWS OIDC, CloudFormation outputs
- Used by: GitHub on push events

## Data Flow

**Static Content Flow:**

1. User requests `https://mitchellmeffert.com`
2. CloudFront receives request, checks cache
3. Cache miss: CloudFront fetches from S3 via Origin Access Control
4. Response served with appropriate cache headers

**Contact Form Submission Flow:**

1. User fills form, triggers `submitToAPI()` in `index.html`
2. Frontend requests reCAPTCHA Enterprise token
3. AJAX POST to Lambda Function URL with form data + token
4. Lambda validates reCAPTCHA via Google API
5. Lambda sends email via SES
6. Success/error response returned to browser

**Deployment Flow:**

1. Push to `main` branch triggers workflow
2. GitHub Actions assumes IAM role via OIDC
3. Workflow syncs static files to S3
4. CloudFront cache invalidated

**State Management:**
- No client-side state management library
- Form state handled via jQuery DOM manipulation
- Lambda uses module-level cache for reCAPTCHA API key

## Key Abstractions

**StaticSiteStack:**
- Purpose: Encapsulates all infrastructure for a static site
- Examples: `cdk/lib/static-site-stack.ts`
- Pattern: CDK Construct with configurable props
- Creates: S3 bucket, CloudFront, ACM cert, Route 53 records, IAM role, Lambda (optional)

**ContactFormConfig:**
- Purpose: Configuration interface for contact form Lambda
- Examples: `cdk/lib/static-site-stack.ts` (lines 14-20)
- Pattern: TypeScript interface for type-safe configuration

## Entry Points

**Website:**
- Location: `index.html`
- Triggers: Browser navigation to domain
- Responsibilities: Single HTML file serving entire portfolio site

**CDK App:**
- Location: `cdk/app.ts`
- Triggers: `npm run deploy` or `cdk deploy`
- Responsibilities: Instantiate stack with configuration, apply tags

**Lambda Handler:**
- Location: `cdk/lambda/contact-form/index.js`
- Triggers: HTTP POST to Lambda Function URL
- Responsibilities: Validate reCAPTCHA, send email via SES

**GitHub Workflow:**
- Location: `.github/workflows/deploy.yml`
- Triggers: Push to main, manual dispatch
- Responsibilities: Sync files to S3, invalidate CloudFront

## Error Handling

**Strategy:** Graceful degradation with user feedback

**Patterns:**
- Contact form: Try/catch with user-facing error messages
- Lambda: Structured JSON responses with statusCode and reason
- reCAPTCHA: Specific error handling for token validation vs score threshold

## Cross-Cutting Concerns

**Logging:**
- Lambda uses `console.log/error` (CloudWatch Logs)
- No frontend logging beyond browser console

**Validation:**
- Frontend: Regex validation for name (2+ chars) and email format
- Backend: reCAPTCHA Enterprise score threshold (default 0.5)

**Authentication:**
- No user authentication
- GitHub Actions uses OIDC for AWS access
- Lambda Function URL is publicly accessible (reCAPTCHA provides protection)

**Security:**
- S3: BlockPublicAccess, encryption, enforceSSL
- CloudFront: HTTPS redirect, HTTP/2+3
- Lambda: Secrets Manager for reCAPTCHA API key
- CORS: Restricted to domain origins

---

*Architecture analysis: 2026-01-19*
