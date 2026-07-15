/* ============================================================
   GAMESTORE — Catálogo de productos
   ------------------------------------------------------------
   CÓMO AGREGAR UN PRODUCTO NUEVO:
   1. Sube la foto a IMAGENES/ (ideal: genera también su .webp,
      igual que las demás — pero funciona incluso si solo subes el .jpg/.png).
   2. Copia un objeto de la lista PRODUCTS de abajo y pega uno nuevo,
      cambiando id, category, name, price, image, specs y description.
   3. Listo — no hay que tocar HTML ni el resto del JS. El producto
      aparece solo en su categoría dentro de grillas.html.

   category debe ser una de: nintendo, microsoft, ps_sony, perifericos, oldschool, online
   image va SIN extensión (el sistema arma .jpg/.png + .webp automáticamente;
   si tu foto es .png en vez de .jpg, agrega ext: 'png' al objeto).
   ============================================================ */

const PRODUCTS = [

  // ── NINTENDO ──
  {
    id: 'nintendo-mario-kart', category: 'nintendo', type: 'Videojuego',
    name: 'Mario Kart 8 Deluxe', price: 249900,
    image: 'IMAGENES/mario_kart', width: 800, height: 600,
    description: 'El kart racer más querido de Nintendo, ahora con todo el contenido descargable incluido: más pistas, más personajes y el modo Battle completo.',
    specs: ['Para Nintendo Switch y Switch 2', 'Hasta 8 jugadores en modo local', '48 pistas incluidas', 'Modo online competitivo']
  },
  {
    id: 'nintendo-switch-oled', category: 'nintendo', type: 'Consola',
    name: 'Nintendo Switch OLED', price: 1699900,
    image: 'IMAGENES/swith2', width: 900, height: 600,
    description: 'La versión con pantalla OLED de 7 pulgadas, colores más vivos y mayor contraste. Ideal para modo portátil.',
    specs: ['Pantalla OLED 7"', '64 GB de almacenamiento interno', 'Base con puerto LAN', 'Audio mejorado en modo portátil']
  },
  {
    id: 'nintendo-consolas-pack', category: 'nintendo', type: 'Consola',
    name: 'Pack Consolas Nintendo', price: 1499900,
    image: 'IMAGENES/consols', width: 1280, height: 720,
    description: 'Combo con la consola base y accesorios esenciales para empezar a jugar desde el primer día.',
    specs: ['Incluye consola + dock + Joy-Con', 'Compatible con todo el catálogo Switch', 'Garantía oficial 12 meses']
  },
  {
    id: 'nintendo-switch-standard', category: 'nintendo', type: 'Consola',
    name: 'Nintendo Switch Estándar', price: 1399900,
    image: 'IMAGENES/switc', width: 1312, height: 740,
    description: 'La Switch clásica: portátil, de sobremesa o acoplada al televisor, en un solo dispositivo.',
    specs: ['Pantalla LCD 6.2"', '32 GB de almacenamiento interno', 'Hasta 6.5 horas de batería', 'Joy-Con desmontables']
  },
  {
    id: 'nintendo-switch-mario', category: 'nintendo', type: 'Consola · Edición especial',
    name: 'Nintendo Switch Edición Mario', price: 1799900,
    image: 'IMAGENES/swithmario', width: 1366, height: 768,
    description: 'Edición conmemorativa con diseño temático de Mario, para coleccionistas y fans de siempre.',
    specs: ['Diseño exclusivo edición limitada', 'Joy-Con temáticos', 'Incluye funda protectora', 'Caja coleccionable']
  },

  // ── XBOX (MICROSOFT) ──
  {
    id: 'xbox-series-x', category: 'microsoft', type: 'Consola',
    name: 'Xbox Series X', price: 2599900,
    image: 'IMAGENES/gaming', width: 612, height: 408,
    description: 'La consola más potente de Xbox: 4K nativo, ray tracing y velocidades de carga casi instantáneas.',
    specs: ['1TB SSD NVMe', '4K a 120fps', 'Compatible con Xbox Game Pass', 'Retrocompatible con 4 generaciones']
  },
  {
    id: 'xbox-setup-arena', category: 'microsoft', type: 'Bundle · Setup',
    name: 'Setup Xbox Arena Pro', price: 3999900,
    image: 'IMAGENES/arena', width: 640, height: 427,
    description: 'Consola + monitor + periféricos esenciales, armado para quienes quieren competir en serio desde el día uno.',
    specs: ['Xbox Series X incluida', 'Monitor 144Hz', 'Control Elite incluido', 'Instalación y configuración incluida']
  },
  {
    id: 'xbox-wireless-controller', category: 'microsoft', type: 'Control',
    name: 'Xbox Wireless Controller', price: 349900,
    image: 'IMAGENES/pexels-cottonbro-4009603', width: 800, height: 533,
    description: 'El control estándar de Xbox: ergonómico, preciso, y compatible con consola, PC y móvil.',
    specs: ['Conexión Bluetooth + inalámbrica dedicada', 'Hasta 40 horas de batería (pilas AA)', 'Compatible con Xbox, PC y Android/iOS']
  },
  {
    id: 'xbox-elite-series-2', category: 'microsoft', type: 'Control · Pro',
    name: 'Xbox Elite Series 2', price: 699900,
    image: 'IMAGENES/pexels-cottonbro-4009624', width: 533, height: 800,
    description: 'El control profesional de Xbox: componentes intercambiables, ajuste fino y batería recargable de larga duración.',
    specs: ['Palancas y grips intercambiables', 'Hasta 40 horas de batería recargable', 'Perfiles personalizables', 'Paletas traseras programables']
  },

  // ── PLAYSTATION ──
  {
    id: 'ps-dualsense', category: 'ps_sony', type: 'Control',
    name: 'DualSense Wireless Controller', price: 349900,
    image: 'IMAGENES/pexels-ron-lach-7856014', width: 534, height: 800,
    description: 'El control de PS5 con retroalimentación háptica y gatillos adaptativos que cambian la forma de sentir cada juego.',
    specs: ['Retroalimentación háptica avanzada', 'Gatillos adaptativos', 'Micrófono integrado', 'Batería recargable USB-C']
  },
  {
    id: 'ps5-setup-gamer', category: 'ps_sony', type: 'Bundle · Setup',
    name: 'PlayStation 5 Setup Gamer', price: 4299900,
    image: 'IMAGENES/pexels-mart-production-7329518', width: 800, height: 533,
    description: 'Todo lo necesario para un setup PlayStation completo: consola, control extra y accesorios de sonido.',
    specs: ['PS5 incluida', '2 controles DualSense', 'Audífonos gaming incluidos', 'Base de carga dual']
  },
  {
    id: 'ps5-slim', category: 'ps_sony', type: 'Consola',
    name: 'PlayStation 5 Slim', price: 2799900,
    image: 'IMAGENES/pexels-tima-miroshnichenko-6498789', width: 1000, height: 667,
    description: 'La versión compacta de PS5: mismo poder, hasta 30% menos volumen.',
    specs: ['1TB SSD interno', '4K a 120fps con HDR', 'Diseño 30% más compacto que el modelo original']
  },
  {
    id: 'ps5-pro-bundle', category: 'ps_sony', type: 'Consola · Pro',
    name: 'PS5 Pro Bundle', price: 3599900,
    image: 'IMAGENES/pexels-yankrukov-9069368', width: 1000, height: 667,
    description: 'La versión más potente de PlayStation 5, pensada para 4K exigente y ray tracing avanzado.',
    specs: ['2TB SSD interno', 'GPU mejorada para ray tracing', 'Incluye base vertical y 2 controles']
  },

  // ── PERIFÉRICOS ──
  {
    id: 'perifericos-teclado-control', category: 'perifericos', type: 'Periférico',
    name: 'Teclado Mecánico Gamer', price: 459900,
    image: 'IMAGENES/tecladocontr', width: 612, height: 408,
    description: 'Teclado mecánico con switches táctiles y retroiluminación RGB personalizable, para precisión competitiva.',
    specs: ['Switches mecánicos táctiles', 'Retroiluminación RGB por tecla', 'Teclas anti-ghosting', 'Reposamuñecas incluido']
  },
  {
    id: 'perifericos-setup-completo', category: 'perifericos', type: 'Bundle · Setup',
    name: 'Setup Gamer Completo', price: 5999900,
    image: 'IMAGENES/room2', width: 612, height: 344,
    description: 'Escritorio, silla, monitor y periféricos — el setup completo para armar tu rincón gamer desde cero.',
    specs: ['Escritorio + silla ergonómica', 'Monitor 27" 144Hz', 'Teclado, mouse y audífonos incluidos', 'Instalación a domicilio disponible']
  },
  {
    id: 'perifericos-audifonos', category: 'perifericos', type: 'Periférico',
    name: 'Audífonos Gaming Pro', price: 389900,
    image: 'IMAGENES/tv_headphones', width: 612, height: 408,
    description: 'Sonido envolvente 7.1 y micrófono con cancelación de ruido para comunicación clara en equipo.',
    specs: ['Sonido envolvente 7.1 virtual', 'Micrófono desmontable', 'Almohadillas de espuma viscoelástica', 'Compatible multiplataforma']
  },
  {
    id: 'perifericos-estudio', category: 'perifericos', type: 'Bundle · Streaming',
    name: 'Estación de Streaming', price: 2999900,
    image: 'IMAGENES/estudio', width: 1280, height: 853,
    description: 'Todo lo necesario para transmitir en vivo con calidad profesional: cámara, luces e interfaz de audio.',
    specs: ['Cámara streaming 1080p60', 'Panel de luz LED regulable', 'Interfaz de audio USB', 'Brazo articulado para micrófono']
  },

  // ── OLD SCHOOL ──
  {
    id: 'oldschool-gameboy', category: 'oldschool', type: 'Consola retro',
    name: 'Game Boy Clásica', price: 459900,
    image: 'IMAGENES/gameboy', width: 1920, height: 1011,
    description: 'La portátil que definió una generación, restaurada y probada, lista para revivir los clásicos.',
    specs: ['Restaurada y probada', 'Compatible con cartuchos originales', 'Incluye funda de transporte']
  },
  {
    id: 'oldschool-3ds', category: 'oldschool', type: 'Consola retro',
    name: 'Nintendo 3DS', price: 699900,
    image: 'IMAGENES/3ds', width: 920, height: 920, ext: 'png',
    description: 'Doble pantalla y efecto 3D sin gafas — una de las portátiles más queridas de Nintendo.',
    specs: ['Pantalla 3D sin gafas', 'Doble pantalla táctil', 'Retrocompatible con DS', 'Cámara 3D integrada']
  },
  {
    id: 'oldschool-arcade', category: 'oldschool', type: 'Arcade',
    name: 'Máquina Arcade Clásica', price: 6499900,
    image: 'IMAGENES/arcade', width: 612, height: 459,
    description: 'Gabinete arcade de pie con múltiples juegos clásicos preinstalados — la pieza central de cualquier sala retro.',
    specs: ['Más de 60 juegos clásicos incluidos', 'Joystick y botones arcade originales', 'Pantalla de 19"', 'Gabinete de madera reforzada']
  },
  {
    id: 'oldschool-mario-bros', category: 'oldschool', type: 'Juego retro',
    name: 'Super Mario Bros. (Cartucho)', price: 899900,
    image: 'IMAGENES/mario_bros', width: 612, height: 472,
    description: 'El cartucho original que lanzó a Mario al estrellato — pieza de colección en buen estado.',
    specs: ['Cartucho original NES', 'Probado y funcional', 'Estado coleccionable']
  },

  // ── ONLINE · TORNEOS (servicios, no mercancía física) ──
  {
    id: 'online-membresia', category: 'online', type: 'Suscripción',
    name: 'Membresía Gamer Online', price: 49900, priceSuffix: '/mes',
    image: 'IMAGENES/friends', width: 612, height: 408,
    description: 'Acceso a salas privadas, matchmaking prioritario y descuentos exclusivos en todo el catálogo.',
    specs: ['Salas privadas ilimitadas', 'Matchmaking prioritario', '10% de descuento en catálogo', 'Cancelable en cualquier momento']
  },
  {
    id: 'online-pack-familiar', category: 'online', type: 'Suscripción',
    name: 'Pack Familiar Multiplayer', price: 79900, priceSuffix: '/mes',
    image: 'IMAGENES/family', width: 383, height: 256,
    description: 'Hasta 5 perfiles conectados, control parental y contenido apto para toda la familia.',
    specs: ['Hasta 5 perfiles simultáneos', 'Control parental incluido', 'Biblioteca familiar compartida']
  },
  {
    id: 'online-torneo-regional', category: 'online', type: 'Evento',
    name: 'Entrada Torneo Regional', price: 99900,
    image: 'IMAGENES/pexels-viniciusvieirafotografia-29825629', width: 533, height: 800,
    description: 'Tu cupo para competir en el próximo torneo presencial de GameStore, con premios en efectivo y productos.',
    specs: ['Cupo individual garantizado', 'Premios en efectivo y productos', 'Incluye kit de bienvenida']
  },
  {
    id: 'online-coaching-pro', category: 'online', type: 'Servicio',
    name: 'Coaching Gaming 1:1', price: 149900, priceSuffix: '/sesión',
    image: 'IMAGENES/pexels-tombrand-1637438', width: 1400, height: 933,
    description: 'Sesión personalizada con un jugador competitivo para mejorar mecánicas, estrategia y toma de decisiones.',
    specs: ['Sesión 1:1 de 60 minutos', 'Análisis de repeticiones incluido', 'Plan de mejora personalizado']
  }
];

