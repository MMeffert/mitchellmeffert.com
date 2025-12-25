#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StaticSiteStack } from '@roundhouse/static-site-cdk';
import { config } from './config';

/**
 * CDK app that deploys mitchellmeffert.com static website infrastructure.
 *
 * This creates:
 * - Private S3 bucket with encryption and versioning
 * - CloudFront distribution with HTTPS and security headers
 * - ACM certificate with automatic DNS validation via Route 53
 * - WAF with rate limiting (100 req/5min) and AWS managed rules
 * - GitHub Actions IAM role for CI/CD deployments via OIDC
 *
 * Prerequisites:
 * 1. Domain mitchellmeffert.com must be in Route 53 (same account)
 * 2. GitHub OIDC provider must be configured in AWS account
 * 3. CDK must be bootstrapped: npm run bootstrap
 *
 * Deploy with: npm run deploy
 */
const app = new cdk.App();

new StaticSiteStack(app, `${config.siteName}-stack`, config);

app.synth();
