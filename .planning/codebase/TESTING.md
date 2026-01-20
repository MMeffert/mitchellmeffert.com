# Testing Patterns

**Analysis Date:** 2026-01-19

## Test Framework

**Runner:**
- Not configured

**Assertion Library:**
- Not configured

**Run Commands:**
```bash
# No test commands available
# No test scripts defined in package.json
```

## Test File Organization

**Location:**
- No test files detected in project

**Naming:**
- Not applicable

**Structure:**
- Not applicable

## Current State

This codebase has **no automated testing**. The project consists of:

1. **Static Website Files**
   - HTML, CSS, and JavaScript served directly from S3/CloudFront
   - Third-party libraries (jQuery, Bootstrap, etc.)

2. **CDK Infrastructure** (`cdk/`)
   - TypeScript CDK stack definitions
   - No CDK test files (no `*.test.ts` or `*.spec.ts`)

3. **Lambda Function** (`cdk/lambda/contact-form/index.js`)
   - Single JavaScript handler
   - No unit tests

## Testing Recommendations

If tests were to be added, the following patterns would be appropriate:

### CDK Infrastructure Tests

**Recommended Framework:** Jest with `aws-cdk-lib/assertions`

**Setup:**
```bash
npm install --save-dev jest @types/jest ts-jest
```

**Example Test Structure:**
```typescript
// cdk/test/static-site-stack.test.ts
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { StaticSiteStack } from '../lib/static-site-stack';

describe('StaticSiteStack', () => {
  test('creates S3 bucket with correct properties', () => {
    const app = new cdk.App();
    const stack = new StaticSiteStack(app, 'TestStack', {
      siteName: 'test-site',
      domain: 'example.com',
      githubRepo: 'user/repo',
      env: { account: '123456789012', region: 'us-east-1' },
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'AES256',
            },
          },
        ],
      },
    });
  });

  test('creates CloudFront distribution', () => {
    // Test CloudFront configuration
  });

  test('creates GitHub Actions IAM role', () => {
    // Test IAM role configuration
  });
});
```

### Lambda Function Tests

**Recommended Framework:** Jest

**Example Test Structure:**
```javascript
// cdk/lambda/contact-form/index.test.js
const { handler } = require('./index');

// Mock AWS SDK clients
jest.mock('@aws-sdk/client-ses', () => ({
  SESClient: jest.fn(() => ({
    send: jest.fn(),
  })),
  SendEmailCommand: jest.fn(),
}));

jest.mock('@aws-sdk/client-secrets-manager', () => ({
  SecretsManagerClient: jest.fn(() => ({
    send: jest.fn().mockResolvedValue({ SecretString: 'mock-api-key' }),
  })),
  GetSecretValueCommand: jest.fn(),
}));

describe('Contact Form Handler', () => {
  test('returns 400 when reCAPTCHA verification fails', async () => {
    // Mock fetch for reCAPTCHA
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({
        tokenProperties: { valid: false },
      }),
    });

    const event = {
      body: JSON.stringify({
        name: 'Test',
        email: 'test@example.com',
        message: 'Hello',
        recaptchaToken: 'invalid-token',
      }),
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(400);
  });

  test('sends email when all validations pass', async () => {
    // Test successful email flow
  });
});
```

### End-to-End Tests

**Recommended Framework:** Playwright or Cypress

**What to Test:**
- Contact form submission flow
- Page navigation
- Responsive design breakpoints

## Coverage

**Requirements:** None enforced

**View Coverage:**
```bash
# Not configured
```

## Test Types

**Unit Tests:**
- Not implemented

**Integration Tests:**
- Not implemented

**E2E Tests:**
- Not implemented

## Manual Testing Approach

Current testing is performed manually:

1. **Local Development:**
   - Open `index.html` directly in browser
   - Test contact form against deployed Lambda

2. **CDK Changes:**
   - Run `npm run synth` to verify template generation
   - Review CloudFormation template diff with `npm run diff`
   - Deploy to production with `npm run deploy`

3. **GitHub Actions:**
   - Push to `main` branch triggers deployment
   - Monitor GitHub Actions workflow for errors
   - Verify site at https://mitchellmeffert.com after deployment

## CI/CD Validation

While no automated tests exist, the deployment workflow in `.github/workflows/deploy.yml` provides some validation:

1. AWS credentials via OIDC authentication
2. S3 sync operation (fails on permission errors)
3. CloudFront cache invalidation

---

*Testing analysis: 2026-01-19*