const GameStoreCatalog = (function () {

  function formatCOP(n) {
    return '$' + n.toLocaleString('es-CO');
  }

  function productImgTag(p, extraAttrs) {
    const ext = p.ext || 'jpg';
    return '<picture>' +
      '<source srcset="' + p.image + '.webp" type="image/webp" />' +
      '<img src="' + p.image + '.' + ext + '" alt="' + p.name + '" width="' + p.width + '" height="' + p.height + '" ' + (extraAttrs || 'loading="lazy"') + ' />' +
      '</picture>';
  }

  function cardHTML(p) {
    return (
      '<div class="product-card reveal" data-product-id="' + p.id + '">' +
        '<div class="product-card-img">' + productImgTag(p) + '</div>' +
        '<div class="product-card-body">' +
          '<span class="product-type">' + p.type + '</span>' +
          '<h3>' + p.name + '</h3>' +
          '<p class="product-price">' + formatCOP(p.price) + (p.priceSuffix || '') + '</p>' +
          '<button class="btn-outline btn-outline--sm product-detail-btn" type="button" data-product-id="' + p.id + '">Ver detalle</button>' +
        '</div>' +
      '</div>'
    );
  }

  // ── Renderiza los productos de cada categoría dentro de .product-grid[data-category] ──
  function initProductGrids() {
    const grids = document.querySelectorAll('.product-grid[data-category]');
    if (!grids.length) return;

    grids.forEach(function (grid) {
      const cat = grid.getAttribute('data-category');
      const items = PRODUCTS.filter(function (p) { return p.category === cat; });
      grid.innerHTML = items.map(cardHTML).join('');
    });
  }

  // ── Modal de detalle de producto ──
  function initProductModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    const overlay = modal.querySelector('.product-modal-overlay');
    const closeBtn = modal.querySelector('.product-modal-close');
    const body = modal.querySelector('.product-modal-body');

    function openModal(product) {
      body.innerHTML =
        '<div class="product-modal-img">' + productImgTag(product, 'loading="eager"') + '</div>' +
        '<div class="product-modal-info">' +
          '<span class="product-type">' + product.type + '</span>' +
          '<h2>' + product.name + '</h2>' +
          '<p class="product-modal-price">' + formatCOP(product.price) + (product.priceSuffix || '') + '</p>' +
          '<p class="product-modal-desc">' + product.description + '</p>' +
          '<ul class="product-modal-specs">' + product.specs.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>' +
          '<button class="btn-primary" type="button" id="addToCartBtn">Agregar al carrito</button>' +
        '</div>';
      modal.classList.add('open');
      document.body.classList.add('modal-open');
      closeBtn.focus();

      const addBtn = body.querySelector('#addToCartBtn');
      addBtn.addEventListener('click', function () {
        if (typeof GameStoreCart !== 'undefined') {
          GameStoreCart.addItem(product);
          addBtn.textContent = '✓ Agregado';
          setTimeout(function () { addBtn.textContent = 'Agregar al carrito'; }, 1500);
        }
      });
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      // Mismo ajuste que en el carrito: fuerza el repintado del navbar para que el contador
      // del carrito no quede visualmente "atascado" tras cerrar este modal (ver cart.js).
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        requestAnimationFrame(function () {
          navbar.style.transform = 'translateZ(0)';
          requestAnimationFrame(function () { navbar.style.transform = ''; });
        });
      }
    }

    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.product-detail-btn, .product-card-img');
      if (!btn) return;
      const card = e.target.closest('.product-card');
      if (!card) return;
      const id = card.getAttribute('data-product-id');
      const product = PRODUCTS.find(function (p) { return p.id === id; });
      if (product) openModal(product);
    });

    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  return { PRODUCTS, initProductGrids, initProductModal };

})();