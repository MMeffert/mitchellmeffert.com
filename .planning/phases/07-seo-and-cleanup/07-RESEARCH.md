# Phase 7: SEO and Cleanup - Research

**Researched:** 2026-01-20
**Domain:** SEO meta tags, HTML cleanup, static site optimization
**Confidence:** HIGH

## Summary

This research covers two main domains: (1) SEO meta tag optimization to reflect the site owner's current AWS/cloud/AI expertise, and (2) cleanup of dead code and unused files from the site modernization. The site has undergone significant modernization (Bootstrap 5, vanilla JS, jQuery removed) and content updates (AWS/Claude Code expertise highlighted), but the meta tags still reflect older positioning and several unused files remain.

The current meta description ("Web Developer, Programmer, and Business Owner. Specializing in web development, cloud computing, and IT solutions with over 15 years of experience.") is outdated - it should reflect AWS certifications, cloud architecture expertise, and AI-assisted development which are now prominently featured in the About section. The cleanup is straightforward: remove two identified unused JS files (71KB total), remove the commented-out Services section (85 lines), and verify no broken internal links exist.

**Primary recommendation:** Update meta description to emphasize AWS/cloud/AI expertise (150-160 chars), verify OG image dimensions match 1200x630 recommendation, remove `bootstrap.min.js` and `popper.min.js` from `/js/`, and strip the commented-out Services section.

## Standard Stack

This phase requires no new libraries - it's purely content/cleanup work.

### Core Tools
| Tool | Purpose | Why Standard |
|------|---------|--------------|
| HTML meta tags | SEO optimization | Native browser/crawler support |
| Open Graph protocol | Social sharing previews | Facebook/LinkedIn/Twitter standard |
| Twitter Cards | Twitter-specific sharing | X platform standard |

### Supporting (Optional)
| Tool | Purpose | When to Use |
|------|---------|-------------|
| JSON-LD structured data | Schema.org Person markup | Enhanced search results, knowledge panels |
| Google Rich Results Test | Validation | Post-implementation verification |
| Facebook Sharing Debugger | OG tag validation | Social share preview testing |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual meta editing | SEO plugin/generator | Overkill for static single-page site |
| JSON-LD Person schema | None | Nice-to-have for enhanced search results |

## Architecture Patterns

### Meta Tags Structure (Current vs Recommended)

**Current structure (lines 78-100 of index.html):**
```html
<title>Mitchell Meffert | Web Developer, Programmer & Business Owner</title>
<meta name="description" content="Mitchell Meffert - Web Developer, Programmer, and Business Owner. Specializing in web development, cloud computing, and IT solutions with over 15 years of experience." />
<meta name="keywords" content="Mitchell Meffert, web developer, programmer, cloud computing, AWS, web design, IT solutions, WordPress, .NET, virtualization" />
```

**Recommended structure:**
```html
<title>Mitchell Meffert | AWS Cloud Architect & Web Developer</title>
<meta name="description" content="AWS-certified cloud architect and web developer with 19+ years experience. Specializing in cloud solutions, AI-powered development with Claude Code, and enterprise web applications." />
<meta name="keywords" content="Mitchell Meffert, AWS, cloud architect, solutions architect, Claude Code, AI development, Python, serverless, web developer, Madison Wisconsin" />
```

### OG Image Requirements

**Current image:** `images/code-background.png` (2000 x 1333 pixels, 467KB)
- Aspect ratio: 1.50:1 (close to 1.91:1 standard but not exact)
- Size: Acceptable but could be optimized

**Recommended:** 1200 x 630 pixels (1.91:1 ratio)
- This is the universal standard that works across Facebook, Twitter, LinkedIn, Slack, Discord
- Current image may be cropped unexpectedly on some platforms

### Files to Remove

```
js/
├── bootstrap.bundle.min.js  # KEEP - actively used (Bootstrap 5)
├── bootstrap.min.js         # DELETE - unused (Bootstrap 4 legacy, 51KB)
├── popper.min.js            # DELETE - unused (standalone Popper, 20KB)
└── custom.js                # KEEP - main application code
```

### HTML Sections to Remove

