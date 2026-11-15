# BIJOY — Liquid Glass Portfolio

Personal portfolio of **Md Yubraj Ahmed Bijoy** (BIJOY / ENTITY_YUBRAJ) — student, independent developer
and aspiring Full-Stack AI Engineer from Bangladesh.

Built with plain **HTML5 + CSS3 + vanilla JavaScript**. No frameworks, no build step, no paid services.

```
portfolio/
├── index.html
├── style.css
├── script.js
├── assets/
│   └── profile.jpg
└── README.md
```

---

## 1. Open it

Double-click `index.html`, or serve the folder locally:

```bash
# from inside the portfolio folder
python3 -m http.server 8000
# then open http://localhost:8000
```

For a live preview with auto-reload you can also use the VS Code "Live Server" extension.

---

## 2. Profile photo

The hero frame loads `assets/profile.jpg`. It currently holds a **generated placeholder** (a graphite glass
tile with a "B" monogram) because the real portrait was not available as a file to copy into the project.

To use your real photo:

1. Take the photo you want to use and crop it to a **square** (1:1) — for example 800 × 800 px.
2. Keep the face reasonably centred and slightly above the middle of the frame.
3. Name the file exactly `profile.jpg`.
4. Overwrite `portfolio/assets/profile.jpg` with it.

That's all — the hero frame, glow, hover animation and alt text already point at that path.
If you prefer another filename or a `.png`/`.webp`, update the `src` in `index.html` (hero `<img>`) and the
`og:image` / `twitter:image` meta tags.

Recommended: JPEG or WebP, under ~250 KB, so it loads fast on low-RAM Android phones.
The frame shows the image with `object-fit: cover` at `object-position: center 26%`, which keeps a face in
the upper part of the frame nicely centred. Adjust that value in `style.css` (`.photo__frame img`) if you
want to shift the crop.

---

## 3. Email

The contact section links to **bijoyahmed69bijoy@gmail.com** (visible text and `mailto:`). To change it,
edit both occurrences in `index.html`.

---

## 4. Connect the contact form

The form is intentionally honest: it validates input, then clearly states that nothing was sent.
It has **no backend**. Pick one of these light options when you want real messages:

**Formspree (free tier, no server needed)**

1. Create a form at <https://formspree.io> and copy your endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
2. In `index.html`, change the form tag to:
   ```html
   <form class="glass contact__form reveal" id="contactForm" action="https://formspree.io/f/YOUR_ID" method="POST">
   ```
3. In `script.js`, delete the `e.preventDefault();` line inside the submit handler (and the demo
   status message), so the browser posts normally.

**Netlify Forms** — add `data-netlify="true"` and a `name` attribute to the form, then remove the
`preventDefault()` as above. Works only when the site is deployed on Netlify.

**Your own API** — keep the JS handler and replace the demo status message with a `fetch()` call to
your endpoint.

---

## 5. Edit content

| What | Where |
| --- | --- |
| Name, hero text, typing words | `index.html` — `#home` section (`data-words` holds the typing list) |
| Bio, about cards | `index.html` — `#about` |
| Skills and honest levels | `index.html` — `#skills` |
| Projects + GitHub links | `index.html` — `#projects` |
| Social profiles | `index.html` — `#profiles`, contact and footer |
| Colours, radii, glass strength | `style.css` — the `:root` token block at the top |

All GitHub and social URLs are already the real ones supplied by Bijoy; keep the
`target="_blank" rel="noopener noreferrer"` attributes on external links.

---

## 6. Design system

- **Palette:** Deep Graphite `#1C1D20` surfaces, Soft Cloud White `#F2F4F1` text, Sunshine Yellow
  `#FFC928` accent. Every colour lives in the `:root` token block, so the whole site can be re-themed
  from those few values.
- **Glass:** `background` gradient + `border` hairline + `backdrop-filter: blur()` + inset highlight over
  the graphite base.
- **Motion:** typing, scroll reveal (IntersectionObserver), floating photo and chips, card lift on
  hover, spinning glass reflection ring.
- **Accessibility:** semantic landmarks, skip link, visible focus rings, `aria-expanded` on the menu,
  `aria-current` on the active nav item, alt text on the photo, and a full `prefers-reduced-motion`
  fallback that disables every animation.
- **Performance:** one CSS file, one small JS file, no images besides the portrait, icons from a single
  CDN stylesheet, transform/opacity-only animations, smooth scrolling handled in JS.

## 7. Browser support

Modern Chrome, Edge, Firefox and Safari (mobile and desktop). If `backdrop-filter` is unsupported,
panels fall back to a solid dark surface through `@supports not (...)`.

---

Designed & Built by BIJOY · ENTITY_YUBRAJ · © 2026
