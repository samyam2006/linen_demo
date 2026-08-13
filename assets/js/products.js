/* ============================================================================
   ANDRO — STORE CONFIG
   ----------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU EDIT TO GO LIVE.

   1. Add / edit products in the `products` array below.
   2. Paste a Stripe Payment Link into each product's `checkoutUrl`
      (Stripe → Payment Links → create one per product → copy the URL).
   3. (Optional) paste a form endpoint into `waitlistEndpoint` so waitlist
      emails are captured (e.g. a Formspree URL like https://formspree.io/f/xxxx).
   4. Flip `storeLive` to true.

   That's it — the whole shop, cart and checkout turn on. No other file changes.
   ============================================================================ */

window.ANDRO_STORE = {

  /* ---- THE MASTER SWITCH ----------------------------------------------------
     false = pre-launch. Shop shows a "Launching Soon" gate + waitlist.
             Product cards show "Notify Me" instead of "Add to Cart".
     true  = live store. Cart + checkout enabled.                              */
  storeLive: false,

  /* Currency symbol shown before prices. */
  currency: "$",

  /* Free-shipping threshold shown in the cart (set 0 to hide). */
  freeShippingOver: 75,

  /* Where waitlist emails go. Leave "" to store them in the browser (demo mode).
     Paste a Formspree / Getform / Google Form endpoint to collect for real.   */
  waitlistEndpoint: "",

  /* Optional: a single Stripe/checkout URL for the whole cart. If set, the
     cart "Checkout" button sends the customer here. Leave "" to use each
     product's own `checkoutUrl` (best for one-product Payment Links).         */
  cartCheckoutUrl: "",

  /* ---- PRODUCTS -------------------------------------------------------------
     category: "boxer" | "trunk" | "brief" | "lounge"  (matches the filters)
     badge:    short pill shown on the card ("" for none)
     checkoutUrl: Stripe Payment Link for this product ("" until you add it)   */
  products: [
    {
      id: "meridian-charcoal",
      name: "The Meridian",
      category: "boxer",
      type: "Boxer Brief",
      color: "Charcoal Linen",
      price: 42,
      sizes: ["S", "M", "L", "XL"],
      image: "assets/img/boxer-brief.svg",
      badge: "Bestseller",
      description: "Our flagship boxer brief in mid-weight charcoal linen. Breathes like nothing synthetic, softens with every wash.",
      checkoutUrl: ""
    },
    {
      id: "meridian-ivory",
      name: "The Meridian",
      category: "boxer",
      type: "Boxer Brief",
      color: "Ivory Linen",
      price: 42,
      sizes: ["S", "M", "L", "XL"],
      image: "assets/img/boxer-brief.svg",
      badge: "",
      description: "The Meridian in natural undyed ivory — the closest thing to wearing nothing at all.",
      checkoutUrl: ""
    },
    {
      id: "anvil-charcoal",
      name: "The Anvil",
      category: "trunk",
      type: "Trunk",
      color: "Charcoal Linen",
      price: 38,
      sizes: ["S", "M", "L", "XL"],
      image: "assets/img/trunk.svg",
      badge: "",
      description: "A shorter, squared trunk cut for a closer fit. Same pure European linen, less leg.",
      checkoutUrl: ""
    },
    {
      id: "anvil-slate",
      name: "The Anvil",
      category: "trunk",
      type: "Trunk",
      color: "Slate Linen",
      price: 38,
      sizes: ["S", "M", "L", "XL"],
      image: "assets/img/trunk.svg",
      badge: "Limited",
      description: "The Anvil in a limited slate wash. When it's gone, it's gone.",
      checkoutUrl: ""
    },
    {
      id: "origin-ivory",
      name: "The Origin",
      category: "brief",
      type: "Brief",
      color: "Ivory Linen",
      price: 34,
      sizes: ["S", "M", "L", "XL"],
      image: "assets/img/brief.svg",
      badge: "New",
      description: "A classic brief, reimagined in linen. Minimal coverage, maximum airflow.",
      checkoutUrl: ""
    },
    {
      id: "origin-charcoal",
      name: "The Origin",
      category: "brief",
      type: "Brief",
      color: "Charcoal Linen",
      price: 34,
      sizes: ["S", "M", "L", "XL"],
      image: "assets/img/brief.svg",
      badge: "",
      description: "The Origin brief in deep charcoal linen.",
      checkoutUrl: ""
    },
    {
      id: "sabbath-ivory",
      name: "The Sabbath",
      category: "lounge",
      type: "Lounge Short",
      color: "Ivory Linen",
      price: 58,
      sizes: ["S", "M", "L", "XL"],
      image: "assets/img/lounge.svg",
      badge: "New",
      description: "A relaxed linen lounge short with a drawstring waist. For the hours you're off the clock.",
      checkoutUrl: ""
    },
    {
      id: "sabbath-charcoal",
      name: "The Sabbath",
      category: "lounge",
      type: "Lounge Short",
      color: "Charcoal Linen",
      price: 58,
      sizes: ["S", "M", "L", "XL"],
      image: "assets/img/lounge.svg",
      badge: "",
      description: "The Sabbath lounge short in charcoal linen.",
      checkoutUrl: ""
    },
    {
      id: "foundation-3pack",
      name: "The Foundation",
      category: "boxer",
      type: "3-Pack Boxer Briefs",
      color: "Mixed Linen",
      price: 108,
      sizes: ["S", "M", "L", "XL"],
      image: "assets/img/stack.svg",
      badge: "3-Pack",
      description: "Three Meridian boxer briefs, one box. Build your drawer and save.",
      checkoutUrl: ""
    }
  ]
};
