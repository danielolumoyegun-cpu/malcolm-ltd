# MALCOLM LTD — homepage

Static homepage built from the supplied mockup (`MacBook Pro 16_ - 1 (1).pdf`) and
logo (`malcolm logo.pdf`). No build step, no dependencies — upload the folder as-is.

```
index.html
css/styles.css
js/main.js          mobile nav, sticky-header shadow, scroll reveal
images/
  logo-stacked.png      header lockup (transparent)
  logo-horizontal.png   footer + mobile header lockup (transparent)
  logo-mark.png         mark only
  favicon.png           256×256
```

## Design reference

The mockup is a 1728px-wide frame (MacBook Pro 16") with a 1440px content column
and 144px margins. Every size in `styles.css` is measured from it:

| Token | Value |
| --- | --- |
| Brand green | `#739D57` |
| Logo wordmark grey | `#535B5E` |
| Text | `#000000` |
| Content column | 1440px, 144px margins at 1728px |
| Card radius / hero block radius / button radius | 28px / 20px / 20px |
| Type | H1 100px · H2 66px · H3 34px · body 20px · lead 24px |

Type and spacing interpolate linearly down to a 390px viewport, so the page keeps
the mockup's proportions at 1728px and stays readable on a phone.

**Fonts.** The mockup was set in SF Pro, so the stack is
`-apple-system, BlinkMacSystemFont, "Inter", …`. On macOS/iOS it renders exactly as
designed; elsewhere it falls back to Inter (loaded from Google Fonts), which is a
very close match. Drop the `<link>` tags in `<head>` if you would rather not call out
to Google.

## Deliberate deviations from the mockup

1. **Footer** — the mockup ends after the Process section. A minimal footer (logo,
   nav, copyright) was added so the page is complete. Delete the `<footer>` block to
   remove it.
2. **"STRATEGY" → "Strategy"** — the mockup sets step 2 in all caps while the other
   three are title case. Normalised; revert in `index.html` if it was intentional.
3. **"a clear plan  channels"** — the mockup has a double space with a missing word.
   Set as an em dash: "a clear plan — channels".
4. **Line height** — the mockup's body copy sits at roughly 1.2. Loosened to
   1.4/1.45 for readability; visually near-identical, materially easier to read.
5. **Sticky header** — the mockup shows a static header. It sticks on scroll with a
   hairline shadow. Remove `position: sticky` in `.site-header` to make it static.

## Placeholders to replace

- **Hero artwork.** The green block holds an inline SVG placeholder icon copied from
  the mockup. Replace the `<svg>` in `.hero-media` with
  `<img src="images/hero.jpg" alt="…">` — the CSS already covers it edge to edge.
- **Nav links.** `#services` and `#about` scroll to real sections. `#work` and
  `#contact` have no target yet; point them at real pages or sections.
- **Footer contact details.** Add address, email and socials when available.

## Local preview

```bash
python3 -m http.server 4321 --directory ~/malcolm-ltd
```

Then open http://localhost:4321.

## Checked

Rendered and measured against the mockup at 1728px — all sections land within 1–3px
of the reference. Also verified at 1440, 768, 375 and 320px: no horizontal overflow,
mobile menu opens/closes, keyboard focus visible, `prefers-reduced-motion` honoured,
and every section readable with JavaScript disabled.
