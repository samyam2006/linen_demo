/* ============================================================
   ANDRO — interactions & animations
   ============================================================ */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Preloader ---------- */
  window.addEventListener("load", () => {
    const pre = document.querySelector(".preloader");
    if (pre) setTimeout(() => pre.classList.add("done"), 900);
    document.body.classList.add("loaded");
    // trigger hero lines
    document.querySelectorAll(".hero h1 .line > span").forEach((s, i) => {
      s.style.transition = "transform 1s var(--ease)";
      s.style.transitionDelay = 0.9 + i * 0.12 + "s";
      requestAnimationFrame(() => (s.style.transform = "none"));
    });
  });

  /* ---------- Custom cursor ---------- */
  if (canHover) {
    const cursor = document.createElement("div");
    cursor.className = "cursor";
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    document.body.append(cursor, dot);

    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
    });
    (function loop() {
      cx += (mx - cx) * 0.16; cy += (my - cy) * 0.16;
      cursor.style.left = cx + "px"; cursor.style.top = cy + "px";
      requestAnimationFrame(loop);
    })();

    const grow = "a, button, .btn, .product, .split__media, input, textarea, select, [data-cursor]";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(grow)) cursor.classList.add("grow");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(grow)) cursor.classList.remove("grow");
    });
  }

  /* ---------- Nav on scroll ---------- */
  const nav = document.querySelector(".nav");
  const hero = document.querySelector(".hero, .page-hero");
  const onScroll = () => {
    if (!nav) return;
    const solid = window.scrollY > (hero ? hero.offsetHeight - 120 : 60);
    nav.classList.toggle("solid", solid);
    document.body.classList.toggle("nav-dark", !solid);
  };
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".mobile-menu");
  if (burger && menu) {
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      document.body.style.overflow = open ? "hidden" : "";
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        menu.classList.remove("open");
        document.body.style.overflow = "";
      })
    );
  }

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal, .line-reveal").forEach((el) => io.observe(el));

  /* ---------- Count-up stats ---------- */
  const countIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const raw = el.dataset.count;
        const target = parseFloat(raw);
        const suffix = el.dataset.suffix || "";
        const dec = (raw.split(".")[1] || "").length;
        if (reduce) { el.textContent = raw + suffix; countIO.unobserve(el); return; }
        let start = null;
        const dur = 1500;
        const tick = (t) => {
          if (start === null) start = t;
          const p = Math.min((t - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(dec) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = raw + suffix;
        };
        requestAnimationFrame(tick);
        countIO.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

  /* ---------- Magnetic buttons ---------- */
  if (canHover && !reduce) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- Parallax (data-parallax = speed) ---------- */
  if (!reduce) {
    const items = [...document.querySelectorAll("[data-parallax]")];
    if (items.length) {
      const move = () => {
        const vh = innerHeight;
        items.forEach((el) => {
          const r = el.getBoundingClientRect();
          const speed = parseFloat(el.dataset.parallax);
          const offset = (r.top + r.height / 2 - vh / 2) * speed;
          el.style.transform = `translateY(${offset}px)`;
        });
        requestAnimationFrame(move);
      };
      move();
    }
  }

  /* ---------- Fake form submit ---------- */
  document.querySelectorAll("[data-fauxform]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"], .field button');
      const note = form.querySelector("[data-formnote]");
      if (btn) { btn.dataset.orig = btn.textContent; btn.textContent = "Sending…"; }
      setTimeout(() => {
        if (btn) btn.textContent = "Thank you ✓";
        if (note) note.textContent = "Thanks — you're on the list. Check your inbox for 10% off your first order.";
        form.reset();
        setTimeout(() => { if (btn) btn.textContent = btn.dataset.orig; }, 2600);
      }, 900);
    });
  });

  /* ---------- Year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
