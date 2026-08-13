# ANDRO — Linen Underwear for Men

A professional, multi-page marketing website concept for **ANDRO**, a premium
men's underwear brand built on 100% European linen. Monochrome (black & white),
editorial typography, and motion-forward — inspired by the aesthetics of brands
like Hollister and Linoto.

> **Name rationale:** *ANDRO* comes from *andro-*, the Greek root behind
> *androgen* / *testosterone* — tying the brand's masculine, hormone-conscious
> positioning to a clean, ownable mark.

## Pages

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Hero, brand promise, featured products, testimonials |
| Collection | `collection.html` | Filterable product grid + bundle offer |
| The Science | `science.html` | Why linen — breathability, comparison table, honest disclaimer |
| About | `about.html` | Brand story, values, process |
| Contact | `contact.html` | Contact form + FAQ |

## Design & features

- **Monochrome system** — pure black/white with a warm paper neutral
- **Custom animated cursor**, sticky nav that inverts on scroll
- **Scroll-reveal** animations, count-up stats, magnetic buttons, marquee, hover zoom
- **Preloader** and animated hero lines
- **Hand-built SVG "studio" mockups** (in `assets/img/`) — no external images,
  fully self-contained and crisp at any size
- Fully **responsive** with a mobile overlay menu
- Respects `prefers-reduced-motion`

## Run locally

It's static — just open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
├── index.html · collection.html · science.html · about.html · contact.html
└── assets/
    ├── css/style.css      # design system + all styling
    ├── js/main.js         # cursor, nav, reveals, magnetic, filters
    └── img/*.svg          # product mockups, packaging, textures, favicon
```

## Store & pre-launch "paywall"

The shop is **config-driven** and ships in pre-launch mode. Everything lives in
one file: **`assets/js/products.js`**.

**Right now (`storeLive: false`)** — the Collection shows a **"Launching Soon"
gate** with an email waitlist, product cards read **"Notify Me,"** and there's
no cart. It's a live-looking teaser that builds a customer list before launch.

**To go live once the supplier is in place — edit only `products.js`:**

1. Add/edit items in the `products` array (name, price, sizes, image, description).
2. Paste a **Stripe Payment Link** into each product's `checkoutUrl`
   (Stripe → Payment Links → one per product → copy URL). No server needed.
3. (Optional) paste a form endpoint into `waitlistEndpoint` (e.g. Formspree) so
   waitlist emails are captured for real; until then they're stored in-browser.
4. Flip **`storeLive: true`**.

That turns on the cart, quick-add with size selection, the slide-out cart
drawer, quantity controls, free-shipping progress, and checkout — across every
page. No HTML/CSS changes required.

The home "Featured" row and the Collection grid both render from this same file,
so adding a product shows it everywhere automatically.

## A note on claims

This is a brand/design concept. The site deliberately frames the "testosterone"
angle around what's actually defensible — breathability, temperature regulation,
and natural fibres — and includes a visible disclaimer on **The Science** page
stating that ANDRO does not claim to treat or change any medical or hormonal
condition. Fonts load from Google Fonts with full system fallbacks.
