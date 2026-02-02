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

export interface ContactFormConfig {
  senderEmail: string;
  receiverEmail: string;
  recaptchaProjectId: string;
  recaptchaSiteKey: string;
  recaptchaScoreThreshold?: number;
}

export interface StaticSiteStackProps extends cdk.StackProps {
  siteName: string;
  domain: string;
  githubRepo: string;
  subdomains?: string[];
  contactForm?: ContactFormConfig;
}

export class StaticSiteStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;
  public readonly githubActionsRole: iam.Role;
  public readonly contactFormFunction?: lambda.Function;
  public readonly contactFormUrl?: lambda.FunctionUrl;

  constructor(scope: Construct, id: string, props: StaticSiteStackProps) {
    super(scope, id, props);

    const { siteName, domain, githubRepo, subdomains = ['www'], contactForm } = props;

    // S3 Bucket for static content
    this.bucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: `${siteName}-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      enforceSSL: true,
    });

    // Get hosted zone
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: domain,
    });

    // ACM Certificate
    const domainNames = [domain, ...subdomains.map(sub => `${sub}.${domain}`)];
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: domain,
      subjectAlternativeNames: domainNames.slice(1),
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // CloudFront Origin Access Control
    const oac = new cloudfront.S3OriginAccessControl(this, 'OAC', {
      signing: cloudfront.Signing.SIGV4_ALWAYS,
    });

    // CloudFront Function for URL normalization and redirects
    const wwwRedirectFunction = new cloudfront.Function(this, 'WwwRedirectFunction', {
      functionName: `${siteName}-www-redirect`,
      comment: 'URL normalization: www redirect, query string stripping, /index.html redirect',
      code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;
  var uri = request.uri;

  // Redirect www to non-www
  if (host.startsWith('www.')) {
    var newHost = host.substring(4);
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        'location': { value: 'https://' + newHost + uri }
      }
    };
  }

  // Redirect /index.html to /
  if (uri === '/index.html') {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        'location': { value: 'https://' + host + '/' }
      }
    };
  }

  // Strip query strings (static site doesn't use them)
  if (Object.keys(request.querystring).length > 0) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        'location': { value: 'https://' + host + uri }
      }
    };
  }

  return request;
}
      `),
    });

    // Response Headers Policy for security headers
    const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(this, 'ResponseHeadersPolicy', {
      responseHeadersPolicyName: `${siteName}-security-headers`,
      comment: 'Security headers for portfolio site',
      securityHeadersBehavior: {
        contentTypeOptions: { override: true },
        frameOptions: {
          frameOption: cloudfront.HeadersFrameOption.DENY,
          override: true,
        },
        referrerPolicy: {
          referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
          override: true,
        },
        strictTransportSecurity: {
          accessControlMaxAge: cdk.Duration.seconds(31536000),
          includeSubdomains: true,
          preload: true,
          override: true,
        },
        xssProtection: {
          protection: true,
          modeBlock: true,
          override: true,
        },
      },
    });

    // CloudFront Distribution
    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket, {
          originAccessControl: oac,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
        responseHeadersPolicy: responseHeadersPolicy,
        functionAssociations: [{
          function: wwwRedirectFunction,
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
      },
      domainNames: domainNames,
      certificate: certificate,
      defaultRootObject: 'index.html',
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });

    // DNS Records
    domainNames.forEach((domainName, index) => {
      new route53.ARecord(this, `AliasRecord${index}`, {
        zone: hostedZone,
        recordName: domainName,
        target: route53.RecordTarget.fromAlias(
          new route53Targets.CloudFrontTarget(this.distribution)
        ),
      });
    });

    // GitHub Actions OIDC Role
    const githubProvider = `token.actions.githubusercontent.com`;
    this.githubActionsRole = new iam.Role(this, 'GitHubActionsRole', {
      roleName: `${siteName}-github-actions`,
      assumedBy: new iam.WebIdentityPrincipal(
        `arn:aws:iam::${this.account}:oidc-provider/${githubProvider}`,
        {
          StringEquals: {
            [`${githubProvider}:aud`]: 'sts.amazonaws.com',
          },
          StringLike: {
            [`${githubProvider}:sub`]: `repo:${githubRepo}:*`,
          },
        }
      ),
    });

    // Grant permissions to GitHub Actions role
    this.bucket.grantReadWrite(this.githubActionsRole);
    this.githubActionsRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['cloudfront:CreateInvalidation'],
        resources: [`arn:aws:cloudfront::${this.account}:distribution/${this.distribution.distributionId}`],
      })
    );
    this.githubActionsRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['cloudformation:DescribeStacks'],
        resources: [
          `arn:aws:cloudformation:${this.region}:${this.account}:stack/${siteName}-stack/*`
        ],
      })
    );

    // Contact Form Lambda (optional)
    if (contactForm) {
      // Reference the existing secret for reCAPTCHA API key
      const recaptchaSecret = secretsmanager.Secret.fromSecretNameV2(
        this,
        'RecaptchaApiKeySecret',
        'mitchellmeffert-website/recaptcha-api-key'
      );

      this.contactFormFunction = new lambda.Function(this, 'ContactFormFunction', {
        functionName: `${siteName}-contact-form`,
        runtime: lambda.Runtime.NODEJS_24_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/contact-form')),
        timeout: cdk.Duration.seconds(10),
        memorySize: 128,
        environment: {
          SENDER_EMAIL: contactForm.senderEmail,
          RECEIVER_EMAIL: contactForm.receiverEmail,
          EMAIL_SUBJECT: 'Contact Form Submission',
          RECAPTCHA_API_KEY_SECRET_NAME: 'mitchellmeffert-website/recaptcha-api-key',
          RECAPTCHA_PROJECT_ID: contactForm.recaptchaProjectId,
          RECAPTCHA_SITE_KEY: contactForm.recaptchaSiteKey,
          RECAPTCHA_SCORE_THRESHOLD: (contactForm.recaptchaScoreThreshold || 0.5).toString(),
        },
      });

      // Grant Lambda permission to read the reCAPTCHA API key secret
      recaptchaSecret.grantRead(this.contactFormFunction);

      // Grant SES permissions (scoped to verified domain identity)
      this.contactFormFunction.addToRolePolicy(
        new iam.PolicyStatement({
          actions: ['ses:SendEmail'],
          resources: [
            `arn:aws:ses:${this.region}:${this.account}:identity/mitchellmeffert.com`
          ],
        })
      );

      // Create Function URL with CORS
      this.contactFormUrl = this.contactFormFunction.addFunctionUrl({
        authType: lambda.FunctionUrlAuthType.NONE,
        cors: {
          allowedOrigins: [`https://${domain}`, `https://www.${domain}`],
          allowedMethods: [lambda.HttpMethod.POST],
          allowedHeaders: ['Content-Type'],
        },
      });
    }

    // Outputs
    new cdk.CfnOutput(this, 'S3BucketName', {
      value: this.bucket.bucketName,
      description: 'S3 bucket name for static content',
    });

    new cdk.CfnOutput(this, 'CloudFrontDistributionId', {
      value: this.distribution.distributionId,
      description: 'CloudFront distribution ID',
    });

    new cdk.CfnOutput(this, 'CloudFrontDomainName', {
      value: this.distribution.distributionDomainName,
      description: 'CloudFront distribution domain name',
    });

    new cdk.CfnOutput(this, 'GitHubActionsRoleArn', {
      value: this.githubActionsRole.roleArn,
      description: 'IAM role ARN for GitHub Actions',
    });

    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: `https://${domain}`,
      description: 'Website URL',
    });

    if (this.contactFormUrl) {
      new cdk.CfnOutput(this, 'ContactFormUrl', {
        value: this.contactFormUrl.url,
        description: 'Contact form Lambda Function URL',
      });
    }
  }
}
