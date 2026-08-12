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

## A note on claims

This is a brand/design concept. The site deliberately frames the "testosterone"
angle around what's actually defensible — breathability, temperature regulation,
and natural fibres — and includes a visible disclaimer on **The Science** page
stating that ANDRO does not claim to treat or change any medical or hormonal
condition. Fonts load from Google Fonts with full system fallbacks.
