/* ==========================================================================
   NATURE FORCE — EXPERIÊNCIA SCROLL-DRIVEN (camada premium)
   --------------------------------------------------------------------------
   Adicionada SOBRE o projeto existente — não altera a lógica original.
   - Anima apenas transform/opacity via custom properties (compositor).
   - Um único listener de scroll, com requestAnimationFrame (passive).
   - Sem dependências externas.
   - Respeita prefers-reduced-motion e, sem JS, o CSS mostra tudo normalmente.
   ========================================================================== */
(function () {
  'use strict';

  var docEl = document.documentElement;

  // Acessibilidade: usuário que opta por reduzir movimento não recebe efeitos.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Marca o estado "fx" → o CSS aplica os estados iniciais escondidos.
  docEl.classList.add('fx');

  // Intensidade reduzida em telas pequenas / touch (fluidez mobile).
  var isSmall = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
  var motionScale = isSmall ? 0.4 : 1;

  function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }

  /* ---------- 1. Barra de progresso global ---------- */
  var progressBar = document.getElementById('scrollProgressBar');

  /* ---------- 2. Hero — parallax cinematográfico ---------- */
  var hero = document.querySelector('.hero');
  var heroBg = document.querySelector('.hero-bg-img');
  var heroContent = document.querySelector('.hero-content');
  var heroOverlay = document.querySelector('.hero-overlay');

  /* ---------- 3. Elementos dirigidos pelo scroll ---------- */
  var groups = [
    { sel: '.sim-card',          type: 'scale' },
    { sel: '.benefit-list > li', type: 'rise', offset: 24 },
    { sel: '.steps-list > li',   type: 'rise', offset: 24 },
    { sel: '.faq-item',          type: 'rise', offset: 28 },
    { sel: '.footer-top',        type: 'rise', offset: 26 },
    { sel: '.footer-bottom',     type: 'rise', offset: 26 }
  ];

  var actives = [];

  groups.forEach(function (g) {
    var els = document.querySelectorAll(g.sel);
    for (var i = 0; i < els.length; i++) {
      els[i]._fx = { type: g.type, offset: g.offset || 28 };
      actives.push(els[i]);
    }
  });

  function settleFx(el) {
    el.classList.add('fx-in');
    el.style.removeProperty('--fx-p');
    el.style.removeProperty('--fx-scale');
    var i = actives.indexOf(el);
    if (i > -1) actives.splice(i, 1);
  }

  /* Viewport: entrada começa a 92% e termina a 38% da altura da tela */
  function progressOf(el) {
    var vh = window.innerHeight;
    var rect = el.getBoundingClientRect();
    var startY = vh * 0.92;
    var endY = vh * 0.38;
    return clamp01((startY - rect.top) / (startY - endY));
  }

  function applyFx(el, p) {
    p = clamp01(p);
    el.style.setProperty('--fx-p', String(p));
    if (el._fx.type === 'scale') {
      el.style.setProperty('--fx-scale', String(0.94 + 0.06 * p));
    }
  }

  function update() {
    var vh = window.innerHeight;
    var i, el, p;

    /* Progresso global */
    if (progressBar) {
      var maxScroll = (docEl.scrollHeight - vh) || 1;
      progressBar.style.transform = 'scaleX(' + clamp01(window.pageYOffset / maxScroll) + ')';
    }

    /* Hero parallax (background desce / conteúdo sobe e esmaece) */
    if (hero && heroBg && heroContent) {
      var rect = hero.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < vh) {
        var travel = (rect.height + vh) * 0.72;
        var pHero = clamp01(-rect.top / travel);
        var k = motionScale;
        heroBg.style.transform =
          'translate3d(0, ' + Math.round(pHero * 52 * k) + 'px, 0) scale(1.06)';
        heroContent.style.transform =
          'translate3d(0, ' + Math.round(-pHero * 96 * k) + 'px, 0)';
        heroContent.style.opacity =
          String(clamp01(1 - pHero * (k >= 1 ? 1.35 : 0.95)));
        if (heroOverlay) {
          heroOverlay.style.opacity = String(clamp01(1 - pHero * 0.45));
        }
      }
    }

    /* Elementos dirigidos pelo scroll */
    for (i = actives.length - 1; i >= 0; i--) {
      el = actives[i];
      p = progressOf(el);
      if (p >= 1) {
        settleFx(el);
      } else {
        applyFx(el, p);
      }
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      try { update(); } finally { ticking = false; }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Passada inicial (cobre âncoras tipo #faq e elementos já em tela).
  update();
})();