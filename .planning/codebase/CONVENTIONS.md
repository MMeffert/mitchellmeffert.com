# Coding Conventions

**Analysis Date:** 2026-01-19

## Naming Patterns

**Files:**
- TypeScript CDK files: `kebab-case.ts` (e.g., `static-site-stack.ts`)
- JavaScript files: `camelCase.js` (e.g., `contact.js`, `custom.js`)
- Lambda handlers: `index.js` within feature-named directories (e.g., `lambda/contact-form/index.js`)
- CSS files: `kebab-case.css` (e.g., `bootstrap.min.css`, `style.css`)

**Functions:**
- JavaScript: `camelCase` (e.g., `submitToAPI`, `sendEmail`, `verifyRecaptcha`)
- CDK TypeScript: `camelCase` for methods (e.g., `initPreLoader`, `initNavbarStickey`)
- Module pattern methods: `initXxx` prefix for initialization methods in `custom.js`

**Variables:**
- JavaScript: `camelCase` (e.g., `cachedApiKey`, `recaptchaResult`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `SENDER`, `RECEIVER`, `RECAPTCHA_SCORE_THRESHOLD`)
- Environment variables: `UPPER_SNAKE_CASE` (e.g., `SENDER_EMAIL`, `RECEIVER_EMAIL`)

**Types:**
- TypeScript interfaces: `PascalCase` with descriptive suffixes (e.g., `StaticSiteStackProps`, `ContactFormConfig`)
- CDK classes: `PascalCase` (e.g., `StaticSiteStack`)

## Code Style

**Formatting:**
- No Prettier or ESLint configuration detected
- 2-space indentation in TypeScript files
- 4-space indentation in JavaScript files
- Single quotes in TypeScript, mixed in JavaScript

**Linting:**
- No linting configuration detected
- TypeScript strict mode enabled via `cdk/tsconfig.json`
- Strict compiler options: `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`, `noImplicitReturns: true`

## Import Organization

**Order (TypeScript CDK):**
1. AWS CDK core imports (`aws-cdk-lib`)
2. AWS CDK service-specific imports (`aws-cdk-lib/aws-*`)
3. Node.js built-in modules (`path`)
4. Third-party constructs (`constructs`)

**Example from `cdk/lib/static-site-stack.ts`:**
```typescript
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as path from 'path';
import { Construct } from 'constructs';
```

**Path Aliases:**
- None configured

## Error Handling

**Patterns (Lambda/Backend):**
- Try-catch blocks with structured JSON error responses
- Console logging for errors with context
- HTTP status codes: 200 success, 400 client error, 500 server error

**Example from `cdk/lambda/contact-form/index.js`:**
```javascript
try {
    await sendEmail(body);
    console.log('Email sent successfully');
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: 'Success' })
    };
} catch (error) {
    console.error('Email error:', error);
    return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: 'Failed', reason: 'Email service error' })
    };
}
```

**Patterns (Frontend):**
- jQuery AJAX success/error callbacks
- User-facing error messages via DOM manipulation
- Console logging for debug information

## Logging

**Framework:** `console` (native)

**Patterns:**
- `console.log()` for informational messages
- `console.error()` for errors
- Structured logging with JSON.stringify for complex objects
- Log key events: request received, reCAPTCHA result, email sent

**Example:**
```javascript
console.log('Received event:', JSON.stringify(event));
console.log('reCAPTCHA response:', JSON.stringify(data));
console.error('reCAPTCHA error:', error);
```

## Comments

**When to Comment:**
- File headers for template attribution (e.g., `custom.js` header block)
- JSDoc-style comments for CDK app purpose (`cdk/app.ts`)
- Inline comments for configuration explanations

**JSDoc/TSDoc:**
- Used for CDK app description
- Not extensively used throughout codebase

**Example from `cdk/app.ts`:**
```typescript
/**
 * CDK app that deploys mitchellmeffert.com static website infrastructure.
 *
 * Creates:
 * - Private S3 bucket with encryption and versioning
 * - CloudFront distribution with HTTPS
 * - ACM certificate with DNS validation via Route 53
 * - GitHub Actions IAM role for CI/CD via OIDC
 *
 * Deploy with: npm run deploy
 */
```

## Function Design

**Size:** Functions are small and focused, typically under 50 lines

**Parameters:**
- Use object parameters for complex configurations (TypeScript)
- Destructure props in function body
- Optional parameters with defaults

**Return Values:**
- Lambda: Always return structured response objects with statusCode, headers, body
- Async functions: Return promises

## Module Design

**Exports (TypeScript):**
- Named exports for interfaces and classes
- Export interfaces alongside their implementations

**Example from `cdk/lib/static-site-stack.ts`:**
```typescript
export interface ContactFormConfig { ... }
export interface StaticSiteStackProps extends cdk.StackProps { ... }
export class StaticSiteStack extends cdk.Stack { ... }
```

**Exports (JavaScript):**
- CommonJS `exports.handler` for Lambda functions

**Barrel Files:**
- Not used

## CDK-Specific Conventions

**Stack Naming:**
- Use descriptive names with hyphens: `mitchellmeffert-website-stack`

**Resource Tagging:**
- Required tags: `Application`, `Environment`, `ManagedBy`, `Repository`
- Apply tags via `cdk.Tags.of(stack).add()`

**Example:**
```typescript
const tags = {
  Application: 'mitchellmeffert-website',
  Environment: 'production',
  ManagedBy: 'cdk',
  Repository: 'MMeffert/mitchellmeffert.com',
};
Object.entries(tags).forEach(([key, value]) => {
  cdk.Tags.of(stack).add(key, value);
});
```

**Outputs:**
- Use `CfnOutput` for values needed by CI/CD or other systems
- Descriptive output names: `S3BucketName`, `CloudFrontDistributionId`, `GitHubActionsRoleArn`

## Frontend JavaScript Conventions

**jQuery Usage:**
- Use jQuery for DOM manipulation and AJAX
- Selector caching with `$this = $(this)`
- Chain jQuery methods where appropriate

**Module Pattern (from `custom.js`):**
```javascript
! function($) {
    "use strict";

    var ElvishApp = function() {};

    ElvishApp.prototype.initFeature = function() {
        // Feature implementation
    },

    ElvishApp.prototype.init = function() {
        this.initFeature();
    },

    $.ElvishApp = new ElvishApp, $.ElvishApp.Constructor = ElvishApp
}(window.jQuery),

function($) {
    "use strict";
    $.ElvishApp.init();
}(window.jQuery);
```

---

*Convention analysis: 2026-01-19*
