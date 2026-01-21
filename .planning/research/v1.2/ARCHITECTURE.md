# Architecture Research: Performance & SEO

**Project:** mitchellmeffert.com
**Researched:** 2026-01-21
**Confidence:** HIGH (verified against AWS CDK docs and official sources)

## Executive Summary

Performance and SEO optimizations for this S3/CloudFront static site integrate cleanly with the existing architecture. The current setup already includes HTTP/2+3, compression, and basic caching. The primary work involves:

1. **CDK enhancements** - Adding a Response Headers Policy for security headers and SEO-relevant headers
2. **Static file additions** - robots.txt, sitemap.xml, and inline JSON-LD structured data
3. **Build pipeline updates** - Differentiated caching strategies by file type
4. **Image optimization** - WebP conversion for existing images

The existing architecture is well-suited for these optimizations. No fundamental changes are needed - only configuration additions and content files.

## Current Architecture Analysis

### Existing CloudFront Configuration (from CDK stack)

```typescript
// Current configuration strengths
- viewerProtocolPolicy: REDIRECT_TO_HTTPS
- cachePolicy: CACHING_OPTIMIZED
- compress: true
- httpVersion: HTTP2_AND_3
- priceClass: PRICE_CLASS_100
```

**What's already optimized:**
- HTTPS redirection at edge (saves round-trip)
- Brotli/gzip compression enabled
- HTTP/2 and HTTP/3 support
- Default caching policy with intelligent compression

**What's missing:**
- Response Headers Policy (security + SEO headers)
- Cache-Control granularity by content type
- robots.txt and sitemap.xml
- Structured data (JSON-LD)
- WebP image format

### Current GitHub Actions Deploy (from workflow)

```yaml
# Current caching strategy
--cache-control "max-age=31536000,public"  # All files: 1 year
--cache-control "max-age=300,public"        # HTML only: 5 minutes
```

**Current approach:** Good differentiation between HTML and static assets, but could be refined.

## Integration Points

### CloudFront Configuration Changes

#### 1. Response Headers Policy (CDK Addition)

Add a custom Response Headers Policy to the CloudFront distribution:

```typescript
// Add to static-site-stack.ts
const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(this, 'ResponseHeadersPolicy', {
  responseHeadersPolicyName: `${siteName}-headers`,
  comment: 'Security and SEO headers for static site',

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

  customHeadersBehavior: {
    customHeaders: [
      {
        header: 'X-Robots-Tag',
        value: 'index, follow',
        override: false,
      },
      {
        header: 'Permissions-Policy',
        value: 'geolocation=(), microphone=(), camera=()',
        override: true,
      },
    ],
  },
});
```

Then attach to the distribution's defaultBehavior:

```typescript
defaultBehavior: {
  // ... existing config
  responseHeadersPolicy: responseHeadersPolicy,
},
```

**Security headers included:**
| Header | Value | Purpose |
|--------|-------|---------|
| X-Content-Type-Options | nosniff | Prevents MIME sniffing |
| X-Frame-Options | DENY | Prevents clickjacking |
| Referrer-Policy | strict-origin-when-cross-origin | Privacy protection |
| Strict-Transport-Security | max-age=31536000; includeSubdomains; preload | HSTS |
| X-XSS-Protection | 1; mode=block | XSS protection |
| X-Robots-Tag | index, follow | SEO indexing directive |
| Permissions-Policy | geolocation=(), microphone=(), camera=() | Feature restrictions |

#### 2. Alternative: Use Managed Policy

For simplicity, use AWS managed policy instead of custom:

```typescript
defaultBehavior: {
  // ... existing config
  responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
},
```

**Trade-off:** Managed policy includes security headers but not custom SEO headers like X-Robots-Tag.

**Recommendation:** Use custom policy for full control over both security and SEO headers.

### S3 Static Assets

#### File Organization

```
mitchellmeffert.com/
  index.html          # Main page (5-minute cache)
  robots.txt          # SEO (5-minute cache)
  sitemap.xml         # SEO (5-minute cache)
  css/                # Styles (1-year cache, versioned)
  js/                 # Scripts (1-year cache, versioned)
  images/             # Images (1-year cache)
    *.jpg             # Original format
    *.webp            # WebP versions (new)
  fonts/              # Font files (1-year cache)
```

