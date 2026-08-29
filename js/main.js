/* MALCOLM LTD — homepage behaviour
   Progressive enhancement only: every section is readable with JS disabled. */
(function () {
  'use strict';

  document.documentElement.classList.add('js'); // no-op if the inline head script ran

  /* ---------------------------------------------------------------- header */
  var header = document.getElementById('siteHeader');

  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-stuck', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------ mobile nav */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  function closeNav() {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* --------------------------------------------------------- scroll reveal */
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showAll() {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  if (reduced || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    /* Stagger siblings inside the same grid so cards/steps cascade */
    ['.cards', '.steps'].forEach(function (sel) {
      var group = document.querySelector(sel);
      if (!group) return;
      Array.prototype.slice.call(group.children).forEach(function (child, i) {
        child.style.setProperty('--delay', (i * 90) + 'ms');
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });

    /* Safety net: if the page is restored mid-scroll, reveal what is on screen */
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) showAll();
    });
  }

  /* ---------------------------------------------------------------- footer */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
