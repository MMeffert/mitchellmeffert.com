# Phase 6: Content Update - Research

**Researched:** 2026-01-20
**Domain:** Static HTML content updates
**Confidence:** HIGH

## Summary

Phase 6 involves straightforward HTML content updates to the existing `index.html` file. The current codebase uses a Bootstrap-based static HTML template with inline content - no CMS, database, or content management system is involved.

The updates required are:
1. About section text updates (tenure at Roundhouse, add AWS/cloud and Claude Code/AI expertise)
2. Skills section restructure (replace percentage bars with list/badge format, add new skills)
3. Stats counter updates (increment numbers for years worked, business ownership, computer experience)
4. Add GitHub profile link to hero section social icons
5. Re-enable and implement resume download button

**Primary recommendation:** Direct HTML edits to `index.html` with attention to maintaining existing styling conventions and Bootstrap 5 classes.

## Standard Stack

This phase requires no additional libraries - all changes are content/markup only.

### Core (Already Present)
| Library | Version | Purpose | Used For |
|---------|---------|---------|----------|
| Bootstrap | 5.x | CSS Framework | Grid, utilities, badges |
| Material Design Icons | 7.x | Icon Font | Social media icons (mdi-github-circle) |

### No New Dependencies Required

All content updates use existing HTML structures and CSS classes. No JavaScript changes needed except potentially enabling the commented-out resume button.

## Architecture Patterns

### Current Content Structure

```
index.html
├── Hero Section (#home)
│   ├── Social icons list (ul.social_home)
│   └── Download Resume button (commented out)
├── About Section (#about)
│   ├── Bio paragraph (p.text-muted)
│   └── Skills bars (div.progress-bars.skill-custom)
└── Funfacts Section (.bg-funfact)
    └── Counter cards (data-count attributes)
```

### Pattern 1: Social Icon Links

**What:** Social links follow a consistent pattern in hero and footer
**Current pattern:**
```html
<li class="list-inline-item">
  <a href="[URL]" target="_blank" rel="noopener noreferrer">
    <i class="mdi mdi-[icon-name]"></i>
  </a>
</li>
```

**For GitHub:** Use `mdi-github-circle` (verified present in CSS)

### Pattern 2: Skills Display Options

**Current (percentage bars):**
```html
<div class="progress-bars skill-custom">
  <div class="clearfix">
    <div class="text-dark fw-bold float-start">Development</div>
    <div class="text-muted float-end">80%</div>
  </div>
  <div class="progress">
    <div class="progress-bar" role="progressbar" style="width: 80%"></div>
  </div>
</div>
```

**Recommended (Bootstrap 5 badges):**
```html
<div class="skills-badges text-center">
  <span class="badge bg-dark m-1 p-2">AWS</span>
  <span class="badge bg-dark m-1 p-2">Cloud Architecture</span>
  <span class="badge bg-dark m-1 p-2">Claude Code/AI</span>
  <span class="badge bg-dark m-1 p-2">Development</span>
  <span class="badge bg-dark m-1 p-2">WordPress</span>
  <!-- ... -->
</div>
```

**Rationale:** Percentage bars imply precise self-assessment which is awkward. Badges/list format shows capability breadth without arbitrary percentages.

### Pattern 3: Stats Counter

**Current structure:**
```html
<h1 class="lan_fun_value mb-1" data-count="17">17</h1>
<p class="lan_fun_name mb-0">Years Worked</p>
```

**Update approach:** Change both the `data-count` attribute AND the visible text content.

### Pattern 4: Resume Download Button

**Currently commented out in hero section:**
```html
<!--<div class="header_btn">
    <a href="#" class="btn btn-outline-custom btn-rounded mt-4">Download Resume</a>
</div> -->
```

**Required:** Add PDF file and update href.

### Anti-Patterns to Avoid

