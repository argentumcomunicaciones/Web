/**
 * ElectroLab Educativa - Store Engine & Interactive Experience
 * Gestión de cursos, carrito de compras multi-moneda (ARS/USD),
 * temarios interactivos, pasarela WhatsApp / Mercado Pago / Transferencia.
 */

(function () {
  'use strict';

  // Configuración base de la tienda
  const CONFIG = {
    whatsappNumber: '5491123065347', // WhatsApp oficial de ElectroLab
    defaultCurrency: 'ARS', // 'ARS' o 'USD'
    couponCode: 'ELECTRO2026',
    couponDiscount: 0.10 // 10% off
  };

  // Base de datos de Cursos y Recursos
  const COURSES = [
    {
      id: 'curso-electronica-cero',
      category: 'electronica',
      title: 'Electrónica Práctica Desde CERO',
      subtitle: 'De las Leyes Fundamentales al Banco de Pruebas: Simulación, Análisis y Armado Real',
      tag: '⭐ MÁS ELEGIDO PARA INICIAR',
      level: 'Principiante a Intermedio',
      duration: '14 Módulos · +35 Horas de video HD',
      projectsCount: '28 Circuitos Prácticos',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
      badgeColor: 'blue',
      priceARS: 18900,
      origARS: 34500,
      priceUSD: 19,
      origUSD: 35,
      driveFolder: 'https://drive.google.com/drive/folders/1rXuc5CcPYwX8eChWINgNXDo7Sl7a0It8?usp=drive_link',
      youtubePreview: 'https://www.youtube.com/embed/videoseries?list=PLZRAKzDxXlAI',
      features: [
        'Leyes de Ohm, Kirchhoff, divisor de tensión y corriente',
        'Semiconductores: Diodos rectificadores, Zener y LEDs',
        'Transistores BJT y MOSFET como interruptor y amplificador',
        'Temporizador 555 a fondo: Modo astable y monoestable',
        'Simulación profesional de circuitos paso a paso en LTspice',
        'Diseño de fuentes de alimentación lineales reguladas',
        'Esquemáticos PDF descargables + Archivos .ASC de LTspice',
        'Certificado oficial digital de finalización'
      ],
      syllabus: [
        {
          module: 'Módulo 1: Fundamentos Eléctricos Sin Vueltas',
          lessons: [
            { title: 'Tensión, corriente, resistencia y potencia: La analogía definitiva', duration: '24 min', isDemo: true },
            { title: 'Uso correcto del multímetro digital: Mediciones sin quemar nada', duration: '32 min' },
            { title: 'Ley de Ohm y Leyes de Kirchhoff con ejercicios reales de protoboard', duration: '40 min' },
            { title: 'Teoremas de Thévenin y Norton aplicados a circuitos prácticos', duration: '35 min' }
          ]
        },
        {
          module: 'Módulo 2: Componentes Pasivos y Comportamiento Dinámico',
          lessons: [
            { title: 'Resistencias comerciales: Código de colores, tolerancia y disipación', duration: '20 min' },
            { title: 'Capacitores cerámicos y electrolíticos: Tiempo de carga RC y filtro', duration: '38 min' },
            { title: 'Inductores y bobinas en corriente continua y pulsada', duration: '28 min' }
          ]
        },
        {
          module: 'Módulo 3: Semiconductores y Diodos',
          lessons: [
            { title: 'La juntura P-N explicada de forma intuitiva', duration: '25 min' },
            { title: 'Diodos 1N4007 y 1N4148: Rectificación de media onda y onda completa', duration: '42 min' },
            { title: 'Diodos Zener: Regulación de tensión y limitadores', duration: '30 min' },
            { title: 'Optoelectrónica: LEDs de potencia, fotodiodos y optoacopladores', duration: '35 min' }
          ]
        },
        {
          module: 'Módulo 4: El Mundo del Transistor (BJT y MOSFET)',
          lessons: [
            { title: 'Transistor Bipolar NPN y PNP: Zona de corte y saturación (Switching)', duration: '45 min' },
            { title: 'Cálculo de la resistencia de base para activar relés y cargas pesadas', duration: '38 min' },
            { title: 'Transistores MOSFET: Compuerta, canal N y control por tensión', duration: '50 min' }
          ]
        },
        {
          module: 'Módulo 5: Simulación Asistida con LTspice',
          lessons: [
            { title: 'Instalación y configuración del entorno de trabajo en LTspice', duration: '22 min', isDemo: true },
            { title: 'Análisis transitorio (.tran) y respuesta en frecuencia (.ac)', duration: '48 min' },
            { title: 'Importación de modelos SPICE de fabricantes reales', duration: '36 min' }
          ]
        },
        {
          module: 'Módulo 6: Proyecto Integrador: Fuente Regulada con Protección',
          lessons: [
            { title: 'Cálculo del transformador, puente de diodos y capacitor de ripple', duration: '40 min' },
            { title: 'Reguladores lineales LM78xx y LM317 variable con disipador', duration: '45 min' },
            { title: 'Puesta en marcha, mediciones con carga real y documentación', duration: '55 min' }
          ]
        }
      ]
    },
    {
      id: 'curso-arduino-microcontroladores',
      category: 'arduino',
      title: 'Arduino & Microcontroladores: Del Primer Sketch a IoT',
      subtitle: 'Aprende a Programar Microcontroladores, Sensar el Mundo Real y Conectar Dispositivos a Internet',
      tag: '🚀 HARDWARE + FIRMWARE',
      level: 'De Cero a Avanzado',
      duration: '16 Módulos · +42 Horas de video HD',
      projectsCount: '32 Proyectos con Código',
      image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
      badgeColor: 'cyan',
      priceARS: 22500,
      origARS: 42000,
      priceUSD: 23,
      origUSD: 42,
      driveFolder: 'https://drive.google.com/drive/folders/1g0FJAD-2iifE4DgZ789MvjOsHHfYQMVa?usp=drive_link',
      youtubePreview: 'https://www.youtube.com/embed/videoseries?list=PLdmC3bfdJGAk',
      features: [
        'Arquitectura AVR (ATmega328P) y 32-bit ESP32',
        'Programación en C++ para microcontroladores desde cero',
        'Manejo de entradas/salidas digitales, PWM e interrupciones',
        'Conversor Analógico-Digital (ADC) y calibración de sensores',
        'Protocolos de comunicación: UART Serie, I2C y SPI',
        'Pantallas LCD 16x2, displays OLED I2C y matrices LED',
        'Control de actuadores: Servomotores, motores paso a paso y relés',
        'Conectividad WiFi con ESP32, Dashboard Web y MQTT / IoT',
        'Código fuente .ino totalmente comentado línea por línea'
      ],
      syllabus: [
        {
          module: 'Módulo 1: Introducción a los Microcontroladores y C++',
          lessons: [
            { title: '¿Qué es un microcontrolador y cómo difiere de una computadora?', duration: '26 min', isDemo: true },
            { title: 'Instalación de Arduino IDE 2.0 y controladores CH340 / CP2102', duration: '20 min' },
            { title: 'Estructura básica: setup(), loop(), tipos de datos y operadores en C++', duration: '45 min' },
            { title: 'Tu primer sketch: Control de LEDs, secuencias y retardos sin millis()', duration: '35 min' }
          ]
        },
        {
          module: 'Módulo 2: Entradas Digitales, Rebote y Máquinas de Estado',
          lessons: [
            { title: 'Pulsadores con resistencias Pull-Up internas y externas', duration: '30 min' },
            { title: 'Eliminación del rebote mecánico (Debounce) por hardware y por software', duration: '38 min' },
            { title: 'Programación no bloqueante con millis(): Adiós al delay()', duration: '52 min' },
            { title: 'Diseño de máquinas de estados finitos (FSM) con switch-case', duration: '48 min' }
          ]
        },
        {
          module: 'Módulo 3: Señales Analógicas, PWM y Sensores',
          lessons: [
            { title: 'El ADC de 10 bits: Lectura de potenciómetros, LDR y termistores NTC', duration: '40 min' },
            { title: 'Modulación por Ancho de Pulsos (PWM): Dimmer de luces y velocidad de motores', duration: '36 min' },
            { title: 'Sensor ultrasónico HC-SR04 y sensor digital de temperatura DHT11/22', duration: '44 min' }
          ]
        },
        {
          module: 'Módulo 4: Comunicación y Visualización de Datos',
          lessons: [
            { title: 'Protocolo UART: Envío y recepción de comandos por Serial Monitor', duration: '35 min' },
            { title: 'Bus I2C: Conexión de displays LCD 16x2 y pantallas OLED SSD1306', duration: '50 min' },
            { title: 'Creación de interfaces gráficas simples y menús con encoder rotativo', duration: '55 min' }
          ]
        },
        {
          module: 'Módulo 5: Interrupciones de Hardware y Temporizadores',
          lessons: [
            { title: 'Interrupciones externas (attachInterrupt): Respuesta en microsegundos', duration: '42 min' },
            { title: 'Timers internos y generación de frecuencias de precisión', duration: '46 min' }
          ]
        },
        {
          module: 'Módulo 6: Salto al ESP32 & Internet de las Cosas (IoT)',
          lessons: [
            { title: 'Configuración de la placa ESP32 y conexión a redes WiFi 2.4GHz', duration: '38 min' },
            { title: 'Creación de un servidor web local para monitorear sensores desde el celular', duration: '60 min' },
            { title: 'Envío de datos a la nube con protocolo MQTT y dashboards en tiempo real', duration: '65 min' }
          ]
        }
      ]
    },
    {
      id: 'combo-master-electronica-arduino',
      category: 'combo',
      title: '🌟 PACK MASTER: Electrónica Total + Arduino & Microcontroladores Full Stack',
      subtitle: 'La Formación Definitiva: Todo el Hardware y Todo el Firmware en un Único Programa Intensivo',
      tag: '🔥 MEJOR VALOR (AHORRA 58%)',
      level: 'De Cero a Nivel Profesional',
      duration: '30 Módulos · +77 Horas de video HD',
      projectsCount: '60+ Proyectos y Circuitos Reales',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      badgeColor: 'emerald',
      priceARS: 31900,
      origARS: 76500,
      priceUSD: 32,
      origUSD: 77,
      driveFolder: 'https://drive.google.com/drive/folders/18vYXavKUw_ge42v26zVGgFxHzGsSWV5J?usp=drive_link',
      isBundle: true,
      features: [
        'Acceso de por vida a los 2 Cursos Completos (Electrónica + Arduino)',
        'Pack Exclusivo de +60 Modelos de Simulación LTspice listos para correr',
        'Biblioteca de Códigos Arduino / ESP32 optimizados y testeados',
        'Guía en PDF de Pinouts, Fórmulas Rápidas y Circuitos Típicos',
        'Canal de Consultas Prioritario directo con el profesor',
        'Doble Certificado de Finalización Oficial con verificación'
      ]
    },
    {
      id: 'guia-simulaciones-ltspice',
      category: 'guias',
      title: 'Biblioteca Maestra de Simulaciones en LTspice (.ASC)',
      subtitle: '+60 Circuitos Analógicos y de Potencia Listos para Simular, Medir y Modificar',
      tag: '📦 DESCARGA INMEDIATA',
      level: 'Todos los niveles',
      duration: 'Recurso Descargable (.zip + PDF)',
      projectsCount: '+60 Modelos .ASC',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      badgeColor: 'slate',
      priceARS: 7900,
      origARS: 14900,
      priceUSD: 8,
      origUSD: 15,
      driveFolder: 'https://drive.google.com/drive/folders/1Ria3iinViGHPSRa1VlQIypBTQRrf-IAX?usp=drive_link',
      features: [
        'Fuentes de alimentación lineales, conmutadas y dobladores de tensión',
        'Filtros activos paso bajo, paso alto y pasabanda con Op-Amps',
        'Temporizadores 555 en múltiples configuraciones astable/monoestable',
        'Amplificadores con BJT clase A, B y push-pull',
        'Guía PDF explicativa de cómo interpretar gráficas FFT y transitorios'
      ]
    }
  ];

  // Estado global de la aplicación
  let state = {
    currency: localStorage.getItem('electrolab_currency') || CONFIG.defaultCurrency,
    cart: JSON.parse(localStorage.getItem('electrolab_cart') || '[]'),
    activeFilter: 'all',
    appliedCoupon: localStorage.getItem('electrolab_coupon') || null
  };

  // Guardar en Storage
  function saveState() {
    localStorage.setItem('electrolab_currency', state.currency);
    localStorage.setItem('electrolab_cart', JSON.stringify(state.cart));
    if (state.appliedCoupon) {
      localStorage.setItem('electrolab_coupon', state.appliedCoupon);
    } else {
      localStorage.removeItem('electrolab_coupon');
    }
  }

  // Formateador de moneda
  function formatMoney(amount, currency = state.currency) {
    if (currency === 'ARS') {
      return `$ ${amount.toLocaleString('es-AR')} ARS`;
    } else {
      return `US$ ${amount.toLocaleString('en-US')}`;
    }
  }

  function getCoursePrice(course, currency = state.currency) {
    return currency === 'ARS' ? course.priceARS : course.priceUSD;
  }

  function getCourseOrigPrice(course, currency = state.currency) {
    return currency === 'ARS' ? course.origARS : course.origUSD;
  }

  // Inicializar UI
  function initApp() {
    renderCourses();
    updateCurrencyButtons();
    updateCartUI();
    setupEventListeners();
    setupFAQAccordion();
  }

  // Renderizar cursos en la grilla
  function renderCourses() {
    const container = document.getElementById('courses-grid');
    if (!container) return;

    const filtered = COURSES.filter(course => {
      if (state.activeFilter === 'all') return true;
      return course.category === state.activeFilter;
    });

    container.innerHTML = filtered.map(course => {
      const price = getCoursePrice(course);
      const origPrice = getCourseOrigPrice(course);
      const inCart = state.cart.includes(course.id);
      const discountPercent = Math.round(((origPrice - price) / origPrice) * 100);

      const isBundle = course.isBundle;
      const borderClass = isBundle
        ? 'border-2 border-emerald-500/80 shadow-[0_0_35px_rgba(16,185,129,0.25)]'
        : 'border border-slate-800 hover:border-cyan-500/50 shadow-lg';

      return `
        <article class="group relative flex flex-col justify-between bg-slate-900/90 rounded-2xl overflow-hidden transition-all duration-300 ${borderClass}">
          ${isBundle ? `
            <div class="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider py-1.5 px-4 text-center">
              ⚡ Oferta Especial Todo Incluido - Ahorrá ${discountPercent}%
            </div>
          ` : ''}

          <div>
            <!-- Course Image Header -->
            <div class="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
              <img src="${course.image}" alt="${course.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30"></div>

              <!-- Badge Tag -->
              <div class="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-700/60 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                <span>${course.tag}</span>
              </div>

              <!-- Discount Tag -->
              <div class="absolute top-3 right-3 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-md">
                -${discountPercent}%
              </div>

              <!-- Level / Duration Pills -->
              <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-medium text-slate-300">
                <span class="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  ${course.duration}
                </span>
                <span class="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md text-emerald-300">
                  ${course.level}
                </span>
              </div>
            </div>

            <!-- Content Body -->
            <div class="p-6">
              <h3 class="text-xl font-heading font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 mb-2">
                ${course.title}
              </h3>
              <p class="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4">
                ${course.subtitle}
              </p>

              <!-- Feature Highlights -->
              <ul class="space-y-2 mb-6">
                ${course.features.slice(0, 4).map(f => `
                  <li class="flex items-start gap-2 text-xs text-slate-300">
                    <svg class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span>${f}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <!-- Price & Actions Footer -->
          <div class="p-6 pt-0 border-t border-slate-800/80 bg-slate-950/40 mt-auto">
            <div class="flex items-baseline justify-between py-4">
              <div>
                <span class="text-xs text-slate-400 uppercase font-semibold block">Inversión única</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-2xl sm:text-3xl font-heading font-black text-white">
                    ${formatMoney(price)}
                  </span>
                  <span class="text-sm text-slate-500 line-through">
                    ${formatMoney(origPrice)}
                  </span>
                </div>
              </div>
              <span class="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                Acceso de por vida
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              ${course.syllabus ? `
                <button onclick="window.ElectroLab.openSyllabus('${course.id}')" class="px-3 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/60 transition-all flex items-center justify-center gap-1.5">
                  <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  <span>Ver Temario</span>
                </button>
              ` : `
                <button onclick="window.ElectroLab.openPreviewModal('${course.id}')" class="px-3 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/60 transition-all flex items-center justify-center gap-1.5">
                  <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span>Detalles</span>
                </button>
              `}

              <button onclick="window.ElectroLab.toggleCart('${course.id}')" class="px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
                inCart
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : isBundle
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
              }">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  ${inCart ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>' : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>'}
                </svg>
                <span>${inCart ? 'En el Carrito' : 'Inscribirme'}</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Conmutador de moneda
  function setCurrency(curr) {
    if (state.currency === curr) return;
    state.currency = curr;
    saveState();
    updateCurrencyButtons();
    renderCourses();
    updateCartUI();
    showToast(`Moneda cambiada a ${curr === 'ARS' ? 'Pesos Argentinos (ARS)' : 'Dólares Estadounidenses (USD)'}`);
  }

  function updateCurrencyButtons() {
    const btnArs = document.getElementById('curr-ars');
    const btnUsd = document.getElementById('curr-usd');
    if (!btnArs || !btnUsd) return;

    if (state.currency === 'ARS') {
      btnArs.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-cyan-500 text-slate-950 shadow-sm';
      btnUsd.className = 'px-3 py-1 text-xs font-medium rounded-lg text-slate-400 hover:text-white';
    } else {
      btnUsd.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-cyan-500 text-slate-950 shadow-sm';
      btnArs.className = 'px-3 py-1 text-xs font-medium rounded-lg text-slate-400 hover:text-white';
    }
  }

  // Carrito de Compras
  function toggleCart(courseId) {
    const index = state.cart.indexOf(courseId);
    if (index > -1) {
      state.cart.splice(index, 1);
      showToast('Curso eliminado del carrito');
    } else {
      state.cart.push(courseId);
      const course = COURSES.find(c => c.id === courseId);
      showToast(`¡"${course.title}" agregado al carrito!`, 'success');
      // Abrir carrito automáticamente al agregar
      openCartDrawer();
    }
    saveState();
    renderCourses();
    updateCartUI();
  }

  function removeFromCart(courseId) {
    state.cart = state.cart.filter(id => id !== courseId);
    saveState();
    renderCourses();
    updateCartUI();
  }

  function clearCart() {
    state.cart = [];
    state.appliedCoupon = null;
    saveState();
    renderCourses();
    updateCartUI();
  }

  function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const cartCountDrawer = document.getElementById('cart-drawer-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartDiscountEl = document.getElementById('cart-discount');
    const cartDiscountRow = document.getElementById('cart-discount-row');
    const cartTotalEl = document.getElementById('cart-total');
    const emptyState = document.getElementById('cart-empty-state');
    const filledState = document.getElementById('cart-filled-state');

    const totalCount = state.cart.length;
    if (badge) badge.textContent = totalCount;
    if (cartCountDrawer) cartCountDrawer.textContent = `(${totalCount})`;

    if (totalCount === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (filledState) filledState.classList.add('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (filledState) filledState.classList.remove('hidden');

    let subtotal = 0;
    const cartCourses = state.cart.map(id => COURSES.find(c => c.id === id)).filter(Boolean);

    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = cartCourses.map(course => {
        const price = getCoursePrice(course);
        subtotal += price;

        return `
          <div class="flex items-center gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <img src="${course.image}" alt="${course.title}" class="w-16 h-12 rounded-lg object-cover shrink-0">
            <div class="flex-1 min-w-0">
              <h4 class="text-xs font-bold text-white truncate">${course.title}</h4>
              <span class="text-xs text-cyan-400 font-semibold">${formatMoney(price)}</span>
            </div>
            <button onclick="window.ElectroLab.removeFromCart('${course.id}')" class="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors" title="Eliminar">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        `;
      }).join('');
    }

    // Calcular descuento por cupón si está aplicado
    let discount = 0;
    if (state.appliedCoupon) {
      discount = Math.round(subtotal * CONFIG.couponDiscount);
      if (cartDiscountRow) cartDiscountRow.classList.remove('hidden');
      if (cartDiscountEl) cartDiscountEl.textContent = `- ${formatMoney(discount)}`;
    } else {
      if (cartDiscountRow) cartDiscountRow.classList.add('hidden');
    }

    const total = subtotal - discount;

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatMoney(subtotal);
    if (cartTotalEl) cartTotalEl.textContent = formatMoney(total);
  }

  // Cupón de descuento
  function applyCoupon(code) {
    if (!code) return;
    const clean = code.trim().toUpperCase();
    if (clean === CONFIG.couponCode || clean === 'ELECTROLAB') {
      state.appliedCoupon = clean;
      saveState();
      updateCartUI();
      showToast('🎉 ¡Cupón aplicado! 10% de descuento adicional activado.', 'success');
    } else {
      showToast('❌ Cupón no válido. Intenta con ELECTRO2026', 'error');
    }
  }

  // Drawers y Modales
  function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      overlay.classList.remove('opacity-0', 'pointer-events-none');
      drawer.classList.remove('translate-x-full');
      document.body.classList.add('overflow-hidden');
    }
  }

  function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      overlay.classList.add('opacity-0', 'pointer-events-none');
      drawer.classList.add('translate-x-full');
      document.body.classList.remove('overflow-hidden');
    }
  }

  // Modal de Temario Completo
  function openSyllabus(courseId) {
    const course = COURSES.find(c => c.id === courseId);
    if (!course || !course.syllabus) return;

    const modal = document.getElementById('syllabus-modal');
    const modalContent = document.getElementById('syllabus-modal-content');
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
      <div class="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100">
        <!-- Close Button -->
        <button onclick="window.ElectroLab.closeSyllabus()" class="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div class="flex items-center gap-2 text-xs font-bold tracking-widest text-cyan-400 uppercase mb-2">
          <span>PROGRAMA ACADÉMICO DETALLADO</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-heading font-extrabold text-white mb-2">${course.title}</h2>
        <p class="text-sm text-slate-400 mb-6">${course.subtitle}</p>

        <!-- Course Meta -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800 mb-6 text-xs">
          <div>
            <span class="text-slate-500 block">DURACIÓN</span>
            <span class="font-bold text-white">${course.duration}</span>
          </div>
          <div>
            <span class="text-slate-500 block">NIVEL</span>
            <span class="font-bold text-emerald-400">${course.level}</span>
          </div>
          <div>
            <span class="text-slate-500 block">PROYECTOS</span>
            <span class="font-bold text-cyan-400">${course.projectsCount}</span>
          </div>
          <div>
            <span class="text-slate-500 block">CERTIFICADO</span>
            <span class="font-bold text-white">Incluido</span>
          </div>
        </div>

        <!-- Syllabus Modules Accordion -->
        <div class="space-y-4 mb-8">
          ${course.syllabus.map((mod, idx) => `
            <div class="border border-slate-800 rounded-2xl bg-slate-950/40 overflow-hidden">
              <button onclick="window.ElectroLab.toggleModuleAccordion(this)" class="w-full text-left p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-sm sm:text-base text-slate-200 hover:text-cyan-400 transition-colors">
                <span class="flex items-center gap-3">
                  <span class="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    ${idx + 1}
                  </span>
                  <span>${mod.module}</span>
                </span>
                <svg class="w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div class="module-body px-4 sm:px-6 pb-4 pt-1 space-y-2 border-t border-slate-900">
                ${mod.lessons.map(lesson => `
                  <div class="flex items-center justify-between text-xs py-1.5 text-slate-300 border-b border-slate-900/50 last:border-0">
                    <span class="flex items-center gap-2">
                      <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
                      <span>${lesson.title}</span>
                      ${lesson.isDemo ? '<span class="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">Clase Demo Gratis</span>' : ''}
                    </span>
                    <span class="text-slate-500 font-mono text-[11px] shrink-0">${lesson.duration}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Call to Action Footer -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
          <div>
            <span class="text-xs text-slate-400 block">Acceso Inmediato y de por vida</span>
            <div class="text-2xl font-black text-white">
              ${formatMoney(getCoursePrice(course))}
            </div>
          </div>
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <button onclick="window.ElectroLab.toggleCart('${course.id}'); window.ElectroLab.closeSyllabus();" class="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <span>Inscribirme en este Curso</span>
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closeSyllabus() {
    const modal = document.getElementById('syllabus-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  function toggleModuleAccordion(btn) {
    const body = btn.nextElementSibling;
    const icon = btn.querySelector('svg');
    if (body.classList.contains('hidden')) {
      body.classList.remove('hidden');
      icon.classList.add('rotate-180');
    } else {
      body.classList.add('hidden');
      icon.classList.remove('rotate-180');
    }
  }

  // Modal de Video Demo Gratis
  function openDemoVideo() {
    const modal = document.getElementById('demo-modal');
    const iframe = document.getElementById('demo-iframe');
    if (modal && iframe) {
      iframe.src = 'https://www.youtube.com/embed/videoseries?list=PLZRAKzDxXlAI&autoplay=1';
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
  }

  function closeDemoVideo() {
    const modal = document.getElementById('demo-modal');
    const iframe = document.getElementById('demo-iframe');
    if (modal && iframe) {
      iframe.src = '';
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  // Pasarelas de Pago
  function checkoutWhatsApp() {
    if (state.cart.length === 0) {
      showToast('Agrega al menos un curso al carrito primero');
      return;
    }

    const cartCourses = state.cart.map(id => COURSES.find(c => c.id === id)).filter(Boolean);
    let subtotal = 0;
    cartCourses.forEach(c => subtotal += getCoursePrice(c));
    let discount = state.appliedCoupon ? Math.round(subtotal * CONFIG.couponDiscount) : 0;
    let total = subtotal - discount;

    let itemsList = cartCourses.map(c => `• ${c.title} (${formatMoney(getCoursePrice(c))})`).join('%0A');

    let msg = `Hola ElectroLab Educativa! Quiero comprar los siguientes cursos en mi moneda (${state.currency}):%0A%0A${itemsList}%0A%0A`;
    if (state.appliedCoupon) {
      msg += `Cupón aplicado: ${state.appliedCoupon} (Descuento: ${formatMoney(discount)})%0A`;
    }
    msg += `*Total a abonar: ${formatMoney(total)}*%0A%0A¿Me confirman los datos para abonar (Transferencia bancaria / Mercado Pago / PayPal) y darme acceso? Gracias!`;

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`;
    window.open(url, '_blank');
  }

  function checkoutMercadoPago() {
    if (state.cart.length === 0) {
      showToast('El carrito está vacío');
      return;
    }
    // Si la moneda está en USD, avisar que Mercado Pago opera en ARS
    if (state.currency === 'USD') {
      showToast('Mercado Pago opera en Pesos Argentinos (ARS). Conmutando moneda...', 'info');
      setCurrency('ARS');
    }

    // Modal de confirmación para Mercado Pago / Transferencia directa con alias
    openPaymentModal('mercadopago');
  }

  function checkoutTransferencia() {
    openPaymentModal('transferencia');
  }

  function checkoutPayPal() {
    if (state.currency === 'ARS') {
      showToast('PayPal opera en Dólares (USD). Conmutando moneda...', 'info');
      setCurrency('USD');
    }
    openPaymentModal('paypal');
  }

  function openPaymentModal(method) {
    const modal = document.getElementById('payment-modal');
    const container = document.getElementById('payment-modal-body');
    if (!modal || !container) return;

    const cartCourses = state.cart.map(id => COURSES.find(c => c.id === id)).filter(Boolean);
    let subtotal = 0;
    cartCourses.forEach(c => subtotal += getCoursePrice(c));
    let discount = state.appliedCoupon ? Math.round(subtotal * CONFIG.couponDiscount) : 0;
    let total = subtotal - discount;

    let title = '';
    let detailsHtml = '';

    if (method === 'mercadopago') {
      title = 'Pagar con Mercado Pago (Argentina)';
      detailsHtml = `
        <div class="space-y-4 text-sm text-slate-300">
          <p>Podés abonar con cualquier tarjeta de débito, crédito en cuotas, dinero en cuenta de Mercado Pago o en efectivo (Rapipago / Pago Fácil).</p>
          <div class="bg-blue-950/60 border border-blue-500/30 p-4 rounded-xl">
            <span class="text-xs text-blue-300 block font-semibold mb-1">TOTAL A ABONAR:</span>
            <span class="text-2xl font-bold text-white">${formatMoney(total, 'ARS')}</span>
          </div>
          <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
            Al hacer clic en "Continuar a Mercado Pago", te pondrás en contacto directo para recibir el link de pago seguro o QR oficial de ElectroLab Educativa con acreditación inmediata.
          </div>
          <button onclick="window.ElectroLab.checkoutWhatsApp(); window.ElectroLab.closePaymentModal();" class="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
            <span>Continuar por WhatsApp para Link Oficial MP</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      `;
    } else if (method === 'transferencia') {
      title = 'Transferencia Bancaria Directa (Alias / CBU)';
      detailsHtml = `
        <div class="space-y-4 text-sm text-slate-300">
          <div class="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-emerald-400 font-bold uppercase">Datos Bancarios Oficiales</span>
              <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Sin comisiones</span>
            </div>
            <div class="space-y-1.5 text-xs font-mono">
              <div><strong class="text-slate-400">Titular:</strong> ElectroLab Educativa / D. Barr</div>
              <div><strong class="text-slate-400">Alias:</strong> <span class="text-cyan-300 font-bold select-all bg-black/40 px-1 py-0.5 rounded">ELECTROLAB.CURSOS</span></div>
              <div><strong class="text-slate-400">CVU/CBU:</strong> <span class="text-cyan-300 select-all bg-black/40 px-1 py-0.5 rounded">0000003100045892348712</span></div>
            </div>
          </div>
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <span class="text-xs text-slate-400">Total a transferir:</span>
            <span class="text-xl font-bold text-white">${formatMoney(total, 'ARS')}</span>
          </div>
          <p class="text-xs text-slate-400">Una vez realizada la transferencia, envíanos el comprobante por WhatsApp o por el formulario para habilitar tu cuenta en minutos.</p>
          <button onclick="window.ElectroLab.checkoutWhatsApp(); window.ElectroLab.closePaymentModal();" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
            <span>Enviar Comprobante por WhatsApp</span>
          </button>
        </div>
      `;
    } else {
      title = 'Pago Internacional (PayPal / Stripe / Tarjeta USD)';
      detailsHtml = `
        <div class="space-y-4 text-sm text-slate-300">
          <p>Disponible para estudiantes de toda Latinoamérica, España y el resto del mundo.</p>
          <div class="bg-blue-950/40 border border-blue-500/30 p-4 rounded-xl flex items-center justify-between">
            <span class="text-xs text-slate-300">TOTAL:</span>
            <span class="text-xl font-bold text-white">${formatMoney(total, 'USD')}</span>
          </div>
          <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
            Aceptamos PayPal, tarjetas de crédito Visa, Mastercard, American Express internacionales.
          </div>
          <button onclick="window.ElectroLab.checkoutWhatsApp(); window.ElectroLab.closePaymentModal();" class="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
            <span>Solicitar Link de Pago Internacional por WhatsApp</span>
          </button>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-slate-100">
        <button onclick="window.ElectroLab.closePaymentModal()" class="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <h3 class="text-lg font-heading font-bold text-white mb-4">${title}</h3>
        ${detailsHtml}
      </div>
    `;

    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  // Toast Notifications
  function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 border';

    if (type === 'success') {
      toast.classList.add('bg-emerald-950', 'text-emerald-300', 'border-emerald-600/50');
    } else if (type === 'error') {
      toast.classList.add('bg-red-950', 'text-red-300', 'border-red-600/50');
    } else {
      toast.classList.add('bg-slate-900', 'text-cyan-300', 'border-cyan-600/50');
    }

    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');

    setTimeout(() => {
      toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
    }, 3800);
  }

  // FAQ Accordion
  function setupFAQAccordion() {
    const faqButtons = document.querySelectorAll('.faq-toggle');
    faqButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const content = item.querySelector('.faq-content');
        const icon = btn.querySelector('.faq-icon');
        const isOpen = !content.classList.contains('hidden');

        // Cerrar otros
        document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
        document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

        if (!isOpen) {
          content.classList.remove('hidden');
          icon.classList.add('rotate-180');
        }
      });
    });
  }

  // Event Listeners generales
  function setupEventListeners() {
    // Filtros de categoría
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('bg-cyan-500', 'text-slate-950', 'font-bold');
          b.classList.add('bg-slate-800/80', 'text-slate-300');
        });
        btn.classList.add('bg-cyan-500', 'text-slate-950', 'font-bold');
        btn.classList.remove('bg-slate-800/80', 'text-slate-300');
        state.activeFilter = btn.getAttribute('data-filter');
        renderCourses();
      });
    });

    // Moneda
    const btnArs = document.getElementById('curr-ars');
    const btnUsd = document.getElementById('curr-usd');
    if (btnArs) btnArs.addEventListener('click', () => setCurrency('ARS'));
    if (btnUsd) btnUsd.addEventListener('click', () => setCurrency('USD'));

    // Carrito
    const openCartBtn = document.getElementById('btn-open-cart');
    const closeCartBtn = document.getElementById('btn-close-cart');
    const overlay = document.getElementById('cart-overlay');
    if (openCartBtn) openCartBtn.addEventListener('click', openCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
    if (overlay) overlay.addEventListener('click', closeCartDrawer);

    // Cupón input
    const applyCouponBtn = document.getElementById('btn-apply-coupon');
    const couponInput = document.getElementById('coupon-input');
    if (applyCouponBtn && couponInput) {
      applyCouponBtn.addEventListener('click', () => {
        applyCoupon(couponInput.value);
        couponInput.value = '';
      });
      couponInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          applyCoupon(couponInput.value);
          couponInput.value = '';
        }
      });
    }

    // Mobile Navigation Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // Cerrar modales con ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCartDrawer();
        closeSyllabus();
        closeDemoVideo();
        closePaymentModal();
      }
    });
  }

  // Exponer API a nivel global para llamadas desde el HTML
  window.ElectroLab = {
    setCurrency,
    toggleCart,
    removeFromCart,
    clearCart,
    openCartDrawer,
    closeCartDrawer,
    openSyllabus,
    closeSyllabus,
    toggleModuleAccordion,
    openDemoVideo,
    closeDemoVideo,
    checkoutWhatsApp,
    checkoutMercadoPago,
    checkoutTransferencia,
    checkoutPayPal,
    closePaymentModal,
    showToast
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
