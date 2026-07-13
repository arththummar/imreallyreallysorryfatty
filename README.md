# for disha 🎧

A small static gift site: a moody red/black landing "gate" that unlocks into a
personal, tabbed page (a Neighbourhood tracklist, redeemable "food" cards, and a
playful "style" wishlist). Plain HTML/CSS/JS — no framework, no backend.

## Files
- `index.html` — page markup (gate → transition screen → main site)
- `style.css` — all styling, design tokens, animations
- `script.js` — unlock logic, transition screen, tabs, order ticket, rack, image fallbacks
- `images/` — photos used across the tabs (copied/renamed from the originals)

## Open it locally
Just double-click `index.html`, or serve it for a cleaner experience:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## The unlock code
The gate expects a secret word (case-insensitive, spaces trimmed). It lives in
`script.js` as the `SECRET` constant near the top — change it there if you like.

## Customizing copy
- **Transition line**, **intro line**, **playlist CTA label**, and **Hollister
  note** each have alternate options listed in comments right next to them in
  `index.html` — swap the text to taste.
- **Spotify playlist:** the "the neighbourhood" tab now embeds the real playlist,
  with an "add your songs" collaborative button below it. To change either, update
  the `<iframe src>` and the CTA `<a href>` in `index.html`.

## Images
Photos live in `images/`. Every `<img>` uses a fixed aspect-ratio container with
`object-fit: cover`, so mismatched photo sizes/orientations still look clean. If an
image is missing, it falls back to a cherry-red dashed placeholder (its `alt` text)
instead of a broken-image icon. To swap a photo, drop a new file in `images/` and
point the `src` at it (or just overwrite the existing filename).

## Deploy on GitHub Pages
1. Push these files to a GitHub repo (they should sit at the repo root).
2. On GitHub: **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
4. Choose the **`main`** branch and the **`/ (root)`** folder, then **Save**.
5. Wait a minute — your site will be live at
   `https://<your-username>.github.io/<repo-name>/`.

## Notes
- Fully responsive down to mobile, with visible keyboard focus states.
- Respects `prefers-reduced-motion` (spins/transitions are suppressed).
- No lyrics anywhere — the tracklist shows song titles only.
