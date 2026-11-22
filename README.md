# ajgiou — Portfolio Website

A one-page portfolio website that shows my GitHub projects automatically.

It is built with plain HTML, CSS and JavaScript. There are no special tools to install and nothing to build — the files work exactly as they are.

## What each file does

| File | What it does |
| --- | --- |
| `index.html` | The page itself — the text, the sections, the structure |
| `css/style.css` | The look — colors, spacing, sizes, dark mode |
| `js/app.js` | The working parts — loads the projects, the dark/light switch, the phone menu |
| `.nojekyll` | A tiny empty helper file for GitHub Pages (explained below) |

Keep the folder shape as it is: `style.css` lives inside the `css` folder and `app.js` lives inside the `js` folder.

## How the projects list works

The Projects section is not written by hand. When someone opens the page, it quietly asks GitHub's public directory: "what has this person made public?" GitHub sends back the list, and the page fills in the cards — name, description, language, stars, forks and a link.

That means:

- Add a new public project on GitHub and it appears on the page by itself.
- Nothing here needs editing when a project changes.

## Things to know:

- About `.nojekyll`: it tells GitHub to skip some behind-the-scenes processing it normally does with uploaded files. Your computer may hide files whose names start with a dot — if you cannot drag it in, create it on github.com instead: click **Add file → Create new file**, type `.nojekyll` as the name, leave it empty, and save.
- The page needs internet when it loads. It borrows two free style helpers (Bootstrap and Normalize) from the web, and it reads the project list from GitHub's public directory.
- If the Projects section ever says it could not load, it is usually one of three things: no internet, a slow connection, or GitHub briefly limiting how many times the same internet connection asked (this resets within the hour). The **Retry** button tries again, and **View on GitHub** always works as a backup.
- The dark/light switch remembers the visitor's choice in their own browser. On a first visit it follows whatever their device is set to.
- No passwords, no accounts, no databases, no tracking. The page only reads public information that GitHub already shows everyone.
