/* ==========================================================================
   NATURE FORCE — UI/UX SÊNIOR
   Calculadora preservada integralmente
   Microinterações + feedback visual
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  lucide.createIcons({ strokeWidth: 1.5, class: 'icon' });

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var header = document.querySelector('.site-header');
  var menuToggle = document.querySelector('.menu-toggle');
  var menuClose = document.querySelector('.menu-close');

  var NATURE_CONFIG = window.NATURE_CONFIG || {
    whatsapp: {
      numero: '5581996600664',
      mensagemPadrao: 'Olá! Vim pelo site da Nature Force e gostaria de saber mais sobre as soluções disponíveis.'
    },
    simulador: {
      percentualEconomia: 20
    }
  };

  /* ========== HEADER SCROLL ========== */
  function initHeaderScroll() {
    if (!header) return;

    function updateHeader() {
      if (window.pageYOffset > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateHeader();
          ticking = false;
        });
        ticking = true;
      }
    });

    updateHeader();
  }

  /* ========== MOBILE MENU ========== */
  function initMobileMenu() {
    if (!menuToggle || !menuClose) return;

    var mainNav = document.querySelector('.main-nav');
    if (!mainNav) return;

    menuToggle.addEventListener('click', function() {
      mainNav.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });

    menuClose.addEventListener('click', function() {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });

    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Fechar com tecla ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ========== REVEAL ANIMATIONS ========== */
  function initAnimations() {
    var revealElements = document.querySelectorAll('.reveal');

    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(function(el) {
      revealObserver.observe(el);
    });
  }

  /* ========== SIMULADOR (lógica preservada) ========== */
  function initSimulator() {
    var contaInput = document.getElementById('contaValor');
    if (!contaInput) return;

    var percentualEconomia = NATURE_CONFIG.simulador.percentualEconomia || 20;
    var currentStep = 1;
    var totalSteps = 3;
    var tipoImovel = 'residencial';

    var simSteps = document.querySelectorAll('.sim-step');
    var progressBar = document.getElementById('simProgressBar');
    var progressSteps = document.querySelectorAll('.sim-progress-step');

    // Chips de valores rápidos
    var chips = document.querySelectorAll('.chip');
    chips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        chips.forEach(function(c) { c.classList.remove('active'); });
        chip.classList.add('active');
        contaInput.value = chip.getAttribute('data-value');
        contaInput.dispatchEvent(new Event('input'));
      });
    });

    // Input de valor (sanitização mantida)
    contaInput.addEventListener('input', function(e) {
      var valorStr = e.target.value.replace(/[^\d,.]/g, '').replace(',', '.');
      var valor = parseFloat(valorStr) || 0;
      valor = Math.round(valor * 100) / 100;

      // Atualizar chip ativo
      chips.forEach(function(chip) {
        var chipValue = parseFloat(chip.getAttribute('data-value'));
        if (Math.abs(chipValue - valor) < 1) {
          chips.forEach(function(c) { c.classList.remove('active'); });
          chip.classList.add('active');
        }
      });

      // Feedback visual: escala sutil no input
      if (valor > 0) {
        contaInput.parentElement.classList.remove('sim-input-empty');
        contaInput.parentElement.classList.add('sim-input-filled');
      } else {
        contaInput.parentElement.classList.add('sim-input-empty');
        contaInput.parentElement.classList.remove('sim-input-filled');
      }

      updateResults(valor);
    });

    // Opções de tipo de imóvel
    var simOptions = document.querySelectorAll('.sim-option');
    simOptions.forEach(function(option) {
      option.addEventListener('click', function() {
        simOptions.forEach(function(o) { o.classList.remove('active'); });
        option.classList.add('active');
        tipoImovel = option.getAttribute('data-value');
      });
    });

    // Botões próximo
    var nextButtons = document.querySelectorAll('.sim-next');
    nextButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        // Validação: etapa 1 precisa de valor > 0
        if (currentStep === 1) {
          var valorStr = contaInput.value.replace(/[^\d,.]/g, '').replace(',', '.');
          var valor = parseFloat(valorStr) || 0;
          if (valor <= 0) {
            contaInput.parentElement.classList.add('sim-input-error');
            contaInput.focus();
            setTimeout(function() {
              contaInput.parentElement.classList.remove('sim-input-error');
            }, 1500);
            return;
          }
        }
        var next = parseInt(btn.getAttribute('data-next'));
        goToStep(next);
      });
    });

    // Botões voltar
    var backButtons = document.querySelectorAll('.sim-back');
    backButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var prev = parseInt(btn.getAttribute('data-prev'));
        goToStep(prev);
      });
    });

    // Refazer simulação
    var restartBtn = document.getElementById('simRestart');
    if (restartBtn) {
      restartBtn.addEventListener('click', function() {
        goToStep(1);
      });
    }

    function goToStep(step) {
      if (step < 1 || step > totalSteps) return;

      currentStep = step;

      simSteps.forEach(function(s) {
        s.classList.remove('active');
      });

      var targetStep = document.querySelector('.sim-step[data-step="' + step + '"]');
      if (targetStep) {
        targetStep.classList.add('active');
      }

      // Atualizar barra de progresso
      if (progressBar) {
        var progress = ((step - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = progress + '%';
      }

      // Atualizar steps do progresso
      progressSteps.forEach(function(ps) {
        var psStep = parseInt(ps.getAttribute('data-step'));
        ps.classList.remove('active', 'done');
        if (psStep < step) {
          ps.classList.add('done');
        } else if (psStep === step) {
          ps.classList.add('active');
        }
      });

      // Se chegou ao resultado, recalcular
      if (step === 3) {
        var valor = parseFloat(contaInput.value.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
        updateResults(valor);
        animateResultValues();
      }
    }

    function updateResults(valor) {
      var economia = valor * percentualEconomia / 100;
      var economiaAnual = economia * 12;
      var valorLiquido = valor - economia;

      var economiaMes = document.getElementById('economiaMes');
      var economiaAno = document.getElementById('economiaAno');
      var valorEstimado = document.getElementById('valorEstimado');
      var economiaPercentual = document.getElementById('economiaPercentual');
      var simCta = document.getElementById('simCta');
      var simAviso = document.getElementById('simAviso');
      var chartDiscounted = document.getElementById('chartDiscounted');

      if (economiaMes) {
        economiaMes.textContent = 'R$ ' + formatBRL(economia);
      }
      if (economiaAno) {
        economiaAno.textContent = 'R$ ' + formatBRL(economiaAnual);
      }
      if (valorEstimado) {
        valorEstimado.textContent = 'R$ ' + formatBRL(valorLiquido);
      }
      if (economiaPercentual) {
        economiaPercentual.textContent = 'Até ' + percentualEconomia + '% de desconto';
      }

      if (chartDiscounted) {
        var discountPercent = 100 - percentualEconomia;
        chartDiscounted.style.height = discountPercent + '%';
      }

      if (simCta) {
        var mensagem = valor > 0
          ? 'Olá! Vim pelo site da Nature Force e gostaria de saber mais sobre as soluções disponíveis. Fiz uma simulação com conta de R$ ' + formatBRL(valor) + '.'
          : NATURE_CONFIG.whatsapp.mensagemPadrao;
        simCta.href = 'https://wa.me/' + NATURE_CONFIG.whatsapp.numero + '?text=' + encodeURIComponent(mensagem);
      }

      if (simAviso) {
        simAviso.style.display = valor > 0 ? 'block' : 'none';
      }
    }

    function animateResultValues() {
      var economiaMes = document.getElementById('economiaMes');
      var economiaAno = document.getElementById('economiaAno');
      var valorEstimado = document.getElementById('valorEstimado');

      if (!economiaMes || !economiaAno || !valorEstimado) return;

      var valor = parseFloat(contaInput.value.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
      var economia = valor * percentualEconomia / 100;
      var economiaAnual = economia * 12;
      var valorLiquido = valor - economia;

      animateValue(economiaMes, economia);
      animateValue(economiaAno, economiaAnual);
      animateValue(valorEstimado, valorLiquido);
    }

    function animateValue(element, target) {
      var duration = prefersReducedMotion ? 0 : 1000;
      var startTime = null;

      function update(timestamp) {
        if (duration === 0) {
          element.textContent = 'R$ ' + formatBRL(target);
          return;
        }
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var easeOut = 1 - Math.pow(1 - progress, 3);
        var current = target * easeOut;

        element.textContent = 'R$ ' + formatBRL(current);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }

    function formatBRL(value) {
      return Math.round(value).toLocaleString('pt-BR');
    }

    // Inicializar com valor padrão
    if (contaInput.value === '') {
      contaInput.value = '500';
      contaInput.dispatchEvent(new Event('input'));
    }

    // Inicializar progresso
    goToStep(1);
  }

  /* ========== FAQ ========== */
  function initFaq() {
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
      var summary = item.querySelector('summary');
      if (!summary) return;

      summary.addEventListener('click', function(e) {
        // Fechar outros itens abertos
        faqItems.forEach(function(other) {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      });
    });
  }

  /* ========== WHATSAPP FLOAT ========== */
  function initWhatsApp() {
    var floatBtn = document.getElementById('floatWhatsApp');
    if (!floatBtn) return;

    var mensagem = NATURE_CONFIG.whatsapp.mensagemPadrao || 'Olá! Gostaria de saber mais sobre a Nature Force.';
    floatBtn.href = 'https://wa.me/' + NATURE_CONFIG.whatsapp.numero + '?text=' + encodeURIComponent(mensagem);
  }

  /* ========== RIPPLE FEEDBACK (microinteração) ========== */
  function initButtonFeedback() {
    var buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(function(btn) {
      if (btn.classList.contains('nav-cta')) return;

      btn.addEventListener('mousedown', function() {
        btn.style.transform = 'translateY(0) scale(0.98)';
      });

      btn.addEventListener('mouseup', function() {
        btn.style.transform = '';
        setTimeout(function() {
          btn.style.transition = '';
        }, 200);
      });

      btn.addEventListener('mouseleave', function() {
        btn.style.transform = '';
      });
    });
  }

  /* ========== INIT ========== */
  initHeaderScroll();
  initMobileMenu();
  initAnimations();
  initSimulator();
  initFaq();
  initWhatsApp();
  initButtonFeedback();
});