#### Content Type Mapping

S3 automatically sets Content-Type based on file extension. Ensure correct types:

| Extension | Content-Type |
|-----------|--------------|
| .html | text/html |
| .css | text/css |
| .js | application/javascript |
| .json | application/json |
| .xml | application/xml |
| .webp | image/webp |
| .jpg | image/jpeg |
| .png | image/png |
| .ico | image/x-icon |
| .woff2 | font/woff2 |

### Build/Deploy Pipeline

#### Enhanced GitHub Actions Workflow

Update `.github/workflows/deploy.yml` to handle differentiated caching:

```yaml
- name: Sync files to S3
  run: |
    # Sync all files with default long cache
    aws s3 sync . s3://${{ steps.cfn.outputs.bucket_name }} \
      --delete \
      --exclude ".git/*" \
      --exclude ".github/*" \
      --exclude ".planning/*" \
      --exclude "cdk/*" \
      --exclude ".gitattributes" \
      --exclude "*.html" \
      --exclude "robots.txt" \
      --exclude "sitemap.xml" \
      --cache-control "max-age=31536000,public,immutable" \
      --metadata-directive REPLACE

    # HTML files - short cache
    aws s3 sync . s3://${{ steps.cfn.outputs.bucket_name }} \
      --exclude "*" \
      --include "*.html" \
      --cache-control "max-age=300,public" \
      --content-type "text/html; charset=utf-8" \
      --metadata-directive REPLACE

    # SEO files - short cache
    aws s3 cp robots.txt s3://${{ steps.cfn.outputs.bucket_name }}/robots.txt \
      --cache-control "max-age=300,public" \
      --content-type "text/plain" \
      --metadata-directive REPLACE

    aws s3 cp sitemap.xml s3://${{ steps.cfn.outputs.bucket_name }}/sitemap.xml \
      --cache-control "max-age=300,public" \
      --content-type "application/xml" \
      --metadata-directive REPLACE
```

**Caching strategy:**
| Content Type | Cache Duration | Rationale |
|--------------|----------------|-----------|
| HTML | 5 minutes | Changes frequently, needs quick propagation |
| CSS/JS | 1 year + immutable | Version-busted via query string |
| Images | 1 year + immutable | Rarely change |
| robots.txt | 5 minutes | May need quick updates |
| sitemap.xml | 5 minutes | Updated with content changes |

## Implementation Approach

### Build-Time Optimizations

#### 1. Image Optimization (Pre-deployment)

Convert existing images to WebP format locally or in CI:

**Option A: Local conversion (recommended for small sites)**
```bash
# Install cwebp (macOS)
brew install webp

# Convert all JPG/PNG to WebP
for f in images/**/*.{jpg,png}; do
  cwebp -q 80 "$f" -o "${f%.*}.webp"
done
```

**Option B: GitHub Actions conversion**
```yaml
- name: Convert images to WebP
  run: |
    sudo apt-get update && sudo apt-get install -y webp
    find images -type f \( -name "*.jpg" -o -name "*.png" \) | while read f; do
      cwebp -q 80 "$f" -o "${f%.*}.webp"
    done
```

**HTML usage with fallback:**
```html
<picture>
  <source srcset="images/photo.webp" type="image/webp">
  <img src="images/photo.jpg" alt="Description" width="200" height="150">
</picture>
```

#### 2. CSS Version Busting

Current approach uses query string: `style.css?v=20260120b`

**This is correct.** CloudFront respects query strings in the default cache policy. Keep this pattern.

#### 3. JSON-LD Structured Data

