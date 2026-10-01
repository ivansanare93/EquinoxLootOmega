# Equinox Herramientas: Guide for Codex Agents

## Project Overview

`EquinoxLootOmega` is a web application for a World of Warcraft guild. It provides a loot manager, roster signup and attendance tooling, Mythic+ group organization, a WoW-themed selection wheel, and a Blizzard API demo.

Keep changes scoped to the requested tool or workflow. This repository contains several independently useful pages that share deployment and Firebase configuration but do not share a frontend framework.

## Architecture

### Frontend

- Static, multi-page browser application under `client/`.
- Plain HTML, CSS, and browser JavaScript. There is no frontend framework or bundler.
- Firebase SDK modules are loaded from the Firebase CDN by the relevant pages.
- Firebase Firestore provides shared browser-side data. Some features also use `localStorage` for local state and recovery.
- The wheel under `client/ruleta/` is organized into data, core, UI, and feature modules. Other major tools have more inline JavaScript inside their HTML pages.

### Backend

- Node.js and Express source lives in `src/`.
- `src/server.js` loads environment configuration, serves `public/`, mounts `/api`, and owns the health endpoint.
- `src/routes/api.js` exposes Blizzard-related HTTP endpoints.
- `src/services/blizzardAuth.js` manages Battle.net client-credentials OAuth tokens.
- `src/services/blizzardApi.js` calls Blizzard's WoW Game Data API and caches responses in memory.

Do not move Blizzard credentials or OAuth logic into browser code. The backend is the boundary that protects Blizzard secrets.

## Important Paths

```text
EquinoxLootOmega/           Repository root
  AGENTS.md                 Codex agent instructions
  client/                   Static frontend source
    index.html              Tools dashboard
    LarancioOrtegaLoot.html + app.js + data.js
                            Loot Manager
    roster-signup.html      Roster, seasons, attendance, Firebase Auth UI
    mythic-plus-groups.html
                            Mythic+ group organizer
    api-demo.html           Blizzard backend API demo
    api-config.js           Versioned local API URL configuration
    ruleta/                 Modular wheel application
  src/
    server.js               Express composition and static hosting
    routes/api.js           Blizzard API routes
    services/               OAuth and Blizzard API client
  scripts/
    generate-firebase-config.js
    generate-api-config.js
    test-*.js               Manual/integration-oriented checks
  docs/                     Setup, deployment, API and historical notes
  .github/workflows/
    deploy-pages.yml        Static frontend deployment workflow
  package.json              npm scripts and dependencies
```

## Technologies

- Node.js, Express, Axios, CORS, dotenv, node-cache.
- Vanilla browser JavaScript, HTML, CSS, Canvas for the wheel.
- Firebase Firestore and Firebase Auth via Firebase JavaScript SDK 9.22.0 CDN modules.
- GitHub Actions and GitHub Pages for static frontend deployment.

Use Node.js 20 or newer. Although `package.json` currently declares `>=14`, the locked `rimraf` version requires Node 20 or `>=22`.

## Install, Run, and Build

From the repository root:

```powershell
npm ci
```

Local configuration requires:

- `.env`, based on `.env.example`, with `BLIZZARD_CLIENT_ID` and `BLIZZARD_CLIENT_SECRET` for the backend.
- `client/firebase-config.js` for Firebase, which is intentionally local and ignored by Git.
- `client/api-config.js` is versioned and supplies `http://localhost:3000` to the API demo.

```powershell
npm run build:local
npm start
```

`npm start` runs `build:local` and then starts Express. The application is served from `http://localhost:3000` when `PORT` is left at its default.

## Local and Production Behavior

### Local

`npm run build:local` copies frontend files, the local Firebase configuration, and `client/api-config.js` into `public/`. The API demo therefore calls `http://localhost:3000` by default.

### Production

GitHub Pages serves only the contents of `public/`; it cannot run Express. The Express backend must be deployed independently at an HTTPS URL and configured with its Blizzard secrets in that backend environment.

`npm run build` creates production configuration files in `public/`:

- `firebase-config.js` from these six required environment variables: `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, and `FIREBASE_APP_ID`.
- `api-config.js` from the optional `API_BASE_URL` environment variable.

The GitHub Pages workflow provides `API_BASE_URL` through the optional GitHub Actions variable `vars.API_BASE_URL`. If it is omitted, the build still succeeds and the API demo is explicitly disabled. If it is set, use the absolute public URL of the independently deployed Express backend, for example `https://api.example.com`.

`client/api-demo.html` loads `api-config.js` and uses `window.EQUINOX_CONFIG.apiBaseUrl`. Do not hardcode a production API URL or `localhost` in that page.

## Responsibilities and Secret Handling

- Keep `BLIZZARD_CLIENT_ID` and `BLIZZARD_CLIENT_SECRET` only in backend environment configuration. Never expose them in `client/`, `public/`, generated browser configuration, documentation examples with real values, or commits.
- Firebase web configuration is browser-visible by design, but Firestore access control must be enforced through Firebase project rules. Do not treat client-side checks as authorization.
- Browser pages call the Express API only through the configured API base URL. They must not call Blizzard OAuth or Game Data endpoints with protected credentials directly.
- Keep API route validation, caching, external API calls, and OAuth in `src/`. Keep rendering, form interactions, and browser persistence in `client/`.
- Do not change CORS, authentication, Firestore rules, Blizzard API behavior, or cache endpoints unless the requested task explicitly covers them.

## Existing Conventions

- Use CommonJS in the Node.js backend (`require`, `module.exports`).
- Keep backend layering as `server -> routes -> services`.
- The frontend predominantly uses direct DOM manipulation and event listeners. Preserve existing page-local patterns when changing a page.
- Escape untrusted values before inserting them with `innerHTML`; prefer `textContent` or DOM construction where practical.
- The wheel relies on ordered classic script tags in `client/ruleta/index.html`; preserve that dependency order.
- `public/` is build output and is ignored. Edit `client/` and build scripts, not generated output.
- Do not mix unrelated refactors into a feature or fix.

## npm Commands

| Command | Use |
| --- | --- |
| `npm start` | Build local static files and run Express. |
| `npm run dev` | Run Express through nodemon; build `public/` first if required. |
| `npm run build:static` | Recreate `public/` from static frontend sources. |
| `npm run build:local` | Build static files and copy local Firebase and API configuration. |
| `npm run build` | Production static build; requires the six `FIREBASE_*` values. `API_BASE_URL` is optional. |
| `npm run build:firebase-config` | Generate `public/firebase-config.js` for production. |
| `npm run build:api-config` | Generate `public/api-config.js` for production. |
| `npm run test:api` | Run manual API integration checks against a running local server. |
| `npm run test:filtered-loot` | Run filtered-loot integration checks against a running local server. |

`npm test` is currently only a placeholder and is not a meaningful automated test suite. The `scripts/test-*.js` checks are manual or integration-oriented and may require a server and real credentials.

## Verification Expectations

After a scoped code change, run the relevant checks without changing unrelated files:

```powershell
git diff --check
npm run build:local
```

For changes affecting GitHub Pages production output, run `npm run build` with safe test values for the six `FIREBASE_*` variables both without `API_BASE_URL` and with an absolute test URL, then inspect the generated configurations. For backend route or Blizzard service changes, run the applicable integration script only when a configured local server is available.

Before handing work over, inspect `git status --short`. Preserve any existing user changes. Do not create commits, amend commits, stage unrelated files, or run destructive Git commands unless explicitly requested.
