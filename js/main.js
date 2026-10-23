/* MALCOLM LTD — homepage behaviour
   Progressive enhancement only: every section is readable with JS disabled. */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  function showAll() {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  if (reduced || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    ['.steps', '.reasons', '.values', '.support-cards', '.svc-rows'].forEach(function (sel) {
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
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });

    items.forEach(function (el) { io.observe(el); });

    window.addEventListener('pageshow', function (e) {
      if (e.persisted) showAll();
    });
  }

  /* ------------------------------------------------ testimonial carousel */
  var track = document.getElementById('quotesTrack');
  var dotsBox = document.getElementById('quotesDots');

  if (track && dotsBox) {
    var slides = Array.prototype.slice.call(track.children);
    var index = 0;

    if (slides.length > 1) {
      slides.forEach(function (slide, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', String(i === 0));
        dot.setAttribute('aria-label', 'Client story ' + (i + 1) + ' of ' + slides.length);
        dot.addEventListener('click', function () { go(i); });
        dotsBox.appendChild(dot);
      });

      var dots = Array.prototype.slice.call(dotsBox.children);

      var go = function (i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = 'translateX(' + (-index * 100) + '%)';
        dots.forEach(function (d, n) {
          d.setAttribute('aria-selected', String(n === index));
        });
        slides.forEach(function (s, n) {
          s.setAttribute('aria-hidden', String(n !== index));
        });
      };

      go(0);

      /* Keyboard: arrows move between stories when a dot has focus */
      dotsBox.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { go(index + 1); dots[index].focus(); }
        if (e.key === 'ArrowLeft')  { go(index - 1); dots[index].focus(); }
      });

      /* Touch swipe */
      var startX = null;
      track.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
      }, { passive: true });

      track.addEventListener('touchend', function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
        startX = null;
      });
    }
  }

  /* -------------------------------------------------------------- FAQ */
  Array.prototype.forEach.call(
    document.querySelectorAll('.acc-trigger'),
    function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;

      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));

        if (open) {
          if (reduced) { panel.hidden = true; return; }
          panel.style.height = panel.scrollHeight + 'px';
          requestAnimationFrame(function () {
            panel.style.transition = 'height 0.3s ease, opacity 0.2s ease';
            panel.style.overflow = 'hidden';
            panel.style.height = '0px';
            panel.style.opacity = '0';
          });
          window.setTimeout(function () {
            panel.hidden = true;
            panel.style.cssText = '';
          }, 300);
        } else {
          panel.hidden = false;
          if (reduced) return;
          var h = panel.scrollHeight;
          panel.style.overflow = 'hidden';
          panel.style.height = '0px';
          panel.style.opacity = '0';
          requestAnimationFrame(function () {
            panel.style.transition = 'height 0.3s ease, opacity 0.3s ease';
            panel.style.height = h + 'px';
            panel.style.opacity = '1';
          });
          window.setTimeout(function () { panel.style.cssText = ''; }, 320);
        }
      });
    }
  );

  /* ------------------------------------------------------------- contact */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        var bad = form.querySelector(':invalid');
        if (bad) bad.focus();
        status.className = 'form-status is-error';
        status.textContent = 'Please fill in the highlighted fields.';
        return;
      }

      var key = form.elements.access_key.value.trim();

      /* No endpoint configured yet — say so instead of failing silently. */
      if (!key) {
        status.className = 'form-status is-error';
        status.innerHTML = 'This form is not connected yet. Please email ' +
          '<a href="mailto:hello@malcolmltd.com"><strong>hello@malcolmltd.com</strong></a> ' +
          'and we will come straight back to you.';
        return;
      }

      var btn = form.querySelector('.btn-send');
      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.success) {
            status.className = 'form-status is-ok';
            status.textContent = 'Thanks — your message is on its way. We will be in touch shortly.';
            form.reset();
            form.classList.remove('was-validated');
          } else {
            throw new Error((data && data.message) || 'Send failed');
          }
        })
        .catch(function () {
          status.className = 'form-status is-error';
          status.innerHTML = 'Something went wrong sending that. Please email ' +
            '<a href="mailto:hello@malcolmltd.com"><strong>hello@malcolmltd.com</strong></a> instead.';
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.textContent = label; }
        });
    });
  }

  /* ---------------------------------------------------------------- footer */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
