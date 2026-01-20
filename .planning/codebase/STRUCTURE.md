# Codebase Structure

**Analysis Date:** 2026-01-19

## Directory Layout

```
mitchellmeffert.com/
├── .github/workflows/     # GitHub Actions CI/CD
├── .planning/codebase/    # GSD planning documents
├── cdk/                   # AWS CDK infrastructure
│   ├── lambda/            # Lambda function source
│   │   └── contact-form/  # Contact form handler
│   └── lib/               # CDK stack definitions
├── css/                   # Stylesheets
├── fonts/                 # Web fonts
├── images/                # Image assets
│   ├── blog/              # Blog post images
│   ├── certifications/    # Certification badges
│   ├── recommendations/   # Recommendation photos
│   └── works/             # Portfolio project images
├── js/                    # JavaScript files
├── CLAUDE.md              # AI assistant context
└── index.html             # Main website (single page)
```

## Directory Purposes

**Root (`/`):**
- Purpose: Static website content served by CloudFront
- Contains: HTML, configuration files
- Key files: `index.html` (entire website)

**`.github/workflows/`:**
- Purpose: CI/CD automation
- Contains: GitHub Actions workflow YAML
- Key files: `deploy.yml`, `dependabot-auto-merge.yml`

**`cdk/`:**
- Purpose: AWS infrastructure as code
- Contains: TypeScript CDK application
- Key files: `app.ts` (entry), `package.json`, `cdk.json`, `tsconfig.json`

**`cdk/lib/`:**
- Purpose: CDK construct definitions
- Contains: Stack classes
- Key files: `static-site-stack.ts` (main infrastructure)

**`cdk/lambda/contact-form/`:**
- Purpose: Contact form backend logic
- Contains: Node.js Lambda handler
- Key files: `index.js` (handler)

**`css/`:**
- Purpose: Styling
- Contains: Bootstrap, vendor CSS, custom styles
- Key files: `style.css` (custom), `bootstrap.min.css`

**`fonts/`:**
- Purpose: Icon fonts
- Contains: Material Design Icons, Mobirise fonts
- Key files: `materialdesignicons-webfont.*`, `mobirise.*`

**`images/`:**
- Purpose: Visual assets
- Contains: Background, favicon, organized subdirectories
- Key files: `code-background.png`, `favicon.ico`

**`js/`:**
- Purpose: Client-side functionality
- Contains: jQuery, Bootstrap, vendor libs, custom scripts
- Key files: `custom.js` (template functionality), `contact.js` (unused legacy)

## Key File Locations

**Entry Points:**
- `index.html`: Main website (single-page application)
- `cdk/app.ts`: CDK application entry point
- `cdk/lambda/contact-form/index.js`: Lambda handler

**Configuration:**
- `cdk/cdk.json`: CDK CLI configuration
- `cdk/tsconfig.json`: TypeScript compiler options
- `cdk/package.json`: CDK dependencies and scripts
- `.github/workflows/deploy.yml`: Deployment workflow

**Core Logic:**
- `cdk/lib/static-site-stack.ts`: All AWS infrastructure
- `cdk/lambda/contact-form/index.js`: Contact form processing
- `index.html` (lines 10-67): Contact form frontend logic

**Testing:**
- No test files exist in this codebase

## Naming Conventions

**Files:**
- Static assets: lowercase with hyphens (`code-background.png`)
- CDK TypeScript: kebab-case (`static-site-stack.ts`)
- Lambda: `index.js` (handler convention)
- Vendor libraries: Original names preserved (`jquery.min.js`)

**Directories:**
- All lowercase, hyphens for multi-word (`contact-form`)
- CDK follows standard layout (`lib/`, `lambda/`)

**Code:**
- TypeScript/CDK: PascalCase for classes (`StaticSiteStack`), camelCase for variables
- CSS: BEM-like classes from template (`lan_fun_value`, `work-filter`)

## Where to Add New Code

**New Page:**
- Not applicable - single-page site
- For new sections: Add to `index.html`
- New CSS: Add to `css/style.css`

**New Lambda Function:**
- Create directory: `cdk/lambda/{function-name}/`
- Add handler: `cdk/lambda/{function-name}/index.js`
- Wire in stack: `cdk/lib/static-site-stack.ts`

**New Infrastructure:**
- Add to existing stack: `cdk/lib/static-site-stack.ts`
- For new stack: Create `cdk/lib/{name}-stack.ts`, import in `cdk/app.ts`

**New Static Assets:**
- Images: `images/{category}/`
- CSS: `css/` (vendor) or modify `css/style.css` (custom)
- JS: `js/` (avoid if possible, prefer inline in `index.html`)

**New Workflow:**
- Add: `.github/workflows/{name}.yml`

## Special Directories

**`cdk/cdk.out/`:**
- Purpose: CDK synthesis output
- Generated: Yes (by `cdk synth`)
- Committed: No (gitignored)

**`cdk/node_modules/`:**
- Purpose: CDK dependencies
- Generated: Yes (by `npm install`)
- Committed: No (gitignored)

**`.planning/`:**
- Purpose: GSD command planning documents
- Generated: By Claude Code agents
- Committed: Optional (project preference)

---

*Structure analysis: 2026-01-19*
