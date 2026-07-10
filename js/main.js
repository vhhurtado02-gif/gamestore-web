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
        menu.classList.toggle('active');
      });
    }
  }

  // ── Carrusel Bootstrap (usado en inicio.html y contacto.html) ──
  function initCarousel(selector, interval) {
    document.addEventListener('DOMContentLoaded', function () {
      const el = document.querySelector(selector);
      if (el && typeof bootstrap !== 'undefined') {
        new bootstrap.Carousel(el, { interval: interval, ride: 'carousel' });
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
  function initRippleButtons() {
    const selector = '.btn-primary, .btn-outline, .btn-card, .btn-next, .btn-prev, .btn-submit';
    document.querySelectorAll(selector).forEach(btn => {
      btn.classList.add('has-ripple');
      btn.addEventListener('click', function (e) {
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
    });
  }

  return { initMenuToggle, initCarousel, initMultiStepForm, initInteractions };

})();