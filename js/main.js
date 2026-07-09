/**
 * GameStore — main.js
 * Lógica compartida entre páginas: menú hamburguesa, carrusel y formulario multi-paso.
 * Antes esta lógica estaba duplicada dentro de cada archivo .html; ahora vive en un solo lugar.
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

  return { initMenuToggle, initCarousel, initMultiStepForm };

})();
