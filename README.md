# E2E Test Automation PoC

Proof of concept for end-to-end test automation using **Playwright**, **Cucumber**, and **TypeScript**.

## Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | Browser automation |
| [Cucumber](https://cucumber.io/) | BDD test definitions in plain English |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe test code |
| [pixelmatch](https://github.com/mapbox/pixelmatch) | Visual regression testing |
| XRAY | Test result reporting in Jira |

## Project Structure

```
e2e-poc/
├── features/                          # Test definitions (Gherkin)
│   ├── login.feature                  # Login scenarios
│   ├── part-viewer.feature            # 3D Part Viewer scenarios
│   └── step_definitions/
│       ├── login.steps.ts             # Login step implementations
│       └── part-viewer.steps.ts       # Part Viewer step implementations
├── pages/                             # Page Object Model
│   ├── LoginPage.ts                   # Login page interactions
│   ├── PartViewerPage.ts              # Part Viewer interactions
│   └── VisualHelper.ts                # Screenshot comparison utility
├── utils/
│   ├── SessionManager.ts              # Clears user sessions via backoffice
│   └── jwt.ts                         # JWT token decoder
├── reports/                           # Auto-generated (git-ignored)
│   ├── cucumber-report.json           # Test results for XRAY
│   ├── login-success.png              # Screenshot: successful login
│   ├── login-error.png                # Screenshot: failed login
│   └── screenshots/
│       ├── baseline/                  # Reference screenshots
│       ├── actual/                    # Screenshots from latest run
│       └── diff/                      # Pixel difference images
├── .env                               # Local credentials (git-ignored)
├── .env.example                       # Template for required variables
├── cucumber.js                        # Cucumber configuration
└── package.json                       # Dependencies and scripts
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)

## Setup

**1. Clone the repository**
```bash
git clone https://dev.azure.com/BAMDigitalServices/up2partsCloud/_git/e2e-poc
cd e2e-poc
```

**2. Install dependencies**
```bash
npm install
```

**3. Install Playwright browsers**
```bash
npx playwright install chromium
```

**4. Configure environment variables**

Copy `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
```

Required variables:
```
TEST_USERNAME=         # Test user email
TEST_PASSWORD=         # Test user password
TEST_USER_SUB=         # Auth0 user ID (found in backoffice Edit User page)
BASE_URL=              # Cloud app URL (e.g. https://cloud.dev.up2parts.com)
BASE_URL_CLOUD=        # Same as BASE_URL
BASE_URL_BACKOFFICE=   # Backoffice URL (e.g. https://backoffice.dev.up2parts.com)
BACKOFFICE_USERNAME=   # Backoffice login email
BACKOFFICE_PASSWORD=   # Backoffice login password
XRAY_CLIENT_ID=        # XRAY Cloud API client ID
XRAY_CLIENT_SECRET=    # XRAY Cloud API client secret
```

## Running Tests

**Run all tests**
```bash
npm test
```

**Push results to XRAY** (requires XRAY credentials in `.env`)
```bash
npm run xray
```

## Test Scenarios

### Login (`features/login.feature`)

| Tag | Scenario |
|---|---|
| `@TEST_XSP-001` | Successful login with valid credentials |
| `@TEST_XSP-002` | Failed login with invalid credentials |

### 3D Part Viewer (`features/part-viewer.feature`)

| Tag | Scenario |
|---|---|
| `@TEST_XSP-003` | Back machining side updates the 3D viewer |
| `@TEST_XSP-004` | Top machining side updates the 3D viewer |
| `@TEST_XSP-005` | Bottom machining side updates the 3D viewer |
| `@TEST_XSP-006` | Left machining side updates the 3D viewer |

## Visual Testing

The 3D Part Viewer tests use pixel-by-pixel screenshot comparison:

- **First run** — baseline screenshots are created automatically in `reports/screenshots/baseline/`
- **Subsequent runs** — actual screenshots are compared against baselines; the test fails if more than 100 pixels differ
- **Diff images** — saved to `reports/screenshots/diff/` showing changed pixels highlighted in red

**To reset baselines** (e.g. after an intentional UI change):
```bash
# Reset a single baseline
del reports\screenshots\baseline\back-view.png

# Reset all baselines
del reports\screenshots\baseline\*.png
```

Re-run `npm test` to recreate them.

## Architecture Decisions

**Page Object Model** — each page of the application has its own class (`LoginPage.ts`, `PartViewerPage.ts`). If a selector changes in the app, it is fixed in one place only.

**Tagged hooks** — `Before`/`After` hooks are scoped to specific scenario tags (`@login`, `@part-viewer`) so they only run for relevant tests.

**Session management** — before each part-viewer test, active sessions are cleared via the backoffice to avoid hitting the session limit.

**Credentials** — stored in `.env` locally and as pipeline secret variables in Azure DevOps. Never committed to Git.

## Findings & Recommendations for Full Rollout

- The Playwright + Cucumber + TypeScript stack is validated and works well for this application
- Page Object Model scales well — adding new pages follows the same pattern
- Visual testing with pixelmatch is effective for catching 3D viewer regressions; baseline management process should be defined for the team (who approves baseline updates)
- Session management needs a direct API solution long-term; the current backoffice UI approach adds ~10-15 seconds per test
- Azure DevOps pipeline is the next step to enable CI execution
- XRAY integration is ready — only API credentials needed to activate
- Test data (part names, user IDs) should be moved to a shared config file as coverage expands
