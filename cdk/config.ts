import { SiteConfig } from '@roundhouse/static-site-cdk';
import * as cdk from 'aws-cdk-lib';

/**
 * Configuration for mitchellmeffert.com static website.
 *
 * This configuration uses the @roundhouse/static-site-cdk package to deploy:
 * - Private S3 bucket with encryption and versioning
 * - CloudFront distribution with HTTPS and security headers
 * - ACM certificate with automatic DNS validation
 * - WAF with rate limiting and managed rules
 * - GitHub Actions IAM role for CI/CD deployments
 */
export const config: SiteConfig = {
  // Site name used for resource naming (S3 bucket, IAM roles, etc.)
  siteName: 'mitchellmeffert-website',

  // Primary domain name (must be in Route 53 in the same account)
  domain: 'mitchellmeffert.com',

  // AWS account ID for deployment
  awsAccount: '241654197557',

  // GitHub repository in "org/repo" format for OIDC authentication
  githubRepo: 'MMeffert/mitchellmeffert.com',

  // AWS region (us-east-1 is required for CloudFront/ACM)
  awsRegion: 'us-east-1',

  // Subdomains to include in the SSL certificate
  subdomains: ['www'],

  // Default document to serve
  defaultRootObject: 'index.html',

  // WAF configuration for rate limiting
  waf: {
    enabled: true,
    rateLimit: 100, // Requests per 5 minutes per IP
    enableManagedRules: true,
  },

  // Environment tag
  environment: 'production',

  // Custom resources function to add proper AWS tagging
  customResources: (stack: cdk.Stack, siteConfig: SiteConfig) => {
    // Add required AWS resource tags per CLAUDE.md standards
    cdk.Tags.of(stack).add('Application', 'mitchellmeffert-website');
    cdk.Tags.of(stack).add('Environment', 'production');
    cdk.Tags.of(stack).add('ManagedBy', 'cdk');
    cdk.Tags.of(stack).add('Repository', 'MMeffert/mitchellmeffert.com');
  },
};
