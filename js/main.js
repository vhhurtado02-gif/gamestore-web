/**
 * GameStore — main.js
 * Lógica compartida entre páginas: menú hamburguesa, carrusel, formulario multi-paso
 * y micro-interacciones (scroll-reveal, navbar dinámica, efecto ripple en botones).
 */

const GameStore = (function () {

  // ── Menú hamburguesa (usado en las 4 páginas) ──
  function initMenuToggle() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        const isOpen = menu.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  }

  // ── Carrusel Bootstrap (usado en inicio.html y contacto.html) ──
  function initCarousel(selector, interval, options) {
    document.addEventListener('DOMContentLoaded', function () {
      const el = document.querySelector(selector);
      if (el && typeof bootstrap !== 'undefined') {
        new bootstrap.Carousel(el, Object.assign({ interval: interval, ride: 'carousel', pause: 'hover' }, options));
      }
    });
  }

  // ── Scroll-reveal: los elementos con clase "reveal" aparecen con fundido + deslizamiento ──
  // al entrar en el viewport. Si el navegador no soporta IntersectionObserver, se muestran directo.
  function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => observer.observe(el));
  }

  // ── Vídeos de categoría (reemplazan los GIF animados): solo reproducen mientras están ──
  // visibles en pantalla. Ahorra datos y batería; si no hay soporte de IntersectionObserver,
  // el atributo autoplay del <video> ya cubre la reproducción normal.
  function initLazyVideos() {
    const videos = document.querySelectorAll('video[preload="none"]');
    if (!videos.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (video.readyState === 0) { video.load(); }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.25 });

    videos.forEach(v => observer.observe(v));
  }

  // ── Navbar dinámica: agrega la clase "scrolled" cuando el usuario baja la página ──
  function initNavbarScroll() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    function update() {
      if (window.scrollY > 24) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  // ── Efecto ripple: onda expansiva desde el punto de clic en botones ──
  // Usa delegación de eventos (un solo listener en document) para cubrir TODOS los botones
  // del sitio, incluidos los que se crean dinámicamente después de cargar la página
  // (modal de producto, ítems del carrito, resultado del quiz, etc.), sin tener que
  // volver a escanear el DOM cada vez que algo nuevo aparece.
  function initRippleButtons() {
    const selector = [
      '.btn-primary', '.btn-outline', '.btn-card', '.btn-next', '.btn-prev', '.btn-submit',
      '.chip', '.quiz-option', '.menu-toggle', '.theme-toggle',
      '.carousel-control-prev', '.carousel-control-next',
      '.cart-trigger', '.cart-drawer-close', '.cart-item-remove', '.qty-btn',
      '.badge-trigger', '.badge-panel-close',
      '.history-card-toggle', '.product-detail-btn', '.product-modal-close'
    ].join(', ');

    document.addEventListener('click', function (e) {
      const btn = e.target.closest(selector);
      if (!btn) return;

      btn.classList.add('has-ripple');
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.className = 'ripple-effect';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());

      // Si es un enlace normal (<a href>) con clic normal (sin Ctrl/Cmd/Shift/rueda),
      // esperamos a que se vea el ripple antes de navegar, para que no se corte la animación.
      const href = btn.getAttribute('href');
      const isPlainLeftClick = e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey;
      const isRealLink = btn.tagName === 'A' && href && !href.startsWith('#');

      if (isRealLink && isPlainLeftClick && btn.target !== '_blank') {
        e.preventDefault();
        setTimeout(() => { window.location.href = href; }, 320);
      }
    });
  }

  // ── Toggle de tema claro/oscuro, persistido en localStorage ──
  function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    const STORAGE_KEY = 'gs-theme';

    function applyIcon() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      btn.textContent = isLight ? '☀️' : '🌙';
      btn.setAttribute('aria-label', isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    }

    applyIcon(); // el <head> ya aplicó el tema guardado; aquí solo sincronizamos el ícono

    btn.addEventListener('click', function () {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem(STORAGE_KEY, 'dark'); } catch (e) {}
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        try { localStorage.setItem(STORAGE_KEY, 'light'); } catch (e) {}
      }
      applyIcon();
    });
  }

  // ── Formulario multi-paso (usado en inicio.html y contacto.html) ──
  // options: { formId, successTitle, successText }
  function initMultiStepForm(options) {
    const form = document.getElementById(options.formId);
    if (!form) return;

    const steps = form.querySelectorAll('.step');
    const dots = [document.getElementById('dot1'), document.getElementById('dot2'), document.getElementById('dot3')];
    const lines = [document.getElementById('line1'), document.getElementById('line2')];
    let current = 0;

    function goTo(n) {
      steps[current].style.display = 'none';
      dots[current].classList.remove('active');
      if (n > current) {
        dots[current].classList.add('done');
        if (lines[current]) lines[current].classList.add('done');
      }
      current = n;
      steps[current].style.display = 'block';
      dots[current].classList.add('active');
    }

    form.querySelectorAll('.btn-next').forEach(btn => btn.addEventListener('click', () => {
      const inputs = steps[current].querySelectorAll('input, textarea');
      for (let i of inputs) { if (!i.checkValidity()) { i.reportValidity(); return; } }
      if (current < steps.length - 1) goTo(current + 1);
    }));

    form.querySelectorAll('.btn-prev').forEach(btn => btn.addEventListener('click', () => {
      if (current > 0) goTo(current - 1);
    }));

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      Swal.fire({
        title: options.successTitle,
        text: options.successText,
        icon: 'success',
        confirmButtonColor: '#ff2d55',
        timer: 3000,
        timerProgressBar: true,
      });
      this.reset();
      steps.forEach((s, i) => { s.style.display = i === 0 ? 'block' : 'none'; });
      dots.forEach(d => { d.classList.remove('active', 'done'); });
      lines.forEach(l => { if (l) l.classList.remove('done'); });
      dots[0].classList.add('active');
      current = 0;
    });
  }

  // ── Inicializador de las micro-interacciones, para llamar una sola vez por página ──
  function initInteractions() {
    document.addEventListener('DOMContentLoaded', function () {
      initScrollReveal();
      initNavbarScroll();
      initRippleButtons();
      initThemeToggle();
      initLazyVideos();
    });
  }

  // ── Buscador en vivo + filtros de categoría (usado en grillas.html) ──
  // options: { searchId, chipsId, blockSelector, noResultsId, clearBtnId }
  function initCatalogFilter(options) {
    const searchInput = document.getElementById(options.searchId);
    const chipsWrap = document.getElementById(options.chipsId);
    const blocks = document.querySelectorAll(options.blockSelector);
    const noResults = document.getElementById(options.noResultsId);
    const clearBtn = document.getElementById(options.clearBtnId);
    if (!searchInput || !chipsWrap || !blocks.length) return;

    const chips = chipsWrap.querySelectorAll('.chip');
    let activeCategory = 'all';
    let debounceTimer = null;

    // Quita tildes para que "pokemon" encuentre "Pokémon", etc.
    function normalize(str) {
      return (str || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }

    function applyFilters() {
      // Se busca por palabras sueltas: todas deben aparecer en algún lado de los keywords,
      // sin importar el orden. Así "kart mario" también encuentra "Mario Kart".
      const queryWords = normalize(searchInput.value.trim()).split(/\s+/).filter(Boolean);
      let visibleCount = 0;

      blocks.forEach(function (block) {
        const matchesCategory = activeCategory === 'all' || block.getAttribute('data-category') === activeCategory;
        const keywords = normalize(block.getAttribute('data-keywords'));
        const matchesQuery = queryWords.length === 0 || queryWords.every(function (word) {
          return keywords.indexOf(word) !== -1;
        });
        const visible = matchesCategory && matchesQuery;

        block.classList.toggle('is-hidden', !visible);
        if (visible) visibleCount++;
      });

      if (noResults) noResults.hidden = visibleCount > 0;
    }

    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyFilters, 120);
    });

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) {
          c.classList.remove('active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
        activeCategory = chip.getAttribute('data-filter');
        applyFilters();
      });
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        searchInput.value = '';
        activeCategory = 'all';
        chips.forEach(function (c, i) {
          c.classList.toggle('active', i === 0);
          c.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
        });
        applyFilters();
        searchInput.focus();
      });
    }

    
    // Si se llega con ?cat=nintendo (desde inicio, quiz, etc.), preselecciona ese chip
    // y hace scroll al ancla de la categoría para que el usuario quede posicionado ahí.
    const urlCategory = new URLSearchParams(window.location.search).get('cat');
    if (urlCategory) {
      const matchingChip = chipsWrap.querySelector('.chip[data-filter="' + urlCategory + '"]');
      if (matchingChip) matchingChip.click();

      // Scroll suave al ancla de la categoría (después de un breve delay para que el filtro aplique)
      setTimeout(function () {
        var anchor = document.getElementById(urlCategory);
        if (anchor) {
          var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
          var top = anchor.getBoundingClientRect().top + window.scrollY - navH - 12;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }, 150);
    }

  }

  // ── Sistema de logros (badges) + código Konami — activo en todas las páginas ──
  // Expone GameStore.unlockBadge(id) para que otras features (quiz, buscador) desbloqueen logros.
  function initAchievements() {
    const STORAGE_KEY = 'gs-badges';
    const BADGES = {
      explorador: { icon: '🗺️', title: 'Explorador', desc: 'Recorriste las 6 categorías del catálogo' },
      detective:  { icon: '🔍', title: 'Detective Gamer', desc: 'Usaste el buscador del catálogo' },
      estratega:  { icon: '🎯', title: 'Estratega', desc: 'Completaste el quiz de recomendación' },
      leyenda:    { icon: '👑', title: 'Leyenda Gamer', desc: 'Encontraste el código Konami' },
      historiador:{ icon: '📜', title: 'Historiador', desc: 'Exploraste la historia de las 5 compañías' },
      comprador:  { icon: '🛒', title: 'Comprador', desc: 'Completaste tu primera compra simulada' }
    };
    const ORDER = ['explorador', 'detective', 'estratega', 'leyenda', 'historiador', 'comprador'];

    function getUnlocked() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) { return []; }
    }
    function saveUnlocked(list) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {}
    }

    let unlocked = getUnlocked();

    // Evita duplicar la UI si initAchievements se llamara más de una vez por error
    if (document.querySelector('.badge-trigger')) return;

    // ── Botón flotante + panel de logros, inyectados una sola vez por página ──
    const trigger = document.createElement('button');
    trigger.className = 'badge-trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-label', 'Ver mis logros gamer');
    trigger.innerHTML = '🏆<span class="badge-count" id="badgeCount"></span>';
    document.body.appendChild(trigger);

    const panel = document.createElement('div');
    panel.className = 'badge-panel';
    panel.innerHTML =
      '<div class="badge-panel-header">' +
        '<h3>Mis Logros Gamer</h3>' +
        '<button class="badge-panel-close" type="button" aria-label="Cerrar panel de logros">✕</button>' +
      '</div>' +
      '<div class="badge-panel-list">' +
        ORDER.map(function (id) {
          const b = BADGES[id];
          return '<div class="badge-item" data-badge-id="' + id + '">' +
            '<span class="badge-item-icon">' + b.icon + '</span>' +
            '<div class="badge-item-text"><h4>' + b.title + '</h4><p>' + b.desc + '</p></div>' +
          '</div>';
        }).join('') +
      '</div>';
    document.body.appendChild(panel);

    const toast = document.createElement('div');
    toast.className = 'badge-toast';
    document.body.appendChild(toast);

    function paintPanel() {
      const countEl = document.getElementById('badgeCount');
      if (countEl) countEl.textContent = unlocked.length + '/' + ORDER.length;
      panel.querySelectorAll('.badge-item').forEach(function (el) {
        const id = el.getAttribute('data-badge-id');
        el.classList.toggle('is-unlocked', unlocked.indexOf(id) !== -1);
      });
    }
    paintPanel();

    trigger.addEventListener('click', function () { panel.classList.toggle('open'); });
    panel.querySelector('.badge-panel-close').addEventListener('click', function () {
      panel.classList.remove('open');
    });
    document.addEventListener('click', function (e) {
      if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== trigger) {
        panel.classList.remove('open');
      }
    });

    function showToast(badge) {
      toast.innerHTML = '<span class="badge-toast-icon">' + badge.icon + '</span>' +
        '<div><strong>¡Logro desbloqueado!</strong><br>' + badge.title + '</div>';
      toast.classList.add('show');
      clearTimeout(toast._timer);
      toast._timer = setTimeout(function () { toast.classList.remove('show'); }, 4000);
    }

    function unlockBadge(id) {
      if (!BADGES[id] || unlocked.indexOf(id) !== -1) return;
      unlocked.push(id);
      saveUnlocked(unlocked);
      paintPanel();
      showToast(BADGES[id]);
    }
    GameStore.unlockBadge = unlockBadge;

    // ── Código Konami: ↑ ↑ ↓ ↓ ← → ← → B A ──
    const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    document.addEventListener('keydown', function (e) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = KONAMI[konamiIndex];
      if (key === expected) {
        konamiIndex++;
        if (konamiIndex === KONAMI.length) {
          konamiIndex = 0;
          triggerKonamiEffect();
          unlockBadge('leyenda');
        }
      } else {
        konamiIndex = (key === KONAMI[0]) ? 1 : 0;
      }
    });

    function triggerKonamiEffect() {
      const fx = document.createElement('div');
      fx.className = 'konami-fx';
      fx.innerHTML = '<div class="konami-fx-text">🎮 CÓDIGO KONAMI ACTIVADO<br><span>Bienvenido, Leyenda Gamer</span></div>';
      document.body.appendChild(fx);
      requestAnimationFrame(function () { fx.classList.add('show'); });
      setTimeout(function () {
        fx.classList.remove('show');
        setTimeout(function () { fx.remove(); }, 500);
      }, 2200);
    }

    // ── Equivalente táctil del código Konami (mobile no tiene flechas/teclado) ──
    // Mismo espíritu, gestos en vez de teclas: deslizar arriba-arriba-abajo-abajo-
    // izquierda-derecha-izquierda-derecha, y terminar con dos toques rápidos (equivalente a B-A).
    const TOUCH_KONAMI = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'tap', 'tap'];
    let touchIndex = 0;
    let touchStartX = 0, touchStartY = 0, touchStartTime = 0;

    document.addEventListener('touchstart', function (e) {
      const t = e.changedTouches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      const dt = Date.now() - touchStartTime;
      const absDx = Math.abs(dx), absDy = Math.abs(dy);

      let gesture = null;
      if (absDx < 12 && absDy < 12 && dt < 300) {
        gesture = 'tap';
      } else if (Math.max(absDx, absDy) > 40) {
        gesture = absDx > absDy ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
      }
      if (!gesture) return;

      const expected = TOUCH_KONAMI[touchIndex];
      if (gesture === expected) {
        touchIndex++;
        if (touchIndex === TOUCH_KONAMI.length) {
          touchIndex = 0;
          triggerKonamiEffect();
          unlockBadge('leyenda');
        }
      } else {
        touchIndex = (gesture === TOUCH_KONAMI[0]) ? 1 : 0;
      }
    }, { passive: true });

    // ── Logro "Explorador": recorrer las 6 categorías del catálogo (solo aplica en grillas.html) ──
    const catBlocks = document.querySelectorAll('.category-block[data-category]');
    if (catBlocks.length) {
      const visited = new Set();
      const catObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visited.add(entry.target.getAttribute('data-category'));
            if (visited.size >= catBlocks.length) {
              unlockBadge('explorador');
              catObserver.disconnect();
            }
          }
        });
      }, { threshold: 0.35 });
      catBlocks.forEach(function (b) { catObserver.observe(b); });
    }

    // ── Logro "Detective Gamer": usar el buscador del catálogo (solo aplica en grillas.html) ──
    const searchInput = document.getElementById('catalogSearch');
    if (searchInput) {
      const onFirstSearch = function () {
        if (searchInput.value.trim().length > 0) {
          unlockBadge('detective');
          searchInput.removeEventListener('input', onFirstSearch);
        }
      };
      searchInput.addEventListener('input', onFirstSearch);
    }
  }

  // ── Mini-quiz de recomendación (usado en inicio.html) ──
  // options: { quizId, resultId }
  function initGamerQuiz(options) {
    const quiz = document.getElementById(options.quizId);
    const resultBox = document.getElementById(options.resultId);
    if (!quiz || !resultBox) return;

    const steps = quiz.querySelectorAll('.quiz-step');
    const dots = quiz.querySelectorAll('.quiz-dot');
    const questionsWrap = quiz.querySelector('.quiz-questions');
    let current = 0;
    let votes = [];

    const RESULTS = {
      nintendo:    { title: 'Nintendo',         tag: 'Diversión para todos, siempre.',       slug: 'nintendo',    img: 'IMAGENES/swithmario.jpg' },
      microsoft:   { title: 'Xbox',              tag: 'Potencia y la vanguardia del gaming.', slug: 'microsoft',   img: 'IMAGENES/gaming.jpg' },
      ps_sony:     { title: 'PlayStation',       tag: 'Las experiencias narrativas más intensas.', slug: 'ps_sony', img: 'IMAGENES/dualshok.jpg' },
      perifericos: { title: 'Periféricos Pro',   tag: 'Tu setup, llevado al siguiente nivel.', slug: 'perifericos', img: 'IMAGENES/tecladocontr.jpg' },
      oldschool:   { title: 'Old School',        tag: 'Nostalgia y coleccionismo puro.',      slug: 'oldschool',   img: 'IMAGENES/gameboy.jpg' },
      online:      { title: 'Online · Torneos',  tag: 'Compite y conecta con el mundo.',      slug: 'online',      img: 'IMAGENES/torneo.jpg' }
    };

    function goTo(n) {
      steps[current].classList.add('step-hidden');
      current = n;
      steps[current].classList.remove('step-hidden');
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });

      // Accesibilidad: anunciar el avance y mover el foco a la nueva pregunta,
      // para que un lector de pantalla note el cambio (antes quedaba en silencio)
      const progressEl = document.getElementById('quizProgress');
      if (progressEl) progressEl.textContent = 'Pregunta ' + (current + 1) + ' de ' + steps.length;
      const heading = steps[current].querySelector('h3');
      if (heading) heading.focus();
    }

    quiz.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.setAttribute('aria-pressed', 'true');
        votes.push(btn.getAttribute('data-category'));
        if (current < steps.length - 1) {
          goTo(current + 1);
        } else {
          showResult();
        }
      });
    });

    function showResult() {
      const tally = {};
      votes.forEach(function (v) { tally[v] = (tally[v] || 0) + 1; });
      let winner = votes[0];
      let max = 0;
      Object.keys(tally).forEach(function (k) {
        if (tally[k] > max) { max = tally[k]; winner = k; }
      });
      const r = RESULTS[winner];

      questionsWrap.hidden = true;
      quiz.querySelector('.quiz-dots').hidden = true;
      resultBox.hidden = false;
      resultBox.innerHTML =
        '<img src="' + r.img + '" alt="' + r.title + '" />' +
        '<div class="quiz-result-text">' +
          '<span class="eyebrow">Tu perfil gamer</span>' +
          '<h3>' + r.title + '</h3>' +
          '<p>' + r.tag + '</p>' +
          '<div class="quiz-result-actions">' +
            '<a href="grillas.html?cat=' + r.slug + '#' + r.slug + '" class="btn-primary">Ver mi categoría →</a>' +
            '<button type="button" class="btn-outline quiz-retry">Repetir quiz</button>' +
          '</div>' +
        '</div>';
      resultBox.querySelector('.quiz-retry').addEventListener('click', resetQuiz);

      if (typeof GameStore.unlockBadge === 'function') GameStore.unlockBadge('estratega');
    }

    function resetQuiz() {
      votes = [];
      steps.forEach(function (s, i) { s.classList.toggle('step-hidden', i !== 0); });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === 0); });
      current = 0;
      questionsWrap.hidden = false;
      quiz.querySelector('.quiz-dots').hidden = false;
      resultBox.hidden = true;
    }
  }

  // ── Timeline de historia de compañías gamer (usado en historia.html) ──
  // Expande/colapsa cada tarjeta de compañía y desbloquea "Historiador" al explorar las 5.
  function initHistoryTimeline(options) {
    const grids = document.querySelectorAll(options.gridSelector);
    if (!grids.length) return;

    const cards = document.querySelectorAll('.history-card');
    if (!cards.length) return;

    const explored = new Set();
    const TOTAL_COMPANIES = cards.length;

    cards.forEach(function (card) {
      const toggle = card.querySelector('.history-card-toggle');
      const body = card.querySelector('.history-card-body');
      const company = card.getAttribute('data-company');

      toggle.addEventListener('click', function () {
        const isOpen = card.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (body) body.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

        if (isOpen) {
          explored.add(company);
          if (explored.size >= TOTAL_COMPANIES && typeof GameStore.unlockBadge === 'function') {
            GameStore.unlockBadge('historiador');
          }
        }
      });
    });
  }

  // ── Tarjetas de historia embebidas dentro del catálogo (grillas.html) ──
  // Mismo componente visual que historia.html, pero con su propio toggle independiente:
  // NO participa en el conteo del logro "Historiador" (ese vive solo en historia.html),
  // para no desbloquearlo de forma incompleta con menos compañías de las reales.
  function initEmbeddedHistoryCards() {
    const cards = document.querySelectorAll('.history-card--embed');
    if (!cards.length) return;

    cards.forEach(function (card) {
      const toggle = card.querySelector('.history-card-toggle');
      const body = card.querySelector('.history-card-body');
      toggle.addEventListener('click', function () {
        const isOpen = card.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (body) body.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      });
    });
  }

  return { initMenuToggle, initCarousel, initMultiStepForm, initInteractions, initCatalogFilter, initAchievements, initGamerQuiz, initHistoryTimeline, initEmbeddedHistoryCards };

})();