- **Percentage bars for skills:** Arbitrary percentages (80%, 75%, etc.) are awkward and invite comparison questions
- **Outdated date references:** "last 6 years" becomes outdated; consider relative phrasing like "nearly a decade"
- **Missing social links:** GitHub is expected for a technical professional's portfolio

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Badge styling | Custom CSS | Bootstrap `badge` classes | Already in framework |
| Icon library | Custom SVGs | Material Design Icons (already loaded) | Consistent with existing |
| PDF hosting | External service | S3 static asset | Same deployment pipeline |

## Common Pitfalls

### Pitfall 1: Inconsistent Skill Formatting

**What goes wrong:** Skills displayed differently in About section vs elsewhere
**Why it happens:** Template had progress bars; changing format needs consistent approach
**How to avoid:** Replace ALL skill progress bars with badge format in single task
**Warning signs:** Multiple div structures with different skill display patterns

### Pitfall 2: Forgetting data-count Attribute

**What goes wrong:** Counter animation starts from old number but ends at new number (or vice versa)
**Why it happens:** Stats use both visible text AND `data-count` attribute for JS animation
**How to avoid:** Update BOTH the displayed number and the data-count attribute
**Warning signs:** Counter animates to wrong number on page load

### Pitfall 3: Resume PDF Not Deployed

**What goes wrong:** Download button links to missing file
**Why it happens:** PDF added locally but not included in deployment
**How to avoid:** Verify PDF exists in images/ or root, test after deploy
**Warning signs:** 404 on resume download

### Pitfall 4: Broken Social Icon

**What goes wrong:** GitHub icon doesn't display
**Why it happens:** Wrong icon class name used
**How to avoid:** Use verified `mdi-github-circle` class
**Warning signs:** Missing icon in social links row

### Pitfall 5: Mobile Layout Issues

**What goes wrong:** Badge layout wraps poorly on mobile
**Why it happens:** Too many badges or badges too wide
**How to avoid:** Keep badge text concise, test responsive views
**Warning signs:** Badges stack in single column or overflow

## Code Examples

### GitHub Social Link (Verified)

```html
<!-- Add to ul.social_home in hero section AND ul.fot_social in footer -->
<li class="list-inline-item">
  <a href="https://github.com/mitchellmeffert" target="_blank" rel="noopener noreferrer">
    <i class="mdi mdi-github-circle"></i>
  </a>
</li>
```

### Badge-Based Skills Section

```html
<div class="row mt-5">
  <div class="col-lg-12">
    <div class="text-center">
      <span class="badge bg-dark m-1 px-3 py-2">AWS</span>
      <span class="badge bg-dark m-1 px-3 py-2">Cloud Architecture</span>
      <span class="badge bg-dark m-1 px-3 py-2">Claude Code/AI</span>
      <span class="badge bg-dark m-1 px-3 py-2">Development</span>
      <span class="badge bg-dark m-1 px-3 py-2">WordPress</span>
      <span class="badge bg-dark m-1 px-3 py-2">Photoshop</span>
      <span class="badge bg-dark m-1 px-3 py-2">HTML/CSS</span>
      <span class="badge bg-dark m-1 px-3 py-2">Visual Basic</span>
      <span class="badge bg-dark m-1 px-3 py-2">.NET Framework</span>
    </div>
  </div>
</div>
```

### Updated Stats Values

```html
<!-- Years Worked: 17 -> 19 -->
<h1 class="lan_fun_value mb-1" data-count="19">19</h1>

<!-- Business Ownership: 12 -> 14 -->
<h1 class="lan_fun_value mb-1" data-count="14">14</h1>

<!-- Computer Experience: 26 -> 29 -->
<h1 class="lan_fun_value mb-1" data-count="29">29</h1>

<!-- Websites Managed: stays 30 -->
```

### Resume Download Button (Uncommented)

```html
<div class="header_btn">
  <a href="MitchellMeffert-Resume.pdf" class="btn btn-outline-custom btn-rounded mt-4" download>
    Download Resume
  </a>
</div>
```

### Updated About Paragraph