```
Lines 224-308: Commented-out Services section
<!--<section class="section bg-light" id="services">
    ... 85 lines of dead code ...
</section> -->
```

### Anti-Patterns to Avoid
- **Keyword stuffing:** Don't cram keywords into meta description - write naturally for humans
- **Duplicate meta tags:** Each page should have unique description (single-page site, so N/A)
- **Missing og:image dimensions:** Always include `og:image:width` and `og:image:height` for faster rendering
- **Overly long descriptions:** Keep meta description under 160 characters to avoid truncation

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OG image testing | Manual browser checks | Facebook Sharing Debugger, Twitter Card Validator | Shows exact rendering across platforms |
| Meta description length | Character counting | Browser dev tools or SEO tools | Accurate SERP preview |
| Structured data validation | Manual JSON review | Google Rich Results Test | Catches schema.org errors |
| Dead link detection | Manual clicking | Browser developer tools network tab | Shows 404s automatically |

**Key insight:** SEO testing tools are free and authoritative - use them for verification rather than guessing.

## Common Pitfalls

### Pitfall 1: Meta Description Too Long
**What goes wrong:** Search engines truncate descriptions, cutting off mid-sentence
**Why it happens:** Desktop shows ~155-160 chars, mobile shows ~120 chars
**How to avoid:** Keep primary message in first 120 characters
**Warning signs:** Descriptions over 160 characters in code

### Pitfall 2: OG Image Cropping
**What goes wrong:** Important content (text, faces) gets cut off on social shares
**Why it happens:** Each platform crops differently; LinkedIn uses 1.91:1, Facebook varies
**How to avoid:** Use 1200x630, keep focal point centered
**Warning signs:** Image not 1.91:1 aspect ratio

### Pitfall 3: Stale Cached OG Data
**What goes wrong:** Social platforms show old meta data even after updates
**Why it happens:** Aggressive caching by Facebook, LinkedIn, Twitter
**How to avoid:** Use platform debuggers to refresh cache after deployment
**Warning signs:** Social shares showing old title/description/image

### Pitfall 4: Missing OG Image Dimensions
**What goes wrong:** Slower rendering of social share previews
**Why it happens:** Platform must download image to determine size
**How to avoid:** Include `og:image:width` and `og:image:height` meta tags
**Warning signs:** Missing dimension meta tags

### Pitfall 5: Removing Wrong Files
**What goes wrong:** Site breaks after cleanup
**Why it happens:** File appeared unused but was loaded dynamically or conditionally
**How to avoid:** Verify no references exist before deletion; test after removal
**Warning signs:** File referenced anywhere in HTML/CSS/JS

## Code Examples

### Updated Meta Tags
```html
<!-- Source: Adapted from current index.html with updated content -->
<title>Mitchell Meffert | AWS Cloud Architect & Web Developer</title>
<meta name="description" content="AWS-certified cloud architect and web developer with 19+ years experience. Specializing in cloud solutions, AI-powered development, and enterprise applications." />
<meta name="keywords" content="Mitchell Meffert, AWS, cloud architect, solutions architect, Claude Code, AI development, Python, serverless, web developer" />
<meta name="author" content="Mitchell Meffert" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://mitchellmeffert.com/" />
<meta property="og:title" content="Mitchell Meffert | AWS Cloud Architect & Web Developer" />
<meta property="og:description" content="AWS-certified cloud architect with 19+ years experience. Cloud solutions, AI-powered development, enterprise applications." />
<meta property="og:image" content="https://mitchellmeffert.com/images/code-background.png" />
<meta property="og:image:width" content="2000" />
<meta property="og:image:height" content="1333" />
<meta property="og:image:alt" content="Code background representing Mitchell Meffert's technical expertise" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://mitchellmeffert.com/" />
<meta name="twitter:title" content="Mitchell Meffert | AWS Cloud Architect & Web Developer" />
<meta name="twitter:description" content="AWS-certified cloud architect with 19+ years experience. Cloud solutions, AI-powered development, enterprise applications." />
<meta name="twitter:image" content="https://mitchellmeffert.com/images/code-background.png" />
<meta name="twitter:image:alt" content="Code background representing Mitchell Meffert's technical expertise" />
```

