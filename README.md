# ajgiou — Portfolio Website

A one-page portfolio that stays in sync with my public GitHub profile automatically.

It is built with plain HTML, CSS and JavaScript — **no frameworks, no build step, no external dependencies**. The files work exactly as they are; the only network requests are to the public GitHub API for live data.

## What each file does

| File | What it does |
| --- | --- |
| `index.html` | The page itself — the text, the sections, the structure |
| `css/style.css` | The design system — tokens, reset, layout, components, dark mode |
| `js/app.js` | The working parts — GitHub data, theme switch, mobile menu, language filter, reveal-on-scroll |

## Features

- **Live GitHub data** — profile name, bio, avatar, location, repo/follower counts, and the full public repository list are fetched from the GitHub API and rendered on load.
- **Language filter** — flat, Metro-style toggle tiles let visitors filter projects by language; each tile shows a count, the result line updates, and the state is exposed via `aria-pressed`.
- **Dark / light theme** — a square toggle switches themes; the choice is remembered per browser. Until a choice is made, the page follows the operating system setting (including live changes). The correct theme is applied before first paint, so there is no flash.
- **Responsive, fluid layout** — typography and section rhythm scale continuously with the viewport (`clamp()`), the repository grid moves 1 → 2 → 3 columns, and the About section stacks on small screens. Navigation collapses into an accessible hamburger menu with Escape/outside-click to close.
- **Scroll-spy navigation** — the menu highlights the section currently in view.
- **Reveal-on-scroll** — sections fade in subtly as they enter the viewport. It is a progressive enhancement: without JavaScript, or with "reduce motion" enabled, all content is simply visible.
- **Loading and error states** — skeleton cards while data loads, a friendly retry panel if the API fails, and session caching so reloads do not hit the rate limit.
- **Accessible by design** — skip link, semantic landmarks, live regions for dynamic content, visible focus styles, 44px minimum touch targets, and full `prefers-reduced-motion` support.

## How the projects list works

The Projects section is not written by hand. When someone opens the page, it asks GitHub's public API what this person has published, then fills in the cards — name, description, language, stars, forks and a link — sorted by stars.

Responses are cached in the browser's session storage for 10 minutes, so reloading the page or re-filtering does not spend the hourly API budget.

That means:

- Add a new public project on GitHub and it appears on the page by itself.
- Nothing here needs editing when a project changes.

## Privacy

No passwords, no accounts, no databases, no tracking, no third-party scripts. The page only reads public information that GitHub already shows everyone.

## What changed in this revision

- Removed the Bootstrap and Normalize.css CDN dependencies (~200 KB); the stylesheet now includes a small purpose-built reset, so the "vanilla HTML, CSS & JavaScript" claim is literally true and the page renders fully offline.
- Fixed the `hidden` attribute bug where empty stat tiles could stay visible when profile data was unavailable.
- Replaced stepped breakpoint typography with fluid `clamp()` scales and a shared spacing token.
- Added the language filter for projects, session caching of GitHub responses, theme syncing with the OS, reveal-on-scroll, keyboard focus states on project cards, and a theme-aware favicon.
- Reorganized `style.css` into a documented, token-driven design system aligned with the Metro Monochrome guide.
