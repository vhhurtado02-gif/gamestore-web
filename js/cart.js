/* ============================================================
   GAMESTORE — Carrito de compras
   ------------------------------------------------------------
   Persistencia en localStorage bajo la clave "gs-cart".
   Cada ítem guarda una "foto" del producto (nombre, precio,
   imagen) al momento de agregarlo, así el carrito funciona en
   CUALQUIER página del sitio sin depender de que products.js
   esté cargado ahí — solo grillas.html necesita products.js,
   el carrito es 100% independiente.
   ============================================================ */

const GameStoreCart = (function () {

  const STORAGE_KEY = 'gs-cart';

  function formatCOP(n) {
    return '$' + n.toLocaleString('es-CO');
  }

  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }

  function saveCart(cart) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) {}
  }

  function getCount(cart) {
    return cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
  }

  function getTotal(cart) {
    return cart.reduce(function (sum, item) { return sum + (item.price * item.quantity); }, 0);
  }

  // ── UI: botón flotante + drawer, inyectados una sola vez por página ──
  function initCart() {
    if (document.querySelector('.cart-trigger')) return;

    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const wrap = document.createElement('span');
    wrap.className = 'cart-trigger-wrap';

    const trigger = document.createElement('button');
    trigger.className = 'cart-trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-label', 'Ver carrito de compras');
    trigger.textContent = '🛒';

    const countEl = document.createElement('span');
    countEl.className = 'cart-count';
    countEl.id = 'cartCount';

    // El contador va como HERMANO del botón (no adentro) a propósito: el botón necesita
    // overflow:hidden para recortar el efecto ripple dentro de su forma redondeada, y ese
    // mismo overflow:hidden recortaba el contador (que sobresale un poco del borde con
    // top/right negativos). Al vivir afuera, en este contenedor, ya no lo recorta nada.
    wrap.appendChild(trigger);
    wrap.appendChild(countEl);

    const actions = navbar.querySelector('.navbar-actions');
    const themeToggle = navbar.querySelector('.theme-toggle');
    if (actions) actions.insertBefore(wrap, themeToggle);
    else if (themeToggle) navbar.insertBefore(wrap, themeToggle);
    else navbar.appendChild(wrap);

    const drawer = document.createElement('div');
    drawer.className = 'cart-drawer';
    drawer.innerHTML =
      '<div class="cart-drawer-overlay"></div>' +
      '<div class="cart-drawer-panel" role="dialog" aria-modal="true" aria-label="Carrito de compras">' +
        '<div class="cart-drawer-header">' +
          '<h3>Tu Carrito</h3>' +
          '<button class="cart-drawer-close" type="button" aria-label="Cerrar carrito">✕</button>' +
        '</div>' +
        '<div class="cart-drawer-items" id="cartItems"></div>' +
        '<div class="cart-drawer-footer">' +
          '<div class="cart-drawer-total">Total <span id="cartTotal">$0</span></div>' +
          '<button class="btn-primary" type="button" id="cartCheckoutBtn">Finalizar compra</button>' +
          '<button class="btn-outline btn-outline--sm" type="button" id="cartClearBtn">Vaciar carrito</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(drawer);

    const overlay = drawer.querySelector('.cart-drawer-overlay');
    const closeBtn = drawer.querySelector('.cart-drawer-close');
    const itemsWrap = drawer.querySelector('#cartItems');
    const totalEl = drawer.querySelector('#cartTotal');
    const checkoutBtn = drawer.querySelector('#cartCheckoutBtn');
    const clearBtn = drawer.querySelector('#cartClearBtn');

    function render() {
      const cart = getCart();
      const count = getCount(cart);
      countEl.textContent = count > 0 ? count : '';

      if (!cart.length) {
        itemsWrap.innerHTML = '<div class="cart-empty">🎮 Tu carrito está vacío.<br>Explora el catálogo y encuentra algo increíble.</div>';
        totalEl.textContent = formatCOP(0);
        return;
      }

      itemsWrap.innerHTML = cart.map(function (item) {
        const ext = item.ext || 'jpg';
        return (
          '<div class="cart-item" data-id="' + item.id + '">' +
            '<picture><source srcset="' + item.image + '.webp" type="image/webp" /><img src="' + item.image + '.' + ext + '" alt="' + item.name + '" /></picture>' +
            '<div class="cart-item-info">' +
              '<h4>' + item.name + '</h4>' +
              '<p class="cart-item-price">' + formatCOP(item.price) + (item.priceSuffix || '') + '</p>' +
              '<div class="cart-item-qty">' +
                '<button type="button" class="qty-btn" data-action="decrease" aria-label="Quitar una unidad">−</button>' +
                '<span>' + item.quantity + '</span>' +
                '<button type="button" class="qty-btn" data-action="increase" aria-label="Agregar una unidad">+</button>' +
              '</div>' +
            '</div>' +
            '<button type="button" class="cart-item-remove" aria-label="Quitar ' + item.name + ' del carrito">✕</button>' +
          '</div>'
        );
      }).join('');

      totalEl.textContent = formatCOP(getTotal(cart));
    }

    render();

    const panel = drawer.querySelector('.cart-drawer-panel');
    const focusTrap = (typeof GameStore !== 'undefined' && GameStore.createFocusTrap) ? GameStore.createFocusTrap(panel) : null;

    function openDrawer() {
      drawer.classList.add('open');
      document.body.classList.add('modal-open');
      if (focusTrap) focusTrap.activate();
    }
    function closeDrawer() {
      drawer.classList.remove('open');
      document.body.classList.remove('modal-open');
      if (focusTrap) focusTrap.deactivate();
    }

    trigger.addEventListener('click', openDrawer);
    overlay.addEventListener('click', closeDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });

    itemsWrap.addEventListener('click', function (e) {
      const row = e.target.closest('.cart-item');
      if (!row) return;
      const id = row.getAttribute('data-id');
      let cart = getCart();
      const idx = cart.findIndex(function (i) { return i.id === id; });
      if (idx === -1) return;

      if (e.target.classList.contains('cart-item-remove')) {
        cart.splice(idx, 1);
      } else if (e.target.closest('.qty-btn')) {
        const action = e.target.closest('.qty-btn').getAttribute('data-action');
        if (action === 'increase') cart[idx].quantity++;
        else {
          cart[idx].quantity--;
          if (cart[idx].quantity <= 0) cart.splice(idx, 1);
        }
      } else {
        return;
      }
      saveCart(cart);
      render();
    });

    clearBtn.addEventListener('click', function () {
      saveCart([]);
      render();
    });

    checkoutBtn.addEventListener('click', function () {
      const cart = getCart();
      if (!cart.length) return;
      const total = formatCOP(getTotal(cart));
      saveCart([]);
      render();
      closeDrawer();
      showCheckoutToast(total);
      if (typeof GameStore !== 'undefined' && typeof GameStore.unlockBadge === 'function') {
        GameStore.unlockBadge('comprador');
      }
    });

    // Refrescar el contador si se agregó un producto desde otra parte de la página (ej. el modal)
    document.addEventListener('gs-cart-updated', render);
  }

  function showCheckoutToast(totalText) {
    const toast = document.createElement('div');
    toast.className = 'badge-toast';
    toast.innerHTML = '<span class="badge-toast-icon">✅</span>' +
      '<div><strong>¡Compra simulada con éxito!</strong><br>Total: ' + totalText + '</div>';
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('show'); });
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 400);
    }, 4000);
  }

  // ── API pública: agregar un producto al carrito desde cualquier parte del sitio ──
  // product: { id, name, price, priceSuffix, image, ext }
  function addItem(product) {
    let cart = getCart();
    const existing = cart.find(function (i) { return i.id === product.id; });
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        priceSuffix: product.priceSuffix || '',
        image: product.image,
        ext: product.ext || 'jpg',
        quantity: 1
      });
    }
    saveCart(cart);
    document.dispatchEvent(new CustomEvent('gs-cart-updated'));

    const trigger = document.querySelector('.cart-trigger-wrap');
    if (trigger) {
      trigger.classList.remove('cart-bump');
      void trigger.offsetWidth;
      trigger.classList.add('cart-bump');
    }

    showAddedToast(product);
  }

  // ── Confirmación vistosa de "agregado al carrito": imagen del producto + check animado ──
  function showAddedToast(product) {
    const existing = document.querySelector('.cart-added-toast');
    if (existing) existing.remove();

    const ext = product.ext || 'jpg';
    const toast = document.createElement('div');
    toast.className = 'cart-added-toast';
    toast.innerHTML =
      '<div class="cart-added-toast-img">' +
        '<picture><source srcset="' + product.image + '.webp" type="image/webp" /><img src="' + product.image + '.' + ext + '" alt="' + product.name + '" /></picture>' +
        '<span class="cart-added-toast-check">✓</span>' +
      '</div>' +
      '<div class="cart-added-toast-text">' +
        '<strong>¡Agregado al carrito!</strong>' +
        '<span>' + product.name + '</span>' +
      '</div>';
    document.body.appendChild(toast);

    requestAnimationFrame(function () { toast.classList.add('show'); });
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 400);
    }, 2800);
  }

  return { initCart, addItem, getCart, getCount, getTotal, formatCOP };

})();