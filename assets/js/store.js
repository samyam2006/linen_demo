/* ============================================================================
   ANDRO — Storefront engine
   Reads window.ANDRO_STORE (assets/js/products.js) and progressively enhances:
     • #featured-grid  → renders featured cards (home)
     • #shop-grid      → renders full shop + filters (collection)
     • injects cart drawer, waitlist modal, quick-add modal & toast on any page
   Pre-launch (storeLive:false): shows a "Launching Soon" gate + waitlist,
   and cards read "Notify Me". Flip storeLive to open the cart + checkout.
   ============================================================================ */
(function () {
  "use strict";
  var CFG = window.ANDRO_STORE;
  if (!CFG) return;

  var LIVE = !!CFG.storeLive;
  var CUR = CFG.currency || "$";
  var CART_KEY = "andro_cart";
  var WAIT_KEY = "andro_waitlist";

  /* ---------- helpers ---------- */
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function money(n) { return CUR + (Math.round(n * 100) / 100).toLocaleString(); }
  function byId(id) { return CFG.products.filter(function (p) { return p.id === id; })[0]; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function getCart() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } }
  function setCart(c) { try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {} updateCartUI(); }

  /* ---------- product card ---------- */
  function card(p, context) {
    var badge = p.badge ? p.badge : (!LIVE ? "Coming Soon" : "");
    var media =
      '<div class="product__media">' +
        (badge ? '<span class="product__tag">' + esc(badge) + "</span>" : "") +
        (context === "featured"
          ? '<a class="product__link" href="collection.html" aria-label="' + esc(p.name) + '"><img src="' + esc(p.image) + '" alt="' + esc(p.name) + '"></a>'
          : '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '">') +
        '<button class="product__action" type="button" data-id="' + esc(p.id) + '">' +
          (LIVE ? "Add to Cart +" : "Notify Me →") +
        "</button>" +
      "</div>";
    var meta =
      '<div class="product__meta">' +
        "<div><div class=\"product__name\">" + esc(p.name) + "</div>" +
        '<div class="product__fabric">' + esc(p.type) + " · " + esc(p.color) + "</div></div>" +
        '<div class="product__price">' + money(p.price) + "</div>" +
      "</div>";
    var wrap = el('<div class="product" data-cat="' + esc(p.category) + '"></div>');
    wrap.innerHTML = media + meta;
    wrap.querySelector(".product__action").addEventListener("click", function () {
      if (LIVE) openQuickAdd(p.id); else openWaitlist(p);
    });
    return wrap;
  }

  /* ---------- render grids ---------- */
  function renderFeatured() {
    var grid = document.getElementById("featured-grid");
    if (!grid) return;
    grid.innerHTML = "";
    CFG.products.slice(0, 3).forEach(function (p) {
      var c = card(p, "featured");
      c.classList.add("reveal");
      grid.appendChild(c);
    });
  }

  function renderShop() {
    var grid = document.getElementById("shop-grid");
    if (!grid) return;
    grid.innerHTML = "";
    CFG.products.forEach(function (p, i) {
      var c = card(p, "shop");
      c.classList.add("reveal");
      if (i % 3 === 1) c.classList.add("d1");
      if (i % 3 === 2) c.classList.add("d2");
      grid.appendChild(c);
    });
    // wire filter chips
    var chips = document.querySelectorAll(".chip");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (x) { x.classList.remove("chip--on"); });
        chip.classList.add("chip--on");
        var f = chip.getAttribute("data-filter");
        grid.querySelectorAll(".product").forEach(function (it) {
          it.style.display = (f === "all" || it.getAttribute("data-cat") === f) ? "" : "none";
        });
      });
    });
    // re-run reveal observer if present
    if (window.ANDRO_observeReveals) window.ANDRO_observeReveals();
  }

  /* ---------- pre-launch gate (collection) ---------- */
  function renderGate() {
    var host = document.getElementById("store-gate");
    if (!host || LIVE) return;
    host.appendChild(el(
      '<div class="gate">' +
        '<div class="gate__inner">' +
          '<p class="eyebrow">Launching Soon</p>' +
          "<h2 class=\"gate__title\">The first drop is almost here.</h2>" +
          "<p class=\"gate__sub\">Our European linen is in production. Join the list to get early access, launch pricing, and 10% off your first order.</p>" +
          '<form class="gate__form" novalidate>' +
            '<input type="email" required placeholder="Enter your email" aria-label="Email">' +
            "<button type=\"submit\">Notify Me</button>" +
          "</form>" +
          '<p class="gate__note" data-gatenote>No spam. One email when we go live.</p>' +
        "</div>" +
      "</div>"
    ));
    var form = host.querySelector(".gate__form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      submitWaitlist(form.querySelector("input").value, form.querySelector("[data-gatenote]"), form).then(function () {
        form.reset();
      });
    });
  }

  /* ---------- global UI (cart drawer, modals, toast) ---------- */
  function injectGlobalUI() {
    // toast
    document.body.appendChild(el('<div class="toast" data-toast aria-live="polite"></div>'));

    // waitlist modal
    document.body.appendChild(el(
      '<div class="modal" data-modal="waitlist" aria-hidden="true">' +
        '<div class="modal__scrim" data-close></div>' +
        '<div class="modal__box" role="dialog" aria-modal="true">' +
          '<button class="modal__x" data-close aria-label="Close">×</button>' +
          '<p class="eyebrow">Join the Waitlist</p>' +
          '<h3 class="modal__title" data-wl-title>Be first in line.</h3>' +
          '<p class="modal__sub">We\'ll email you the moment it drops — plus 10% off your first order.</p>' +
          '<form class="modal__form" novalidate>' +
            '<input type="email" required placeholder="Enter your email" aria-label="Email">' +
            '<button type="submit" class="btn" style="--bg:var(--ink);--fg:#fff"><span>Notify Me</span></button>' +
          "</form>" +
          '<p class="modal__note" data-wl-note></p>' +
        "</div>" +
      "</div>"
    ));
    var wl = document.querySelector('[data-modal="waitlist"]');
    wl.querySelector(".modal__form").addEventListener("submit", function (e) {
      e.preventDefault();
      var input = wl.querySelector("input");
      submitWaitlist(input.value, wl.querySelector("[data-wl-note]"), wl.querySelector(".modal__form"));
    });

    if (!LIVE) return; // cart + quick-add only exist when live

    // quick-add modal
    document.body.appendChild(el(
      '<div class="modal" data-modal="quickadd" aria-hidden="true">' +
        '<div class="modal__scrim" data-close></div>' +
        '<div class="modal__box" role="dialog" aria-modal="true">' +
          '<button class="modal__x" data-close aria-label="Close">×</button>' +
          '<div data-qa-body></div>' +
        "</div>" +
      "</div>"
    ));

    // cart drawer
    document.body.appendChild(el(
      '<div class="cart" data-cart aria-hidden="true">' +
        '<div class="cart__scrim" data-close></div>' +
        '<aside class="cart__panel" role="dialog" aria-modal="true" aria-label="Cart">' +
          '<div class="cart__head"><span>Your Cart</span><button class="modal__x" data-close aria-label="Close">×</button></div>' +
          '<div class="cart__items" data-cart-items></div>' +
          '<div class="cart__foot">' +
            '<div class="cart__ship" data-cart-ship></div>' +
            '<div class="cart__sub"><span>Subtotal</span><span data-cart-sub>' + money(0) + "</span></div>" +
            '<button class="btn cart__checkout" data-checkout style="--bg:var(--ink);--fg:#fff;width:100%;justify-content:center"><span>Checkout</span><span class="arrow">→</span></button>' +
          "</div>" +
        "</aside>" +
      "</div>"
    ));
    document.querySelector("[data-checkout]").addEventListener("click", checkout);

    // nav cart button (all pages)
    document.querySelectorAll(".nav__inner").forEach(function (navInner) {
      var btn = el('<button class="nav__cart" aria-label="Open cart" data-magnetic>Cart<span class="nav__cart-count" data-cart-count>0</span></button>');
      btn.addEventListener("click", openCart);
      var cta = navInner.querySelector(".nav__cta");
      if (cta) navInner.insertBefore(btn, cta); else navInner.appendChild(btn);
    });

    // global close handlers
    document.addEventListener("click", function (e) { if (e.target.matches("[data-close]")) closeAll(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
  }

  /* ---------- toast ---------- */
  var toastT;
  function toast(msg) {
    var t = document.querySelector("[data-toast]");
    if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* ---------- waitlist ---------- */
  function openWaitlist(product) {
    var wl = document.querySelector('[data-modal="waitlist"]');
    if (!wl) return;
    wl.querySelector("[data-wl-title]").textContent = product ? "Notify me: " + product.name : "Be first in line.";
    wl.querySelector("[data-wl-note]").textContent = "";
    open(wl);
    setTimeout(function () { var i = wl.querySelector("input"); if (i) i.focus(); }, 300);
  }
  function submitWaitlist(email, noteEl, formEl) {
    email = (email || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      if (noteEl) noteEl.textContent = "Please enter a valid email.";
      return Promise.resolve(false);
    }
    var btn = formEl && formEl.querySelector("button");
    var orig = btn ? btn.innerHTML : "";
    if (btn) { btn.disabled = true; btn.innerHTML = "<span>Adding…</span>"; }
    var done = function () {
      if (noteEl) noteEl.textContent = "You're on the list ✓  Check your inbox for 10% off.";
      if (btn) { btn.innerHTML = "<span>Added ✓</span>"; }
      toast("You're on the waitlist.");
    };
    if (CFG.waitlistEndpoint) {
      return fetch(CFG.waitlistEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: email, source: "andro-waitlist" })
      }).then(done).catch(function () {
        if (noteEl) noteEl.textContent = "Something went wrong — try again.";
        if (btn) { btn.disabled = false; btn.innerHTML = orig; }
      });
    }
    // demo mode: store locally
    try { var l = JSON.parse(localStorage.getItem(WAIT_KEY)) || []; if (l.indexOf(email) < 0) l.push(email); localStorage.setItem(WAIT_KEY, JSON.stringify(l)); } catch (e) {}
    done();
    return Promise.resolve(true);
  }

  /* ---------- quick-add ---------- */
  function openQuickAdd(id) {
    var p = byId(id); if (!p) return;
    var qa = document.querySelector('[data-modal="quickadd"]');
    var body = qa.querySelector("[data-qa-body]");
    var sizes = (p.sizes && p.sizes.length) ? p.sizes : ["One Size"];
    body.innerHTML =
      '<div class="qa">' +
        '<div class="qa__media"><img src="' + esc(p.image) + '" alt="' + esc(p.name) + '"></div>' +
        '<div class="qa__info">' +
          '<p class="eyebrow">' + esc(p.type) + "</p>" +
          '<h3 class="qa__name">' + esc(p.name) + "</h3>" +
          '<div class="qa__price">' + money(p.price) + "</div>" +
          '<p class="qa__desc">' + esc(p.description || "") + "</p>" +
          '<p class="qa__label">Size</p>' +
          '<div class="qa__sizes">' + sizes.map(function (s, i) {
            return '<button type="button" class="qa__size' + (i === 0 ? " on" : "") + '" data-size="' + esc(s) + '">' + esc(s) + "</button>";
          }).join("") + "</div>" +
          '<button class="btn qa__add" style="--bg:var(--ink);--fg:#fff;width:100%;justify-content:center"><span>Add to Cart</span><span class="arrow">→</span></button>' +
        "</div>" +
      "</div>";
    var chosen = sizes[0];
    body.querySelectorAll(".qa__size").forEach(function (b) {
      b.addEventListener("click", function () {
        body.querySelectorAll(".qa__size").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on"); chosen = b.getAttribute("data-size");
      });
    });
    body.querySelector(".qa__add").addEventListener("click", function () {
      addToCart(p.id, chosen); close(qa); openCart();
    });
    open(qa);
  }

  /* ---------- cart ---------- */
  function addToCart(id, size) {
    var cart = getCart();
    var line = cart.filter(function (l) { return l.id === id && l.size === size; })[0];
    if (line) line.qty += 1; else cart.push({ id: id, size: size, qty: 1 });
    setCart(cart);
    toast("Added to cart.");
  }
  function changeQty(id, size, delta) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id && cart[i].size === size) {
        cart[i].qty += delta;
        if (cart[i].qty <= 0) cart.splice(i, 1);
        break;
      }
    }
    setCart(cart);
  }
  function cartCount() { return getCart().reduce(function (n, l) { return n + l.qty; }, 0); }
  function cartTotal() { return getCart().reduce(function (n, l) { var p = byId(l.id); return n + (p ? p.price * l.qty : 0); }, 0); }

  function updateCartUI() {
    if (!LIVE) return;
    document.querySelectorAll("[data-cart-count]").forEach(function (c) {
      c.textContent = cartCount(); c.classList.toggle("has", cartCount() > 0);
    });
    var wrap = document.querySelector("[data-cart-items]");
    if (!wrap) return;
    var cart = getCart();
    if (!cart.length) {
      wrap.innerHTML = '<p class="cart__empty">Your cart is empty.</p>';
    } else {
      wrap.innerHTML = cart.map(function (l) {
        var p = byId(l.id); if (!p) return "";
        return '<div class="citem">' +
          '<div class="citem__img"><img src="' + esc(p.image) + '" alt=""></div>' +
          '<div class="citem__body">' +
            '<div class="citem__top"><span class="citem__name">' + esc(p.name) + "</span><span>" + money(p.price * l.qty) + "</span></div>" +
            '<div class="citem__fab">' + esc(p.color) + " · Size " + esc(l.size) + "</div>" +
            '<div class="citem__qty">' +
              '<button data-q="-1" data-id="' + esc(l.id) + '" data-size="' + esc(l.size) + '" aria-label="Decrease">−</button>' +
              "<span>" + l.qty + "</span>" +
              '<button data-q="1" data-id="' + esc(l.id) + '" data-size="' + esc(l.size) + '" aria-label="Increase">+</button>' +
              '<button class="citem__rm" data-rm data-id="' + esc(l.id) + '" data-size="' + esc(l.size) + '">Remove</button>' +
            "</div>" +
          "</div>" +
        "</div>";
      }).join("");
      wrap.querySelectorAll("[data-q]").forEach(function (b) {
        b.addEventListener("click", function () { changeQty(b.getAttribute("data-id"), b.getAttribute("data-size"), parseInt(b.getAttribute("data-q"), 10)); });
      });
      wrap.querySelectorAll("[data-rm]").forEach(function (b) {
        b.addEventListener("click", function () {
          var cart = getCart().filter(function (l) { return !(l.id === b.getAttribute("data-id") && l.size === b.getAttribute("data-size")); });
          setCart(cart);
        });
      });
    }
    var sub = document.querySelector("[data-cart-sub]"); if (sub) sub.textContent = money(cartTotal());
    var ship = document.querySelector("[data-cart-ship]");
    if (ship) {
      if (CFG.freeShippingOver > 0) {
        var left = CFG.freeShippingOver - cartTotal();
        ship.textContent = left > 0 ? "Add " + money(left) + " for free shipping." : "✓ You've unlocked free shipping.";
      } else ship.textContent = "";
    }
  }

  function checkout() {
    var cart = getCart();
    if (!cart.length) { toast("Your cart is empty."); return; }
    if (CFG.cartCheckoutUrl) { window.location.href = CFG.cartCheckoutUrl; return; }
    // Stripe Payment Links are one-product URLs. If the cart is a single product
    // line and it has a checkoutUrl, send them straight there.
    if (cart.length === 1) {
      var p = byId(cart[0].id);
      if (p && p.checkoutUrl) { window.location.href = p.checkoutUrl + (p.checkoutUrl.indexOf("?") < 0 ? "?" : "&") + "quantity=" + cart[0].qty; return; }
    }
    toast("Checkout not configured — add Stripe links in products.js.");
  }

  /* ---------- open/close ---------- */
  function open(node) { node.classList.add("open"); node.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function close(node) { node.classList.remove("open"); node.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  function openCart() { var c = document.querySelector("[data-cart]"); if (c) { updateCartUI(); open(c); } }
  function closeAll() { document.querySelectorAll(".modal.open, .cart.open").forEach(function (n) { close(n); }); }

  /* ---------- boot ---------- */
  document.documentElement.classList.toggle("store-live", LIVE);
  document.documentElement.classList.toggle("store-soon", !LIVE);
  renderFeatured();
  renderShop();
  renderGate();
  injectGlobalUI();
  updateCartUI();
})();
