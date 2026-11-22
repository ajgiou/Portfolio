(() => {
  "use strict";

  const GITHUB_USER = "ajgiou";
  const PROFILE_URL = `https://api.github.com/users/${GITHUB_USER}`;
  const REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`;
  const API_TIMEOUT_MS = 10000;
  const MAX_TAGS = 16;
  const DEFAULT_TAGLINE = "Developer & open-source contributor building clean, reliable software.";

  const $ = (selector, scope = document) => scope.querySelector(selector);

  const els = {
    themeToggle: $("#theme-toggle"),
    themeMeta: $('meta[name="theme-color"]'),
    navToggle: $(".nav-toggle"),
    navMenu: $("#primary-menu"),
    navLinks: Array.from(document.querySelectorAll(".menu-link")),
    sections: Array.from(document.querySelectorAll("main section[id]")),
    heroStats: $("#hero-stats"),
    statRepos: $("#stat-repos"),
    statFollowers: $("#stat-followers"),
    heroTitle: $("#hero-title"),
    heroTagline: $("#hero-tagline"),
    aboutAvatar: $("#about-avatar"),
    aboutBio: $("#about-bio"),
    factLocation: $("#fact-location"),
    factLocationValue: $("#fact-location-value"),
    repoGrid: $("#repo-grid"),
    repoStatus: $("#repo-status"),
    skillList: $("#skill-list"),
    footerYear: $("#footer-year"),
  };

  const ICONS = {
    arrow: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    star: '<svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .217-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"/></svg>',
    fork: '<svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.75h-1.5a2.25 2.25 0 0 1-2.25-2.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>'
  };

  const SKELETON_CARD =
    '<div class="repo-card repo-card--skeleton" aria-hidden="true">' +
    '<span class="skeleton skeleton--title"></span>' +
    '<span class="skeleton skeleton--line"></span>' +
    '<span class="skeleton skeleton--line skeleton--short"></span>' +
    '<span class="skeleton skeleton--meta"></span>' +
    "</div>";

  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (ch) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
    ));

  const formatNumber = (value) =>
    Intl.NumberFormat("en", { notation: value >= 1000 ? "compact" : "standard" }).format(value);

  async function fetchJSON(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/vnd.github+json" },
        signal: controller.signal
      });
      if (!response.ok) {
        const error = new Error(`GitHub API responded with status ${response.status}`);
        error.status = response.status;
        throw error;
      }
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  function initTheme() {
    if (!els.themeToggle) return;
    const apply = (theme) => {
      document.documentElement.dataset.theme = theme;
      els.themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
      els.themeMeta?.setAttribute("content", theme === "dark" ? "#000000" : "#ffffff");
    };
    apply(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    els.themeToggle.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("theme", next); } catch (error) { /* storage unavailable */ }
      apply(next);
    });
  }

  function initNavigation() {
    if (!els.navToggle || !els.navMenu) return;

    const isOpen = () => els.navMenu.classList.contains("is-open");
    const setOpen = (open) => {
      els.navMenu.classList.toggle("is-open", open);
      els.navToggle.setAttribute("aria-expanded", String(open));
    };

    els.navToggle.addEventListener("click", () => setOpen(!isOpen()));

    els.navMenu.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        setOpen(false);
        els.navToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (isOpen() && !event.target.closest(".site-header")) setOpen(false);
    });

    if ("IntersectionObserver" in window) {
      const setActiveLink = (id) => {
        els.navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      };
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveLink(entry.target.id);
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      els.sections.forEach((section) => observer.observe(section));
    }
  }

  function repoCard(repo) {
    const description = repo.description ? escapeHtml(repo.description) : "No description provided.";
    const language = repo.language
      ? `<li class="repo-card__lang"><span class="lang-dot" aria-hidden="true"></span>${escapeHtml(repo.language)}</li>`
      : "";
    return (
      `<article class="repo-card">` +
      `<h3 class="repo-card__name"><a class="repo-card__link" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(repo.name)}${ICONS.arrow}</a></h3>` +
      `<p class="repo-card__desc">${description}</p>` +
      `<ul class="repo-card__meta" aria-label="Repository stats for ${escapeHtml(repo.name)}">` +
      language +
      `<li>${ICONS.star}<span class="visually-hidden">Stars: </span>${escapeHtml(repo.stargazers_count)}</li>` +
      `<li>${ICONS.fork}<span class="visually-hidden">Forks: </span>${escapeHtml(repo.forks_count)}</li>` +
      `</ul>` +
      `</article>`
    );
  }

  function showLoadingState() {
    els.repoGrid.setAttribute("aria-busy", "true");
    els.repoGrid.innerHTML = SKELETON_CARD.repeat(3);
    els.repoStatus.classList.remove("repo-status--error");
    els.repoStatus.textContent = "Loading repositories…";
  }

  function showErrorState(message) {
    els.repoGrid.removeAttribute("aria-busy");
    els.repoGrid.innerHTML = "";
    els.repoStatus.classList.add("repo-status--error");
    els.repoStatus.innerHTML =
      "<strong>Unable to load repositories.</strong>" +
      `<span>${escapeHtml(message)}</span>` +
      '<div class="repo-status__actions">' +
      '<button type="button" class="button button--outline" id="repo-retry">Retry</button>' +
      `<a class="button button--outline" href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener noreferrer">View on GitHub</a>` +
      "</div>";
    $("#repo-retry")?.addEventListener("click", loadRepos);
  }

  function appendLanguageSkills(repos) {
    if (!els.skillList) return;
    const known = new Set(
      Array.from(els.skillList.children).map((tag) => tag.textContent.trim().toLowerCase())
    );
    const languages = Array.from(new Set(repos.map((repo) => repo.language).filter(Boolean)));
    languages.forEach((language) => {
      const key = language.toLowerCase();
      if (known.has(key) || els.skillList.children.length >= MAX_TAGS) return;
      known.add(key);
      const tag = document.createElement("li");
      tag.className = "tag";
      tag.textContent = language;
      els.skillList.appendChild(tag);
    });
  }

  async function loadRepos() {
    showLoadingState();
    try {
      const repos = await fetchJSON(REPOS_URL);
      const sorted = repos
        .filter((repo) => !repo.private)
        .sort(
          (a, b) =>
            b.stargazers_count - a.stargazers_count ||
            new Date(b.pushed_at) - new Date(a.pushed_at)
        );
      if (sorted.length === 0) {
        els.repoGrid.removeAttribute("aria-busy");
        els.repoGrid.innerHTML = "";
        els.repoStatus.textContent = "No public repositories yet — check back soon.";
        return;
      }
      els.repoGrid.removeAttribute("aria-busy");
      els.repoGrid.innerHTML = sorted.map(repoCard).join("");
      els.repoStatus.textContent = `Showing all ${sorted.length} public repositor${sorted.length === 1 ? "y" : "ies"}, sorted by stars.`;
      appendLanguageSkills(sorted);
    } catch (error) {
      const message =
        error.status === 403
          ? "The GitHub API rate limit was reached. Please try again in a little while."
          : error.name === "AbortError"
            ? "The request timed out. Check your connection and try again."
            : "Something went wrong while contacting the GitHub API.";
      showErrorState(message);
    }
  }

  async function loadProfile() {
    try {
      const profile = await fetchJSON(PROFILE_URL);
      const displayName = profile.name || profile.login || GITHUB_USER;
      if (els.heroTitle) els.heroTitle.textContent = displayName;
      if (els.heroTagline) els.heroTagline.textContent = profile.bio || DEFAULT_TAGLINE;
      if (els.aboutBio && profile.bio) els.aboutBio.textContent = profile.bio;
      if (els.aboutAvatar && profile.avatar_url) {
        els.aboutAvatar.src = `${profile.avatar_url}${profile.avatar_url.includes("?") ? "&" : "?"}s=480`;
        els.aboutAvatar.alt = `GitHub avatar of ${displayName}`;
      }
      if (els.heroStats && els.statRepos && els.statFollowers) {
        els.statRepos.textContent = formatNumber(profile.public_repos ?? 0);
        els.statFollowers.textContent = formatNumber(profile.followers ?? 0);
        els.heroStats.removeAttribute("hidden");
      }
      if (profile.location && els.factLocation && els.factLocationValue) {
        els.factLocationValue.textContent = profile.location;
        els.factLocation.removeAttribute("hidden");
      }
    } catch (error) {
      // Profile data is optional; static placeholders remain on failure.
    }
  }

  function init() {
    initTheme();
    initNavigation();
    if (els.footerYear) els.footerYear.textContent = String(new Date().getFullYear());
    loadProfile();
    loadRepos();
  }

  init();
})();
