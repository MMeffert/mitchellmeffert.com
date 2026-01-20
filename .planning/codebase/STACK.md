# Technology Stack

**Analysis Date:** 2025-01-19

## Languages

**Primary:**
- TypeScript 5.x - CDK infrastructure code (`cdk/`)
- JavaScript ES2020 - Lambda functions (`cdk/lambda/`)
- HTML5 - Static website content (`index.html`)
- CSS3 - Styling (`css/`)

**Secondary:**
- JSON - Configuration files (`package.json`, `cdk.json`, `tsconfig.json`)
- YAML - GitHub Actions workflows (`.github/workflows/`)

## Runtime

**Environment:**
- Node.js 24.x - Lambda runtime (specified in `cdk/lib/static-site-stack.ts` line 149)
- Node.js 18+ - CDK CLI requirement (from `package-lock.json`)

**Package Manager:**
- npm
- Lockfile: `cdk/package-lock.json` (present, lockfileVersion 3)

## Frameworks

**Core:**
- AWS CDK v2.170.0 - Infrastructure as Code (`cdk/package.json`)
- Bootstrap 5.x - Frontend CSS framework (`css/bootstrap.min.css`, `js/bootstrap.min.js`)
- jQuery - DOM manipulation and AJAX (`js/jquery.min.js`)

**Frontend Libraries:**
- Owl Carousel - Image carousel (`js/owl.carousel.min.js`)
- Isotope - Layout filtering (`js/isotope.js`)
- Magnific Popup - Lightbox (`js/jquery.magnific-popup.min.js`)
- Typed.js - Typing animation (`js/typed.js`)
- Animate.css - CSS animations (`css/animate.min.css`)

**Build/Dev:**
- ts-node 10.9.x - TypeScript execution (`cdk/package.json`)
- TypeScript 5.x - Type checking and compilation

## Key Dependencies

**Critical (CDK - `cdk/package.json`):**
- `aws-cdk-lib` ^2.170.0 - Core AWS CDK constructs
- `constructs` ^10.0.0 - CDK construct base class
- `source-map-support` ^0.5.21 - Stack trace support

**Dev Dependencies:**
- `@types/node` ^25.0.3 - Node.js type definitions
- `aws-cdk` ^2.170.0 - CDK CLI
- `typescript` ^5.0.0 - TypeScript compiler
- `ts-node` ^10.9.0 - TypeScript execution

**Lambda Runtime (implicit via Node.js 24):**
- `@aws-sdk/client-ses` - SES email sending (native in Node 24 Lambda)
- `@aws-sdk/client-secrets-manager` - Secrets access (native in Node 24 Lambda)
- Native `fetch` API - HTTP requests (Node 24 native)

## Configuration

**TypeScript (`cdk/tsconfig.json`):**
- Target: ES2020
- Module: CommonJS
- Strict mode enabled
- Source maps inline

**CDK (`cdk/cdk.json`):**
- App command: `npx ts-node app.ts`
- Modern CDK feature flags enabled
- Minimized IAM policies
- Security-first defaults (Block public access, SSL enforcement)

**Environment Variables (Lambda):**
- `SENDER_EMAIL` - SES sender address
- `RECEIVER_EMAIL` - Contact form recipient
- `EMAIL_SUBJECT` - Email subject line
- `RECAPTCHA_API_KEY_SECRET_NAME` - Secrets Manager key name
- `RECAPTCHA_PROJECT_ID` - Google Cloud project ID
- `RECAPTCHA_SITE_KEY` - reCAPTCHA site key
- `RECAPTCHA_SCORE_THRESHOLD` - Spam threshold (default 0.5)

## Build Commands

**CDK (`cdk/package.json`):**
```bash
npm run build      # tsc - Compile TypeScript
npm run synth      # cdk synth - Generate CloudFormation
npm run diff       # cdk diff - Preview changes
npm run deploy     # cdk deploy - Deploy to AWS
npm run destroy    # cdk destroy - Tear down stack
npm run bootstrap  # cdk bootstrap - Initialize CDK in account
```

## Platform Requirements

**Development:**
- Node.js 18+
- npm
- AWS CLI configured with profile `personal`
- AWS account 241654197557

**Production:**
- AWS Account: 241654197557
- Region: us-east-1
- CloudFront + S3 static hosting
- Lambda Function URL for contact form
- Route 53 hosted zone for mitchellmeffert.com

## CI/CD

**GitHub Actions:**
- Deploy workflow: `.github/workflows/deploy.yml`
- Dependabot auto-merge: `.github/workflows/dependabot-auto-merge.yml`
- OIDC authentication to AWS (no stored credentials)

**Dependabot (`.github/dependabot.yml`):**
- Weekly npm updates for `/cdk`
- Weekly GitHub Actions updates
- Auto-merge for minor/patch versions

---

*Stack analysis: 2025-01-19*
