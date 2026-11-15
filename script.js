/* ==========================================================================
   BIJOY — Liquid Glass Portfolio · script.js
   Vanilla JS only. Every effect degrades gracefully.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ----------------------------------------------------------------------
     1. Mobile navigation
     ---------------------------------------------------------------------- */
  var nav = $("#nav");
  var navLinks = $("#navLinks");
  var navToggle = $("#navToggle");

  function closeMenu() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    var icon = navToggle.querySelector("i");
    if (icon) icon.className = "fa-solid fa-bars";
  }

  function openMenu() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    var icon = navToggle.querySelector("i");
    if (icon) icon.className = "fa-solid fa-xmark";
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      if (navLinks.classList.contains("is-open")) closeMenu();
      else openMenu();
    });
  }

  $$(".nav__link").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  document.addEventListener("click", function (e) {
    if (!nav || !navLinks) return;
    if (!nav.contains(e.target)) closeMenu();
  });

  /* ----------------------------------------------------------------------
     2. Sticky nav state + scroll progress + back-to-top
     ---------------------------------------------------------------------- */
  var scrollBar = $("#scrollBar");
  var toTop = $("#toTop");

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle("is-scrolled", y > 12);

    if (scrollBar) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? Math.min(y / docHeight, 1) : 0;
      scrollBar.style.transform = "scaleX(" + progress + ")";
    }

    if (toTop) toTop.classList.toggle("is-visible", y > 600);
  }

  var ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );
  onScroll();

  /* ----------------------------------------------------------------------
     3. Scroll reveal (IntersectionObserver, single observer)
     ---------------------------------------------------------------------- */
  var revealEls = $$(".reveal");

  // small stagger inside [data-stagger] containers
  $$("[data-stagger]").forEach(function (group) {
    $$(".reveal", group).forEach(function (el, i) {
      el.style.setProperty("--d", Math.min(i * 70, 350) + "ms");
    });
  });

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ----------------------------------------------------------------------
     4. Active section detection
     ---------------------------------------------------------------------- */
  var sections = $$("main section[id]");
  var linkFor = {};

  $$(".nav__link").forEach(function (link) {
    var id = (link.getAttribute("href") || "").replace("#", "");
    if (id) linkFor[id] = link;
  });

  function setActive(id) {
    $$(".nav__link").forEach(function (link) {
      var isActive = link === linkFor[id];
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var visible = {};

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });

        // pick the most visible section currently on screen
        var bestId = null;
        var bestRatio = 0;
        Object.keys(visible).forEach(function (id) {
          if (visible[id] > bestRatio) {
            bestRatio = visible[id];
            bestId = id;
          }
        });

        if (bestId) setActive(bestId);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.15, 0.4, 0.75, 1] }
    );

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ----------------------------------------------------------------------
     5. Typing animation
     ---------------------------------------------------------------------- */
  var typed = $("#typed");
  if (typed) {
    var words = (typed.getAttribute("data-words") || "").split("|").filter(Boolean);

    if (reduceMotion || words.length < 2) {
      typed.textContent = words[0] || "";
    } else {
      var wordIndex = 0;
      var charIndex = 0;
      var deleting = false;

      var tick = function () {
        var word = words[wordIndex];
        charIndex += deleting ? -1 : 1;
        typed.textContent = word.slice(0, charIndex);

        var delay = deleting ? 42 : 78;

        if (!deleting && charIndex === word.length) {
          deleting = true;
          delay = 1700;
        } else if (deleting && charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          delay = 340;
        }

        window.setTimeout(tick, delay);
      };

      typed.textContent = "";
      window.setTimeout(tick, 500);
    }
  }

  /* ----------------------------------------------------------------------
     6. Contact form — honest, no fake sending
     ---------------------------------------------------------------------- */
  
var form = $("#contactForm");
var status = $("#formStatus");

if (form && status) {
  form.addEventListener("submit", function (e) {
    var name = form.elements.name;
    var email = form.elements.email;
    var message = form.elements.message;

    status.classList.remove("is-error");

    if (
      !name.value.trim() ||
      !email.value.trim() ||
      !message.value.trim()
    ) {
      e.preventDefault();
      status.textContent = "Please fill in all fields.";
      status.classList.add("is-visible", "is-error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      e.preventDefault();
      status.textContent = "Please enter a valid email address.";
      status.classList.add("is-visible", "is-error");
      return;
    }

    status.textContent = "Sending your message...";
    status.classList.add("is-visible");
  });
}


  /* ----------------------------------------------------------------------
     7. Anchor links: close menu, respect sticky nav offset
     ---------------------------------------------------------------------- */
  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      closeMenu();

      var navOffset = nav ? nav.getBoundingClientRect().height + 24 : 16;
      var top = target.getBoundingClientRect().top + window.pageYOffset - navOffset;

      window.scrollTo({
        top: Math.max(top, 0),
        behavior: reduceMotion ? "auto" : "smooth"
      });

      // keep the URL in sync without an extra jump
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });
})();
