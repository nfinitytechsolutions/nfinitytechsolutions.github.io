# Project Status

## Completed
- [x] Product lineup swapped for ELEVATE Shakti 2026 pitch (2026-07-06)
  - Removed InfraGuardAI and AI PageBuilder cards from `index.html` products section
  - Added single **PV ICSR Assistant** card in the same format (image: `images/safety_systems.jpg`), linking to https://pv.nfinityinfotech.com
  - Products grid now renders one centered card (max-width 680px)
  - Nav dropdown + footer links updated on `index.html`, `privacypolicy.html`, `termsofuse.html` (no remaining links to old product pages)
  - Products section subtitle updated: "infrastructure" → "regulatory" challenges
  - Old pages `infraguardai.html` / `aipagebuilder.html` left in repo but unlinked (still reachable by direct URL)
  - Verified in-browser: card renders, dropdown + Learn More both point to pv.nfinityinfotech.com

- [x] Intro logo splash on `index.html`
  - Copied `C:\Users\ADMIN\Videos\logo.mp4` into project root as `logo.mp4`
  - Rotating logo video plays centered on a full-screen dark backdrop on page open
  - Logo then flies from center to the top-left header slot (lands on the real header logo)
  - Dark background covers both the video and the fly-to-corner animation
  - Page is revealed and fully usable afterward; scroll is locked only during the intro
  - Safeguards: respects `prefers-reduced-motion`, skips on video load error, hard 10s timeout
  - Added tagline "human judgment over AI systems" under the rotating logo (fades in, fades out on fly-up)
  - Intro backdrop set to pure black `#000000`
  - Verified in-browser: centered playback, corner landing, clean reveal

- [x] Fixed favicon 404
  - Generated `favicon.ico` (16/32/48/64 multi-res), `favicon-32x32.png`, `favicon-16x16.png`, `apple-touch-icon.png` from `logo_new.png` (gold "N")
  - Added `<link rel="icon">` / `apple-touch-icon` tags to all 7 root HTML pages
  - Verified in-browser: `GET /favicon.ico` now returns 200, no console errors

## In Progress
- [ ] (none)

## Next Steps
- [ ] Optional: gate the splash to once-per-session via `sessionStorage` if replay-on-every-load is unwanted
- [ ] Optional: compress `logo.mp4` (currently ~18 MB, 1920x1080, 6.4s) for faster first paint
