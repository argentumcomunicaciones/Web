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
    couponDiscount: 0.10, // 10% off
    // Datos Oficiales de Pago
    payment: {
      icbc: {
        banco: 'ICBC',
        titular: 'Daniel Esteban Barrio',
        cuit: '20-21833818-7',
        cbu: '0150919301000143972298',
        alias: 'Electrolabeducativa',
        cuenta: 'CA $ 0919/01143972/29'
      },
      mercadopago: {
        titular: 'Daniel Esteban Barrio',
        cuit: '20-21833818-7',
        cvu: '0000003100188764652906',
        alias: 'electrolab.educativa'
      },
      paypal: {
        email: 'dbarrio1970@gmail.com',
        currency: 'USD'
      }
    }
  };

  // Base de datos de los 4 Cursos Oficiales y Recursos
  const COURSES = [
    {
      id: 'curso-1',
      category: 'curso-1',
      title: 'Curso 1: Fundamentos de Electrónica y Fuentes Lineales',
      subtitle: 'Magnitudes fundamentales, circuitos mixtos, semiconductores, compuertas con diodos, transformadores, filtrado y proyecto integrador de fuente lineal completa.',
      tag: '⭐ CURSO 1 · BASE FUNDAMENTAL',
      level: 'Principiante a Intermedio',
      duration: '15 Clases · +30 Horas de video HD',
      projectsCount: '15 Clases Prácticas',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
      badgeColor: 'blue',
      priceARS: 18900,
      origARS: 34500,
      priceUSD: 19,
      origUSD: 35,
      driveFolder: 'https://drive.google.com/drive/folders/1rXuc5CcPYwX8eChWINgNXDo7Sl7a0It8?usp=drive_link',
      youtubePreview: 'https://www.youtube.com/embed/videoseries?list=PLZRAKzDxXlAI',
      features: [
        'Magnitudes fundamentales: tensión, corriente, resistencia y potencia en CC',
        'Circuitos resistivos serie, paralelo y mixto; divisores de tensión y corriente',
        'Diodos de silicio y germanio: juntura PN y compuertas lógicas con diodos',
        'Simulaciones profesionales en LTspice y modelado de componentes no lineales',
        'Electromagnetismo, inductores y transformación de corriente alterna',
        'Rectificación de media onda y onda completa con puente de diodos',
        'Filtrado capacitivo, rizado y regulación con Diodo Zener',
        'Fuentes simétricas, multiplicadores de voltaje y ensamble de Fuente Lineal'
      ],
      syllabus: [
        {
          module: 'Módulo 1: Conceptos Eléctricos y Circuitos Resistivos',
          lessons: [
            { title: 'Clase 1: Conceptos Eléctricos Básicos', desc: 'Magnitudes fundamentales: tensión, corriente, resistencia y potencia. Análisis elemental de circuitos en CC.', duration: '45 min', isDemo: true },
            { title: 'Clase 2: Circuitos Mixtos y Divisores', desc: 'Análisis resistivo serie, paralelo y mixto; divisores de tensión y corriente.', duration: '50 min' }
          ]
        },
        {
          module: 'Módulo 2: Diodos Semiconductores y Compuertas Lógicas',
          lessons: [
            { title: 'Clase 3: Introducción a los Diodos Semiconductores', desc: 'Juntura PN, diferencias silicio/germanio y estados de polarización.', duration: '40 min' },
            { title: 'Clase 4: Circuitos con Diodos en Serie y Paralelo', desc: 'Comportamiento en mallas y punto de operación.', duration: '45 min' },
            { title: 'Clase 5: Compuertas Lógicas con Diodos', desc: 'Implementación de funciones AND y OR con diodos y resistencias.', duration: '40 min' }
          ]
        },
        {
          module: 'Módulo 3: Simulación Circuital e Inductores',
          lessons: [
            { title: 'Clase 6: Simulación Circuital y Diodos de Germanio', desc: 'Simulaciones en LTspice y modelado de componentes no lineales.', duration: '55 min' },
            { title: 'Clase 7: Electromagnetismo e Inductores', desc: 'Inducción magnética, comportamiento de inductores y relación de transformación.', duration: '45 min' }
          ]
        },
        {
          module: 'Módulo 4: Rectificación y Almacenamiento Capacitivo',
          lessons: [
            { title: 'Clase 8: Rectificación de Media Onda', desc: 'Conversión AC a CC con un diodo rectificador.', duration: '40 min' },
            { title: 'Clase 9: Rectificación de Onda Completa', desc: 'Puente de diodos y flujo en ambos semiciclos.', duration: '50 min' },
            { title: 'Clase 10: Capacitancia y Tipos de Capacitores', desc: 'Almacenamiento electrostático, dieléctricos y agrupamiento.', duration: '45 min' }
          ]
        },
        {
          module: 'Módulo 5: Filtrado, Regulación Zener y Fuentes Simétricas',
          lessons: [
            { title: 'Clase 11: Filtrado Capacitivo', desc: 'Reducción del rizado mediante descarga progresiva.', duration: '45 min' },
            { title: 'Clase 12: Regulación con Diodo Zener', desc: 'Estabilización por zona de ruptura.', duration: '50 min' },
            { title: 'Clase 13: Fuentes de Alimentación Simétricas', desc: 'Salidas positiva, negativa y masa.', duration: '55 min' }
          ]
        },
        {
          module: 'Módulo 6: Multiplicadores y Proyecto Integrador',
          lessons: [
            { title: 'Clase 14: Multiplicadores de Voltaje', desc: 'Circuitos escalonados diodo-capacitor para elevar tensión continua.', duration: '45 min' },
            { title: 'Clase 15: Proyecto Integrador: Fuente Lineal Completa', desc: 'Ensamblado y prueba global: transformación, rectificación, filtrado y regulación.', duration: '65 min' }
          ]
        }
      ]
    },
    {
      id: 'curso-2',
      category: 'curso-2',
      title: 'Curso 2: Amplificación con Transistores y Electrónica de Potencia',
      subtitle: 'Estructuras BJT NPN/PNP, polarización en CC, excursión simétrica, pequeña señal, respuesta en frecuencia, JFET/MOSFET y fuentes conmutadas.',
      tag: '⚡ CURSO 2 · POTENCIA & BJT/FET',
      level: 'Intermedio a Avanzado',
      duration: '12 Clases · +28 Horas de video HD',
      projectsCount: '12 Clases Prácticas',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      badgeColor: 'cyan',
      priceARS: 22500,
      origARS: 42000,
      priceUSD: 23,
      origUSD: 42,
      driveFolder: 'https://drive.google.com/drive/folders/1g0FJAD-2iifE4DgZ789MvjOsHHfYQMVa?usp=drive_link',
      youtubePreview: 'https://www.youtube.com/embed/videoseries?list=PLdmC3bfdJGAk',
      features: [
        'Transistores BJT NPN y PNP: zonas de corte, saturación y activa',
        'Redes de polarización en CC para fijar el punto de reposo estático (Q)',
        'Punto de trabajo dinámico con superposición de señales alternas',
        'Máxima excursión simétrica: recta de carga para evitar recortes',
        'Balance de potencia y eficiencia: potencia de fuente y útil en la carga',
        'Configuraciones colector común (seguidor de emisor) y base común',
        'Modelado en pequeña señal con parámetros híbridos y cálculo de ganancias',
        'Respuesta en frecuencia, diagramas de Bode, transistores FET y fuentes conmutadas'
      ],
      syllabus: [
        {
          module: 'Módulo 1: Fundamentos y Polarización del Transistor BJT',
          lessons: [
            { title: 'Clase 1: Transistores BJT', desc: 'Estructura NPN y PNP, zonas de corte, saturación y activa; corrientes de terminal.', duration: '50 min', isDemo: true },
            { title: 'Clase 2: Polarización en Corriente Continua', desc: 'Redes de polarización para fijar el punto de reposo estático.', duration: '55 min' },
            { title: 'Clase 3: Punto de Trabajo Dinámico', desc: 'Superposición de señales alternas a la polarización CC.', duration: '50 min' }
          ]
        },
        {
          module: 'Módulo 2: Excursión Simétrica y Rendimiento Energético',
          lessons: [
            { title: 'Clase 4: Máxima Excursión Simétrica', desc: 'Recta de carga y punto Q central para evitar recortes.', duration: '55 min' },
            { title: 'Clase 5: Balance de Potencia y Eficiencia', desc: 'Potencia de fuente, disipada y entregada a la carga.', duration: '50 min' }
          ]
        },
        {
          module: 'Módulo 3: Configuraciones y Modelado en Pequeña Señal',
          lessons: [
            { title: 'Clase 6: Configuración Colector Común', desc: 'Seguidor de emisor para adaptación de impedancias.', duration: '45 min' },
            { title: 'Clase 7: Configuración Base Común', desc: 'Baja impedancia de entrada y alta respuesta en frecuencia.', duration: '45 min' },
            { title: 'Clase 8: Modelado en Pequeña Señal', desc: 'Parámetros híbridos, cálculo de ganancias e impedancias.', duration: '60 min' }
          ]
        },
        {
          module: 'Módulo 4: Respuesta en Frecuencia y Diagramas de Bode',
          lessons: [
            { title: 'Clase 9: Respuesta en Frecuencia', desc: 'Capacitores de acople y capacitancias parásitas internas.', duration: '55 min' },
            { title: 'Clase 10: Ancho de Banda y Diagramas de Bode', desc: 'Frecuencias de corte inferior y superior.', duration: '60 min' }
          ]
        },
        {
          module: 'Módulo 5: Transistores FET y Fuentes Conmutadas',
          lessons: [
            { title: 'Clase 11: Transistores de Efecto de Campo (FET)', desc: 'Dispositivos JFET y MOSFET controlados por tensión.', duration: '60 min' },
            { title: 'Clase 12: Fuentes Conmutadas', desc: 'Topologías reductoras/elevadoras y conmutación de alta frecuencia.', duration: '65 min' }
          ]
        }
      ]
    },
    {
      id: 'curso-3',
      category: 'curso-3',
      title: 'Curso 3: Amplificadores Operacionales y Filtros Analógicos',
      subtitle: 'Etapas diferenciales, Op-Amps lineales y no lineales, Schmitt Triggers, temporizador 555, instrumentación, conversores ADC/DAC y filtros activos de orden superior.',
      tag: '🎛️ CURSO 3 · OP-AMPS & FILTROS',
      level: 'Intermedio a Avanzado',
      duration: '19 Clases · +40 Horas de video HD',
      projectsCount: '19 Clases Prácticas',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      badgeColor: 'emerald',
      priceARS: 31900,
      origARS: 76500,
      priceUSD: 32,
      origUSD: 77,
      driveFolder: 'https://drive.google.com/drive/folders/18vYXavKUw_ge42v26zVGgFxHzGsSWV5J?usp=drive_link',
      youtubePreview: 'https://www.youtube.com/embed/videoseries?list=PLZRAKzDxXlAI',
      features: [
        'Amplificadores diferenciales: rechazo de modo común y fuentes de corriente',
        'Op-Amp ideal y real: arquitectura interna y lazo abierto',
        'Configuraciones inversora, no inversora, buffer, sumador y restador',
        'Comparadores e histéresis: Schmitt Trigger antirruido',
        'Temporizador NE555 a fondo: modos astable y monoestable',
        'Amplificadores de instrumentación de alta precisión para sensores',
        'Integradores, derivadores, decibeles y conversores ADC/DAC',
        'Filtros pasivos y activos pasa bajo, pasa alto, pasa banda y orden superior'
      ],
      syllabus: [
        {
          module: 'Módulo 1: Arquitectura y Configuraciones Básicas',
          lessons: [
            { title: 'Clase 1: Amplificadores Diferenciales', desc: 'Etapa de entrada, rechazo de modo común y fuentes de corriente.', duration: '50 min', isDemo: true },
            { title: 'Clase 2: El Amplificador Operacional Ideal y Real', desc: 'Pines, arquitectura interna y lazo abierto.', duration: '55 min' },
            { title: 'Clase 3: Configuración Inversora y Tierra Virtual', desc: 'Punto de suma virtual y ajuste de ganancia.', duration: '45 min' },
            { title: 'Clase 4: Configuración No Inversora y Buffer', desc: 'Alta impedancia de entrada y seguidor de tensión.', duration: '45 min' }
          ]
        },
        {
          module: 'Módulo 2: Procesamiento Matemático y Acondicionamiento',
          lessons: [
            { title: 'Clase 5: Operaciones Sumadoras y Combinadas', desc: 'Mezcla y suma ponderada de señales.', duration: '40 min' },
            { title: 'Clase 6: Amplificador Restador', desc: 'Sustracción diferencial de voltajes analógicos.', duration: '45 min' },
            { title: 'Clase 9: Amplificadores de Instrumentación', desc: 'Arreglo de 3 op-amps para alta precisión y sensores.', duration: '55 min' },
            { title: 'Clase 10: Integradores Analógicos', desc: 'Rampas y conversión cuadrada a triangular.', duration: '50 min' },
            { title: 'Clase 11: Derivadores Analógicos', desc: 'Tasa de cambio de señal y respuesta a altas frecuencias.', duration: '50 min' }
          ]
        },
        {
          module: 'Módulo 3: Comparadores, NE555 y Cuantización',
          lessons: [
            { title: 'Clase 7: Comparadores e Histéresis', desc: 'Comparación en lazo abierto y Schmitt Trigger antirruido.', duration: '50 min' },
            { title: 'Clase 8: Temporizador NE555', desc: 'Comparadores internos, modos astable y monoestable.', duration: '55 min' },
            { title: 'Clase 12: Conversores ADC y DAC', desc: 'Redes R-2R y comparadores de cuantización.', duration: '50 min' }
          ]
        },
        {
          module: 'Módulo 4: Decibeles y Teoría de Filtros',
          lessons: [
            { title: 'Clase 13: Decibeles y Respuesta Logarítmica', desc: 'Escala logarítmica y acondicionamiento.', duration: '45 min' },
            { title: 'Clase 14: Introducción Teórica a los Filtros', desc: 'Banda de paso, atenuación y frecuencia de corte.', duration: '50 min' }
          ]
        },
        {
          module: 'Módulo 5: Filtros Pasivos (RC y RL)',
          lessons: [
            { title: 'Clase 15: Filtros Pasivos Pasa Bajo', desc: 'Topologías RC y RL.', duration: '45 min' },
            { title: 'Clase 16: Filtros Pasivos Pasa Alto', desc: 'Atenuación de componentes de baja frecuencia.', duration: '45 min' },
            { title: 'Clase 17: Filtros Pasivos Pasa Banda', desc: 'Resonancia, selectividad y factor Q.', duration: '55 min' }
          ]
        },
        {
          module: 'Módulo 6: Filtros Activos Lineales y Orden Superior',
          lessons: [
            { title: 'Clase 18: Filtros Activos de Primer Orden', desc: 'Filtros con op-amps sin pérdidas por carga.', duration: '55 min' },
            { title: 'Clase 19: Filtros Activos de Orden Superior', desc: 'Filtros de segundo orden con pendientes pronunciadas.', duration: '60 min' }
          ]
        }
      ]
    },
    {
      id: 'curso-4',
      category: 'curso-4',
      title: 'Curso 4: Microcontroladores, Sensores y Adquisición de Datos',
      subtitle: 'Programación estructurada en C/C++, lógica no bloqueante con millis, multiplexación de 7 segmentos, lecturas analógicas ADC, termostatos y telemetría en tiempo real.',
      tag: '🤖 CURSO 4 · FIRMWARE & SENSORES',
      level: 'Todos los niveles',
      duration: '10 Clases · +25 Horas de video HD',
      projectsCount: '10 Clases Prácticas',
      image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
      badgeColor: 'cyan',
      priceARS: 7900,
      origARS: 14900,
      priceUSD: 8,
      origUSD: 15,
      driveFolder: 'https://drive.google.com/drive/folders/1Ria3iinViGHPSRa1VlQIypBTQRrf-IAX?usp=drive_link',
      youtubePreview: 'https://www.youtube.com/embed/videoseries?list=PLdmC3bfdJGAk',
      features: [
        'Estructura setup/loop y control eficiente de salidas digitales',
        'Temporización profesional no bloqueante con millis y secuencias de semáforo',
        'Comunicación serial y envío de telemetría y variables numéricas a la PC',
        'Entradas digitales, pull-up interno y detección de pulsos sin rebote mecánico',
        'Estructuras de control, bucles y gestión de eventos secuenciales',
        'Multiplexación de pantallas de 7 segmentos de 4 dígitos',
        'Lectura analógica (ADC), potenciómetros y mapeo de rangos',
        'Termostatos, relés, sensores y adquisición de datos en tiempo real'
      ],
      syllabus: [
        {
          module: 'Módulo 1: Salidas Digitales, Temporización y Comunicación',
          lessons: [
            { title: 'Clase 1: Introducción a Microcontroladores y Salidas Digitales', desc: 'Estructura setup/loop y control de LEDs.', duration: '40 min', isDemo: true },
            { title: 'Clase 2: Temporización y Secuenciadores Lógicos', desc: 'Retardos, millis y secuencias de semáforo.', duration: '50 min' },
            { title: 'Clase 3: Comunicación Serial y Declaración de Variables', desc: 'Envío de telemetría y variables numéricas a la PC.', duration: '45 min' }
          ]
        },
        {
          module: 'Módulo 2: Entradas Digitales, Anti-Rebote y Control de Flujo',
          lessons: [
            { title: 'Clase 4: Lectura de Entradas Digitales y Pulsadores', desc: 'Pull-up interno y detección de pulsos.', duration: '45 min' },
            { title: 'Clase 5: Estructuras de Control y Contadores', desc: 'Condicionales, bucles y control de eventos no bloqueantes.', duration: '50 min' }
          ]
        },
        {
          module: 'Módulo 3: Multiplexación de Displays y Lectura Analógica ADC',
          lessons: [
            { title: 'Clase 6: Multiplexación de Pantallas de 7 Segmentos', desc: 'Barrido multiplexado para displays de 4 dígitos.', duration: '55 min' },
            { title: 'Clase 7: Lectura Analógica y Conversión Digital', desc: 'Muestreo ADC interno de potenciómetros y mapeo de rangos.', duration: '50 min' }
          ]
        },
        {
          module: 'Módulo 4: Control de Procesos, Sensores y Adquisición',
          lessons: [
            { title: 'Clase 8: Control de Procesos y Termostatos', desc: 'Umbrales de temperatura, control de relés y motores.', duration: '55 min' },
            { title: 'Clase 9: Integración de Módulos Sensores y Actuadores', desc: 'Luz, sonido, presencia, inclinación y buzzers.', duration: '50 min' },
            { title: 'Clase 10: Adquisición de Datos e Interfaz en Tiempo Real', desc: 'Telemetría en serie, graficación continua y enlace a hojas de cálculo.', duration: '60 min' }
          ]
        }
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
                  <div class="flex items-start justify-between text-xs py-2 text-slate-300 border-b border-slate-900/50 last:border-0 gap-3">
                    <div class="flex items-start gap-2.5">
                      <svg class="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-white text-xs">${lesson.title}</span>
                          ${lesson.isDemo ? '<span class="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">Clase Demo Gratis</span>' : ''}
                        </div>
                        ${lesson.desc ? `<p class="text-[11px] text-slate-400 mt-0.5 leading-relaxed">${lesson.desc}</p>` : ''}
                      </div>
                    </div>
                    <span class="text-slate-500 font-mono text-[11px] shrink-0 pt-0.5">${lesson.duration}</span>
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

  // Copiado rápido al portapapeles con feedback interactivo
  function copyToClipboard(text, label, btnElement) {
    const handleSuccess = () => {
      showToast(`¡${label} copiado al portapapeles!`, 'success');
      if (btnElement) {
        const originalHtml = btnElement.innerHTML;
        btnElement.innerHTML = `
          <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span class="text-emerald-400 font-bold">¡Copiado!</span>
        `;
        setTimeout(() => {
          btnElement.innerHTML = originalHtml;
        }, 2000);
      }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(handleSuccess).catch(() => {
        fallbackCopy(text, label, handleSuccess);
      });
    } else {
      fallbackCopy(text, label, handleSuccess);
    }
  }

  function fallbackCopy(text, label, onSuccess) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      if (onSuccess) onSuccess();
      else showToast(`¡${label} copiado!`, 'success');
    } catch (err) {
      showToast(`Error al copiar: ${text}`, 'error');
    }
    document.body.removeChild(textArea);
  }

  // Envío del comprobante de pago por WhatsApp con los detalles del pedido
  function sendPaymentReceipt(methodName) {
    const cartCourses = state.cart.map(id => COURSES.find(c => c.id === id)).filter(Boolean);
    let subtotal = 0;
    cartCourses.forEach(c => subtotal += getCoursePrice(c));
    let discount = state.appliedCoupon ? Math.round(subtotal * CONFIG.couponDiscount) : 0;
    let total = subtotal - discount;
    let curr = (methodName === 'PayPal') ? 'USD' : 'ARS';

    let itemsList = cartCourses.map(c => `• ${c.title}`).join('%0A');

    let msg = `Hola ElectroLab Educativa! Acabo de realizar el pago mediante *${methodName}* por un total de *${formatMoney(total, curr)}*:%0A%0ACursos:%0A${itemsList}%0A%0AAdjunto el comprobante de la operación para que puedan habilitar mi acceso al aula virtual. Muchas gracias!`;

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`;
    window.open(url, '_blank');
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

    const whatsappComprobanteUrl = 'https://wa.me/5491123065347?text=Hola%20Daniel%2C%20adjunto%20comprobante%20de%20pago%20para%20habilitar%20mi%20curso%20en%20ElectroLab%20Educativa';

    let title = '';
    let detailsHtml = '';

    if (method === 'transferencia') {
      title = 'Transferencia Bancaria Directa (ICBC)';
      detailsHtml = `
        <div class="space-y-4 text-sm text-slate-300">
          <div class="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 p-4 sm:p-5 rounded-2xl space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-emerald-500/20">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Datos Oficiales Banco ICBC</span>
              </div>
              <span class="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">Sin Comisiones</span>
            </div>

            <!-- Total a transferir -->
            <div class="bg-black/50 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
              <span class="text-xs text-slate-400 font-sans">Total a transferir:</span>
              <span class="text-xl sm:text-2xl font-bold font-mono text-emerald-400">${formatMoney(total, 'ARS')}</span>
            </div>

            <!-- Datos de la cuenta -->
            <div class="space-y-2 text-xs font-mono">
              <div class="flex justify-between py-1 border-b border-slate-800/60">
                <span class="text-slate-400">Banco:</span>
                <span class="text-white font-bold">ICBC</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800/60">
                <span class="text-slate-400">Titular:</span>
                <span class="text-white font-bold">Daniel Esteban Barrio</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800/60">
                <span class="text-slate-400">CUIT/CUIL:</span>
                <span class="text-white select-all font-bold">20-21833818-7</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800/60">
                <span class="text-slate-400">Cuenta:</span>
                <span class="text-white select-all font-bold">CA $ 0919/01143972/29</span>
              </div>

              <!-- CBU con botón copiar -->
              <div class="bg-slate-950/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2 mt-2">
                <div class="overflow-hidden">
                  <span class="text-[10px] text-slate-400 block font-sans">CBU:</span>
                  <span class="text-cyan-300 font-bold text-xs sm:text-sm select-all">0150919301000143972298</span>
                </div>
                <button type="button" onclick="window.ElectroLab.copyToClipboard('0150919301000143972298', 'CBU', this)" class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  <span>Copiar CBU</span>
                </button>
              </div>

              <!-- Alias con botón copiar -->
              <div class="bg-slate-950/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <div class="overflow-hidden">
                  <span class="text-[10px] text-slate-400 block font-sans">Alias:</span>
                  <span class="text-cyan-300 font-bold text-xs sm:text-sm select-all">Electrolabeducativa</span>
                </div>
                <button type="button" onclick="window.ElectroLab.copyToClipboard('Electrolabeducativa', 'Alias', this)" class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  <span>Copiar Alias</span>
                </button>
              </div>
            </div>
          </div>

          <p class="text-xs text-slate-400 text-center">Una vez realizada la transferencia, envía el comprobante para darte de alta al instante:</p>

          <a href="${whatsappComprobanteUrl}" target="_blank" rel="noopener noreferrer" onclick="window.ElectroLab.closePaymentModal()" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 text-xs sm:text-sm">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            <span>Enviar Comprobante por WhatsApp</span>
          </a>
        </div>
      `;
    } else if (method === 'mercadopago') {
      title = 'Mercado Pago (Argentina · Transferencia / CVU)';
      detailsHtml = `
        <div class="space-y-4 text-sm text-slate-300">
          <div class="bg-gradient-to-br from-sky-950/60 to-slate-900 border border-sky-500/30 p-4 sm:p-5 rounded-2xl space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-sky-500/20">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
                <span class="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">Cuenta Mercado Pago Oficial</span>
              </div>
              <span class="text-[10px] bg-sky-500/20 text-sky-300 font-bold px-2 py-0.5 rounded-full">Acreditación Inmediata</span>
            </div>

            <!-- Total a abonar -->
            <div class="bg-black/50 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
              <span class="text-xs text-slate-400 font-sans">Total a transferir:</span>
              <span class="text-xl sm:text-2xl font-bold font-mono text-sky-400">${formatMoney(total, 'ARS')}</span>
            </div>

            <!-- Datos oficiales MP -->
            <div class="space-y-2 text-xs font-mono">
              <div class="flex justify-between py-1 border-b border-slate-800/60">
                <span class="text-slate-400">Titular:</span>
                <span class="text-white font-bold">Daniel Esteban Barrio</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-800/60">
                <span class="text-slate-400">CUIT/CUIL:</span>
                <span class="text-white select-all font-bold">20-21833818-7</span>
              </div>

              <!-- CVU con botón copiar -->
              <div class="bg-slate-950/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2 mt-2">
                <div class="overflow-hidden">
                  <span class="text-[10px] text-slate-400 block font-sans">CVU Mercado Pago:</span>
                  <span class="text-cyan-300 font-bold text-xs sm:text-sm select-all">0000003100188764652906</span>
                </div>
                <button type="button" onclick="window.ElectroLab.copyToClipboard('0000003100188764652906', 'CVU', this)" class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold transition-all">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  <span>Copiar CVU</span>
                </button>
              </div>

              <!-- Alias con botón copiar -->
              <div class="bg-slate-950/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <div class="overflow-hidden">
                  <span class="text-[10px] text-slate-400 block font-sans">Alias Mercado Pago:</span>
                  <span class="text-cyan-300 font-bold text-xs sm:text-sm select-all">electrolab.educativa</span>
                </div>
                <button type="button" onclick="window.ElectroLab.copyToClipboard('electrolab.educativa', 'Alias MP', this)" class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold transition-all">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  <span>Copiar Alias</span>
                </button>
              </div>
            </div>
          </div>

          <p class="text-xs text-slate-400 text-center">Transfiere dinero en cuenta desde tu app de Mercado Pago o cualquier banco con el CVU o Alias. Luego envía tu comprobante:</p>

          <a href="${whatsappComprobanteUrl}" target="_blank" rel="noopener noreferrer" onclick="window.ElectroLab.closePaymentModal()" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 text-xs sm:text-sm">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            <span>Enviar Comprobante por WhatsApp</span>
          </a>
        </div>
      `;
    } else {
      title = 'Pago Internacional (PayPal · USD)';
      detailsHtml = `
        <div class="space-y-4 text-sm text-slate-300">
          <div class="bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/30 p-4 sm:p-5 rounded-2xl space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-amber-500/20">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span class="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">PayPal Internacional (USD)</span>
              </div>
              <span class="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">Exterior</span>
            </div>

            <!-- Total en USD -->
            <div class="bg-black/50 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
              <span class="text-xs text-slate-400 font-sans">Total a abonar en USD:</span>
              <span class="text-xl sm:text-2xl font-bold font-mono text-amber-400">${formatMoney(total, 'USD')}</span>
            </div>

            <!-- Instrucciones de cuenta -->
            <div class="space-y-1 text-xs">
              <div class="text-slate-400">Método de pago:</div>
              <div class="text-white font-bold">Transferencia / Envío directo vía PayPal</div>
            </div>

            <!-- Email de PayPal con botón copiar -->
            <div class="bg-slate-950/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
              <div class="overflow-hidden">
                <span class="text-[10px] text-slate-400 block font-sans">Email de PayPal:</span>
                <span class="text-amber-300 font-bold text-xs sm:text-sm select-all font-mono">dbarrio1970@gmail.com</span>
              </div>
              <button type="button" onclick="window.ElectroLab.copyToClipboard('dbarrio1970@gmail.com', 'Email de PayPal', this)" class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                <span>Copiar Email de PayPal</span>
              </button>
            </div>

            <!-- Enlace directo para abonar en PayPal -->
            <a href="https://www.paypal.com" target="_blank" rel="noopener noreferrer" class="w-full bg-slate-900 border border-amber-500/40 hover:bg-slate-800 text-amber-300 hover:text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.774.774 0 0 1 .763-.646h7.008c3.15 0 5.467 1.054 5.922 3.864.218 1.344-.067 2.766-.826 3.743-.728.937-1.854 1.488-3.23 1.584l-.19.008h-2.92a.774.774 0 0 0-.764.646l-.999 6.337a.641.641 0 0 1-.632.535z"/></svg>
              <span>Ir a PayPal (paypal.com) para abonar</span>
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>

          <p class="text-xs text-slate-400 text-center">Una vez realizado el envío por PayPal, envía tu comprobante para darte de alta al instante:</p>

          <a href="${whatsappComprobanteUrl}" target="_blank" rel="noopener noreferrer" onclick="window.ElectroLab.closePaymentModal()" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 text-xs sm:text-sm">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            <span>Enviar Comprobante por WhatsApp</span>
          </a>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl text-slate-100">
        <button type="button" onclick="window.ElectroLab.closePaymentModal()" class="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors" title="Cerrar ventana">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <h3 class="text-lg font-heading font-bold text-white mb-4 pr-8">${title}</h3>
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
    copyToClipboard,
    sendPaymentReceipt,
    showToast
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