Add inline to `index.html` `<head>` section:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Mitchell Meffert",
  "jobTitle": "AWS Cloud Architect & Web Developer",
  "url": "https://mitchellmeffert.com",
  "sameAs": [
    "https://www.linkedin.com/in/mitchellmeffert",
    "https://github.com/MMeffert",
    "https://stackoverflow.com/users/6115073/mitchell-meffert"
  ],
  "knowsAbout": [
    "AWS",
    "Cloud Architecture",
    "Web Development",
    "Python",
    "Claude Code",
    "AI Development"
  ],
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "University of Wisconsin - Whitewater"
  },
  "worksFor": {
    "@type": "Organization",
    "name": "Roundhouse Marketing"
  }
}
</script>
```

**Placement:** Inline in `<head>` is recommended for:
- No additional HTTP request
- Parsed with initial HTML load
- Simpler deployment (no separate file to maintain)

### Infrastructure Changes

#### CDK Modifications Required

**File:** `cdk/lib/static-site-stack.ts`

**Changes:**
1. Add ResponseHeadersPolicy import
2. Create custom response headers policy
3. Attach policy to distribution's defaultBehavior

**Estimated lines changed:** ~30 lines added

**No breaking changes** - this is purely additive configuration.

#### New Static Files Required

| File | Location | Content |
|------|----------|---------|
| robots.txt | Root | Sitemap reference, crawl directives |
| sitemap.xml | Root | URL listing with lastmod dates |

**robots.txt example:**
```
User-agent: *
Allow: /

Sitemap: https://mitchellmeffert.com/sitemap.xml
```

**sitemap.xml example:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mitchellmeffert.com/</loc>
    <lastmod>2026-01-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

## Suggested Build Order

### Phase 1: Foundation (No CDK changes needed)

1. **Add robots.txt** - Simple text file, immediate SEO benefit
   - Why first: Zero risk, quick win, enables proper crawling

2. **Add sitemap.xml** - Simple XML file
   - Why second: Depends on robots.txt for discovery, enables indexing

3. **Add JSON-LD structured data to index.html**
   - Why third: Enhances search appearance, no infrastructure changes

### Phase 2: Infrastructure Enhancements (CDK changes)

4. **Add Response Headers Policy to CDK**
   - Why fourth: Requires CDK deployment, provides security + SEO headers
   - Deploy and verify headers with curl/browser dev tools

5. **Update deploy.yml caching strategy**
   - Why fifth: Refines caching, requires testing
   - Add immutable flag for static assets

### Phase 3: Asset Optimization (Optional, Higher Effort)

6. **Convert images to WebP**
   - Why sixth: Highest effort, most performance benefit
   - Requires updating HTML to use `<picture>` element
   - Test browser compatibility (all modern browsers support WebP)

7. **Add explicit width/height to images**
   - Why seventh: Prevents CLS, requires measuring images
   - Update img tags: `<img width="125" height="125" ...>`

### Phase 4: Validation & Monitoring

8. **Validate structured data**
   - Use Google Rich Results Test
   - Use JSON-LD Playground

9. **Submit sitemap to Google Search Console**
   - Requires GSC access
   - Verify indexing status

10. **Test Core Web Vitals**
    - PageSpeed Insights
    - Chrome DevTools Lighthouse
    - Target: LCP < 2.5s, CLS < 0.1

## Sources

### AWS Official Documentation
- [CloudFront Response Headers Policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/understanding-response-headers-policies.html)
- [CloudFront Managed Response Headers Policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-response-headers-policies.html)
- [Adding HTTP Security Headers](https://repost.aws/knowledge-center/cloudfront-http-security-headers)
- [AWS CDK ResponseHeadersPolicy Class](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.ResponseHeadersPolicy.html)
- [Speeding Up Websites with CloudFront](https://docs.aws.amazon.com/AmazonS3/latest/userguide/website-hosting-cloudfront-walkthrough.html)

### SEO & Structured Data
- [JSON-LD Schema Markup Guide](https://qtonix.com/blog/how-to-add-json-ld-schema-markup/)
- [Structured Data for SEO 2026](https://www.o8.agency/blog/using-structured-data-google-seo-dont-miss-out-benefits)
- [robots.txt and SEO 2026](https://searchengineland.com/robots-txt-seo-453779)
- [XML Sitemap Best Practices](https://www.searchenginejournal.com/technical-seo/xml-sitemaps/)

### Performance
- [Core Web Vitals 2026 Guide](https://senorit.de/en/blog/core-web-vitals-2026)
- [Image Performance](https://web.dev/learn/performance/image-performance)
- [WebP vs JPEG Comparison](https://imagepulser.com/blog/WebP-vs-JPEG--Which-Image-Format-Wins-in-2026)
- [CloudFront Performance Best Practices](https://aws.amazon.com/blogs/networking-and-content-delivery/improve-your-website-performance-with-amazon-cloudfront/)