```html
<p class="text-muted mt-3">
  I am a graduate of University of Wisconsin - Whitewater where I received a
  Bachelor of Business Administration degree with an emphasis in entrepreneurship.
  I am the owner of a small website design and hosting company called
  Meffert Web Hosting LLC, hosting websites for various organizations and businesses
  stretching as far as Brazil. I have vast experience in servers, networking, hardware,
  software, server virtualization, and AWS cloud computing. I leverage AI-powered
  development tools like Claude Code to accelerate development workflows.
  My breadth of programming languages includes HTML, CSS, SQL, PHP, Python, and VB.NET.
  I have been working as a Web Developer/IT Lead at Roundhouse for nearly a decade.
</p>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Skill percentages | Skill badges/lists | 2020s trend | More honest representation |
| Static year counts | Relative phrasing | Evergreen best practice | Content ages better |

**Deprecated/outdated:**
- Percentage-based skill bars: Imply false precision in self-assessment

## Open Questions

1. **Resume PDF availability**
   - What we know: Success criteria requires working download button
   - What's unclear: Does Mitchell have a current PDF resume to include?
   - Recommendation: Task should include placeholder instruction; actual PDF provided by user

2. **GitHub username**
   - What we know: Need to add GitHub link to social icons
   - What's unclear: Exact GitHub username/profile URL
   - Recommendation: Assume `github.com/mitchellmeffert` based on naming pattern; verify with user

3. **Exact phrasing preferences**
   - What we know: General guidance on tenure, expertise areas
   - What's unclear: Exact word choice for About paragraph
   - Recommendation: Provide draft in plan, expect user refinement

## Specific Content Values

Based on context and requirements:

| Field | Current Value | New Value | Source |
|-------|---------------|-----------|--------|
| Roundhouse tenure | "last 6 years" | "nearly a decade" | PROJECT.md |
| Years Worked stat | 17 | 19 | PROJECT.md |
| Business Ownership stat | 12 | 14 | PROJECT.md |
| Computer Experience stat | 26 | 29 | PROJECT.md |
| Websites Managed stat | 30 | 30 (no change) | PROJECT.md |

Skills to add:
- AWS
- Cloud Architecture
- Claude Code/AI

Skills to keep:
- Development
- WordPress
- Photoshop
- HTML
- Visual Basic
- .NET Framework

## Sources

### Primary (HIGH confidence)
- `/Users/mitchellmeffert/Git/Personal/mitchellmeffert.com/index.html` - Current site structure
- `/Users/mitchellmeffert/Git/Personal/mitchellmeffert.com/css/style.css` - Current styling
- `/Users/mitchellmeffert/Git/Personal/mitchellmeffert.com/.planning/PROJECT.md` - Content requirements

### Secondary (HIGH confidence)
- `/Users/mitchellmeffert/Git/Personal/mitchellmeffert.com/css/materialdesignicons.min.css` - Icon availability (mdi-github-circle verified)

## Metadata

**Confidence breakdown:**
- Content structure: HIGH - Direct examination of source files
- Icon availability: HIGH - Verified in CSS file
- Badge pattern: HIGH - Bootstrap 5 standard component
- Content values: HIGH - Specified in PROJECT.md

**Research date:** 2026-01-20
**Valid until:** Indefinite (static content patterns)

## Implementation Notes

This is the simplest phase technically - all changes are in a single file (`index.html`) with no JavaScript logic changes, no CSS modifications needed, and no build process involved.

**Estimated scope:**
- 1 file modified: `index.html`
- 1 file added: Resume PDF (user-provided)
- ~5 distinct edit locations in HTML
- No testing framework needed; visual verification sufficient

**Task decomposition suggestion:**
1. About section content updates (paragraph text)
2. Skills section restructure (replace bars with badges)
3. Stats number updates (4 values, 3 change)
4. GitHub social link addition (2 locations: hero + footer)
5. Resume download button (uncomment + add file)
