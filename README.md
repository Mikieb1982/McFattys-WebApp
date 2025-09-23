
# McFatty's Food Tracker

A lightweight, single-file web app for mindful food tracking. No accounts. No databases. Runs entirely in the browser. Optimized for Add to Home Screen on Android.

> Slow and steady wins the race. Not everything requires urgency.

---

## Features

* Minimal, single HTML file with Tailwind via CDN
* Fast load on low bandwidth
* Works offline once cached by the browser
* Add to Home Screen on Android for app-like use
* Keyboard and screen reader friendly
* Red-green safe color choices
* Optional dark mode
* Simple burger menu with core actions

---

## Live Demo

If you publish on GitHub Pages the app will be available at:

```
https://<your-username>.github.io/McFattys/
```

Enable Pages in: Settings → Pages → Build and deployment → Deploy from a branch → `main` → `/root`.

---

## Tech Stack

* HTML5
* Tailwind CSS via CDN
* Vanilla JavaScript
* LocalStorage for on-device persistence (no server)

---

## Project Structure

```
McFattys/
├─ index.html          # The app
├─ logo.png            # App logo
├─ icons/              # Optional platform icons
└─ README.md
```

If you prefer separate CSS or JS files you can add:

```
/assets
  ├─ app.css
  └─ app.js
```

and link them from `index.html`.

---

## Getting Started

### Option A: Mobile only

1. Open the repository on GitHub in your mobile browser.
2. Tap the app URL if using GitHub Pages, or open `index.html` locally with a mobile file viewer that supports HTML.
3. Add to Home Screen:

   * Chrome on Android: menu → Add to Home screen.
4. Use the app offline after first load. The browser cache keeps it available.

### Option B: Desktop local

1. Clone the repo.

   ```bash
   git clone https://github.com/Mikieb1982/McFattys.git
   cd McFattys
   ```

2. Serve locally. Any static server works. Examples:

   Python 3:

   ```bash
   python -m http.server 8080
   ```

   Node http-server:

   ```bash
   npx http-server -p 8080 .
   ```

3. Open `http://localhost:8080`.

---

## Configuration

You can tune basic behavior via small constants in the script block:

```js
// Example defaults
const STORAGE_KEY = "mcfattys.entries.v1";
const THEME_DEFAULT = "system"; // "light" | "dark" | "system"
const MAX_ENTRIES = 2000;       // safety cap
```

If you split JavaScript into `assets/app.js`, keep the same names.

---

## Data Model

Entries are stored in `localStorage` under `STORAGE_KEY`.

```ts
type Entry = {
  id: string,            // uuid
  timestamp: number,     // ms since epoch
  title: string,         // short label
  notes?: string,        // free text
  photo?: string,        // data URL, optional
  hunger?: "low" | "medium" | "high" | null // cue based, no numbers
}
type Store = { entries: Entry[] }
```

You can export and import JSON through the menu for backup or migration.

---

## Accessibility

* Semantic HTML and labeled controls
* Focus states visible without color
* Red-green safe palette with high contrast
* Supports system dark mode
* Large tap targets on mobile

Testing tips:

* Keyboard only navigation: Tab, Shift+Tab, Enter, Space, Escape
* Screen readers: NVDA on Windows, VoiceOver on macOS or Android TalkBack
* Contrast check target: 4.5:1 or higher for text

---

## Menu Structure

In the burger menu:

* Core Practices

  * New Journal Entry
  * Photo Journal
  * Hunger Check-in
* Reflection and Growth

  * My Journal
  * My Intentions
* Application Settings

  * Reminders
  * Theme
  * Account

If you are not using all items yet, keep the labels but grey out the inactive ones to set expectations.

---

## Development Notes

### Tailwind via CDN

The app uses Tailwind CDN for speed. For production hardening you can switch to a build step with Purge to reduce CSS size, but CDN is fine for a single page app.

```html
<script src="https://cdn.tailwindcss.com"></script>
```

### Burger Menu

A simple pattern with no framework:

```html
<button id="menuBtn" aria-expanded="false" aria-controls="sideMenu">☰</button>
<aside id="sideMenu" hidden> ... </aside>
<script>
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("sideMenu");
  function toggleMenu(show) {
    const open = show ?? menu.hasAttribute("hidden");
    menu.toggleAttribute("hidden", !open);
    btn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("overflow-hidden", open);
  }
  btn.addEventListener("click", () => toggleMenu());
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") toggleMenu(false);
  });
</script>
```

### Theme Toggle

```js
function applyTheme(mode) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = mode === "dark" || (mode === "system" && prefersDark);
  root.classList.toggle("dark", dark);
}
```

Add `class="dark"` variants in your CSS classes, for example `bg-white dark:bg-neutral-900`.

---

## Add to Home Screen

* Android Chrome: Menu → Add to Home screen
* Edge for Android: Add to phone
* iOS Safari supports Home Screen too, but some PWA features differ

Tip: Provide a square icon at 512x512 in `icons/` and link it:

```html
<link rel="icon" sizes="192x192" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/icon-192.png">
```

A minimal `manifest.webmanifest` improves the install prompt, but is optional for a basic A2HS.

---

## Offline Use

The browser cache keeps the single HTML file available after first load. For stronger offline support add a very small service worker later:

* Cache `index.html`, `logo.png`, and optional `manifest.webmanifest`
* Serve from cache when offline

Keep it simple to avoid bugs. Only add this once your UI is stable.

---

## Performance Checklist

* Use system fonts or one web font only
* Keep images under 200 KB where possible
* Avoid heavy libraries
* Defer any non-critical JS
* Test on a low-end Android device

---

## Red-Green Color Safety

* Use blue or neutral for primary actions
* Use shapes and text, not color alone, to convey state
* Keep focus outlines visible and high contrast

Example classes:

* Primary button: `bg-blue-600 hover:bg-blue-700 text-white`
* Destructive: `bg-neutral-800 text-white` plus an icon, not red only
* Info banners: `bg-blue-50 text-blue-900` with an info icon

---

## Troubleshooting

* Menu does not open

  * Check that the button and panel IDs match
  * Ensure no element blocks pointer events on top
* App does not install

  * On Android use Chrome and try Add to Home screen from the menu
  * If using Pages, open the GitHub Pages URL directly, not the repo page
* Logo looks blurry

  * Use a 1024 px square PNG and let CSS scale down
* Dark mode not applying

  * Verify the root element receives `class="dark"`

---

## Roadmap

* Optional service worker for reliable offline
* Export and import of entries as JSON file
* Basic reminders using the Notifications API
* Simple analytics using local counters only
* Print-friendly daily or weekly view

Low risk. Implement gradually.

---

## Contributing

1. Fork the repo

2. Create a branch

   ```bash
   git checkout -b feat/short-description
   ```

3. Commit and push

4. Open a pull request

Coding style:

* Keep it framework free
* Prefer small functions
* ARIA attributes for interactive elements
* Avoid color-only indicators

---

## License

MIT. See `LICENSE` if present. If not, the default is All Rights Reserved. Add an MIT license to allow reuse.

---

## Acknowledgements

* Tailwind CSS
* Everyone who prefers mindful logging over strict calorie counting

---

## Maintainer Notes

* GitHub Pages auto builds from `main`
* Use semantic version tags like `v0.1.0`
* Keep `index.html` under about 500 KB for quick first load

---

If you want, I can add a minimal `manifest.webmanifest` and a tiny service worker to the repo to improve install and offline behavior.
