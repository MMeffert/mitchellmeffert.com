#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StaticSiteStack } from './lib/static-site-stack';

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
const app = new cdk.App();

// Add required AWS resource tags
const tags = {
  Application: 'mitchellmeffert-website',
  Environment: 'production',
  ManagedBy: 'cdk',
  Repository: 'MMeffert/mitchellmeffert.com',
};

const stack = new StaticSiteStack(app, 'mitchellmeffert-website-stack', {
  siteName: 'mitchellmeffert-website',
  domain: 'mitchellmeffert.com',
  githubRepo: 'MMeffert/mitchellmeffert.com',
  subdomains: ['www'],
  contactForm: {
    senderEmail: 'mitchell@mitchellmeffert.com',
    receiverEmail: 'mitchell@mitchellmeffert.com',
    recaptchaApiKey: 'AIzaSyDXAFGDMtjVIC75aVOLIa-7Y9bwlJGhbWs',
    recaptchaProjectId: 'mitchellmeffertcom',
    recaptchaSiteKey: '6LclXjYsAAAAAOGddQLVaLNDsjXeDfajOgJtvdfD',
    recaptchaScoreThreshold: 0.5,
  },
  env: {
    account: '241654197557',
    region: 'us-east-1',
  },
});

// Apply tags to all resources
Object.entries(tags).forEach(([key, value]) => {
  cdk.Tags.of(stack).add(key, value);
});

app.synth();