### Optional: Person Schema JSON-LD
```html
<!-- Source: schema.org/Person -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Mitchell Meffert",
  "url": "https://mitchellmeffert.com",
  "image": "https://mitchellmeffert.com/images/code-background.png",
  "jobTitle": "AWS Cloud Architect & Web Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Roundhouse Marketing"
  },
  "sameAs": [
    "https://www.linkedin.com/in/mitchellmeffert",
    "https://github.com/mitchellmeffert",
    "https://www.facebook.com/mitchell.meffert",
    "https://www.instagram.com/mitchellmeffert"
  ],
  "knowsAbout": ["AWS", "Cloud Architecture", "Web Development", "Python", "AI Development"]
}
</script>
```

### File Deletion Commands
```bash
# Remove unused JS files identified in Phase 5 verification
rm js/bootstrap.min.js   # 51KB - Bootstrap 4 legacy
rm js/popper.min.js      # 20KB - Standalone Popper (bundled in bootstrap.bundle.min.js)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Keywords meta tag | Ignored by Google | ~2009 | Still useful for other engines, low priority |
| Meta description always shown | Google rewrites 62%+ | 2024-2025 | Write for humans, not just SERP manipulation |
| twitter:card only | X falls back to og: tags | Ongoing | Can use og: tags alone if Twitter-specific not needed |
| Manual social preview testing | Platform debugger tools | Standard | Free, authoritative testing |

**Deprecated/outdated:**
- **Keywords meta tag:** Google ignores it, but Bing/others may use it - keep minimal
- **Photo cards / Gallery cards:** Twitter deprecated, mapped to summary_large_image

## Open Questions

Things that couldn't be fully resolved:

1. **OG Image Optimization**
   - What we know: Current image is 2000x1333 (467KB), standard is 1200x630
   - What's unclear: Whether to resize/crop current image or create new one
   - Recommendation: Current image works but could be optimized; resize if time permits

2. **Person Schema Value**
   - What we know: Can enhance search results with knowledge panels
   - What's unclear: Whether Google will use it for personal portfolio sites
   - Recommendation: Optional enhancement - implement if time permits

3. **CSS Dead Code**
   - What we know: `header_img.jpg` and `bottom-color.png` referenced in CSS don't exist
   - What's unclear: Whether these CSS selectors (`.header_section`, `.creative:after`) are used
   - Recommendation: Leave CSS as-is (unused selectors cause no harm); could audit in future

## Sources

### Primary (HIGH confidence)
- [The Open Graph protocol](https://ogp.me/) - Authoritative OG tag specification
- [Twitter/X Developer Docs - Summary Card with Large Image](https://developer.x.com/en/docs/x-for-websites/cards/overview/summary-card-with-large-image) - Twitter Card specifications
- [Schema.org Person](https://schema.org/Person) - Structured data vocabulary
- Phase 5 Verification Report - Identified unused files (bootstrap.min.js, popper.min.js)

### Secondary (MEDIUM confidence)
- [Straight North - How to Optimize Title Tags & Meta Descriptions in 2026](https://www.straightnorth.com/blog/title-tags-and-meta-descriptions-how-to-write-and-optimize-them-in-2026/) - Current SEO practices
- [OG Image Size Guide 2026](https://myogimage.com/blog/og-image-size-meta-tags-complete-guide) - Image dimension recommendations
- [LinkedIn Advice - Meta descriptions in portfolio](https://www.linkedin.com/advice/0/how-can-you-effectively-write-meta-descriptions) - Portfolio-specific guidance
- [Yoast - How to create a good meta description](https://yoast.com/meta-descriptions/) - Meta description best practices

### Tertiary (LOW confidence)
- WebSearch results for AWS portfolio examples - Adapted resume summaries, not verified for SEO

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Native HTML meta tags, well-documented standards
- Architecture: HIGH - Simple file cleanup with verified unused files from Phase 5
- Pitfalls: HIGH - Well-known SEO issues documented across multiple sources

**Research date:** 2026-01-20
**Valid until:** 2026-03-20 (60 days - SEO best practices stable)
