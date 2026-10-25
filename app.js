/**
 * ElectroLab Educativa - Store Engine & Interactive Experience
 * Gestión de cursos, carrito de compras multi-moneda (ARS/USD),
 * temarios interactivos, pasarela WhatsApp / Mercado Pago / Transferencia.
 */

(function () {
  'use strict';

  // Configuración base de la tienda
  const CONFIG = {
    whatsappNumber: '5491123065347', // WhatsApp oficial de ElectroLab (+54 9 11 2306-5347)
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

  // BANCO OFICIAL DE PREGUNTAS: Examen Final del Curso 1 (10 Preguntas)
  const examenCurso1 = [
    {
      pregunta: "Si en un circuito resistivo puro se duplica el voltaje manteniendo constante la resistencia, ¿qué ocurre con la corriente?",
      opciones: ["Se reduce a la mitad", "Se mantiene constante", "Se duplica", "Se cuadruplica"],
      correcta: 2
    },
    {
      pregunta: "La Ley de Corrientes de Kirchhoff (LKC) aplicada a un nodo se fundamenta en la conservación de:",
      opciones: ["La energía", "La carga eléctrica", "La masa", "El campo magnético"],
      correcta: 1
    },
    {
      pregunta: "En un divisor serie con fuente de 12V, R1 = 1kΩ y R2 = 3kΩ, ¿cuál es la tensión sobre R2?",
      opciones: ["3V", "6V", "9V", "12V"],
      correcta: 2
    },
    {
      pregunta: "Para calcular la resistencia equivalente de Thévenin (Rth), las fuentes de tensión independientes ideales deben:",
      opciones: ["Dejarse en circuito abierto", "Reemplazarse por un cortocircuito", "Conectarse a tierra con 1MΩ", "Mantener su valor nominal"],
      correcta: 1
    },
    {
      pregunta: "La corriente de Norton (In) en un circuito equivalente se obtiene calculando la corriente al:",
      opciones: ["Abrir los terminales de carga", "Conectar un voltímetro de alta impedancia", "Cortocircuitar los terminales de carga", "Apagar fuentes dependientes"],
      correcta: 2
    },
    {
      pregunta: "Si un capacitor cerámico presenta en su encapsulado el código '104', su capacitancia equivale a:",
      opciones: ["104 pF", "10 nF", "100 nF (0.1 µF)", "1 µF"],
      correcta: 2
    },
    {
      pregunta: "En un circuito serie RC, la constante de tiempo (tau) define el tiempo en que el capacitor alcanza aproximadamente el:",
      opciones: ["50% de la tensión de entrada", "63.2% de la tensión de entrada", "86.5% de la tensión de entrada", "99.3% de la tensión de entrada"],
      correcta: 1
    },
    {
      pregunta: "Para una señal senoidal pura con tensión de pico Vp = 311V, el valor eficaz (Vrms) aproximado es:",
      opciones: ["155V", "220V", "311V", "622V"],
      correcta: 1
    },
    {
      pregunta: "En un circuito serie RLC, la frecuencia de resonancia se produce exactamente cuando:",
      opciones: ["XL es igual a cero", "R es igual a la impedancia Z", "XL es igual a XC", "La corriente por el circuito es mínima"],
      correcta: 2
    },
    {
      pregunta: "Al representar impedancias en notación compleja, la reactancia de un capacitor puro se define como:",
      opciones: ["+j XL", "-j XC", "R + jω", "1 / jR"],
      correcta: 1
    }
  ];

  window.examenCurso1 = examenCurso1;

  // BANCO OFICIAL DE PREGUNTAS: Examen Final del Curso 2 (10 Preguntas)
  const examenCurso2 = [
    {
      pregunta: "En una conexión serie de un diodo de silicio (0.7V) y un LED rojo (1.8V) alimentados con 12V a través de un resistor R, ¿cuál es la caída de tensión sobre el resistor?",
      opciones: ["12.0 V", "10.2 V", "9.5 V", "7.5 V"],
      correcta: 2
    },
    {
      pregunta: "Para que un diodo Zener opere en su zona de disrupción y cumpla la función de regulador, la tensión suministrada por la fuente (Vs) debe ser:",
      opciones: [
        "Menor que la tensión nominal del Zener (Vz)",
        "Mayor que la tensión nominal del Zener (Vz)",
        "Exactamente igual a 0.7 V en directa",
        "Alterna pura sin componente de continua"
      ],
      correcta: 1
    },
    {
      pregunta: "Al simular un transformador con acoplamiento K=1 en LTspice, si se desea una relación de transformación Np/Ns = 10 a 1, la inductancia del primario (L1) respecto a la del secundario (L2) debe ser:",
      opciones: [
        "10 veces mayor (relación lineal)",
        "100 veces mayor (proporcional al cuadrado de las espiras)",
        "Igual a la raíz cuadrada de 10",
        "Exactamente el doble"
      ],
      correcta: 1
    },
    {
      pregunta: "En un rectificador de media onda alimentado por una señal senoidal con una frecuencia de red de 50 Hz, ¿cuál es la frecuencia fundamental del rizado a la salida?",
      opciones: ["25 Hz", "50 Hz", "100 Hz", "0 Hz"],
      correcta: 1
    },
    {
      pregunta: "¿Qué factor influye en la reducción del porcentaje de rizado (ripple) en una fuente con filtro capacitivo?",
      opciones: [
        "Aumentar el valor de la capacitancia del filtro",
        "Aumentar drásticamente la corriente consumida por la carga",
        "Reducir la frecuencia de la señal de entrada",
        "Disminuir la resistencia de carga a casi cero"
      ],
      correcta: 0
    },
    {
      pregunta: "En una red eléctrica de 220V RMS, la tensión de pico que ingresa al primario del transformador es aproximadamente:",
      opciones: ["220 V", "240 V", "311 V", "440 V"],
      correcta: 2
    },
    {
      pregunta: "En una fuente simétrica con transformador de punto medio y puente rectificador, la caída de tensión introducida por los diodos en cada rama respecto de masa equivale a:",
      opciones: [
        "La caída de un solo diodo (0.7 V)",
        "La caída de dos diodos en serie (1.4 V)",
        "Cero voltios por efecto de la cancelación simétrica",
        "Cuatro caídas de diodo simultáneas"
      ],
      correcta: 0
    },
    {
      pregunta: "¿Cuál es la principal ventaja de un regulador serie con transistor de paso respecto a un regulador paralelo?",
      opciones: [
        "Menor rendimiento energético global",
        "Mayor eficiencia energética y menor disipación térmica cuando la carga consume poca corriente",
        "No requiere conexión a la tensión de referencia Zener",
        "No disipa potencia en ninguna condición de trabajo"
      ],
      correcta: 1
    },
    {
      pregunta: "En un convertidor conmutado reductor (Buck / Step-Down), la tensión continua de salida regulada es:",
      opciones: [
        "Siempre mayor que la tensión de entrada",
        "Siempre menor o igual que la tensión de entrada, proporcional al ciclo de trabajo (D)",
        "Completamente independiente del ancho de pulso PWM",
        "Una señal senoidal pura de alta potencia"
      ],
      correcta: 1
    },
    {
      pregunta: "¿Cuál es la función del diodo volante (flywheel diode) en una topología Buck cuando el interruptor conmutador pasa al estado OFF?",
      opciones: [
        "Proporcionar un camino de descarga para que la energía almacenada en el campo magnético del inductor continúe circulando hacia la carga",
        "Cortocircuitar la fuente de alimentación para proteger el fusible",
        "Invertir la polaridad del capacitor de salida",
        "Aumentar la frecuencia de conmutación del oscilador"
      ],
      correcta: 0
    }
  ];

  window.examenCurso2 = examenCurso2;

  // Base de datos de los 5 Cursos Oficiales y Recursos
  const COURSES = [
    {
      id: 'curso-1',
      category: 'curso-1',
      title: 'Curso 1: Introducción a la Electrónica, Análisis de Circuitos en Corriente Continua (CC)',
      subtitle: 'Ley de Ohm, leyes de Kirchhoff, circuitos mixtos, Thévenin, Norton, capacitores, transitorios RC, fundamentos de CA, resonancia RLC e impedancia compleja.',
      tag: '⭐ CURSO 1 · BASE & CIRCUITOS CC/CA',
      level: 'Principiante a Intermedio',
      duration: '11 Lecciones / Guías · +25 Horas de video HD',
      projectsCount: '11 Clases Prácticas',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
      badgeColor: 'blue',
      priceARS: 50000,
      origARS: 70000,
      priceUSD: 50,
      origUSD: 70,
      driveFolder: 'https://drive.google.com/drive/folders/1rXuc5CcPYwX8eChWINgNXDo7Sl7a0It8?usp=drive_link',
      recursosUrl: 'https://drive.google.com/drive/folders/1rXuc5CcPYwX8eChWINgNXDo7Sl7a0It8?usp=drive_link',
      materialDescargable: 'https://drive.google.com/drive/folders/1rXuc5CcPYwX8eChWINgNXDo7Sl7a0It8?usp=drive_link',
      youtubePreview: 'https://www.youtube.com/embed/8RVmRnfEvhQ',
      features: [
        'Ley de Ohm (V = I * R), analogía hidráulica y mediciones con multímetro (Guía 1)',
        'Leyes de Kirchhoff (LKC para nodos y LKT para mallas en CC) (Guía 2)',
        'Circuitos combinados, divisores de tensión y divisores de corriente (Guía 3)',
        'Resolución integral de circuitos mixtos y mallas complejas (Guía 4)',
        'Teorema de Thévenin: cálculo de Vth, Rth y simulación circuital (Guía 5)',
        'Teorema de Norton: cálculo de In, Rn y equivalencia con Thévenin (Guía 6)',
        'Capacitores y código EIA de 3 dígitos serie/paralelo (Guía 7)',
        'Respuesta transitoria y constante de tiempo en circuitos RC (Guía 8)',
        'Fundamentos de Corriente Alterna: valores RMS, pico a pico y desfase (Guía 9)',
        'Circuitos RLC, reactancia inductiva/capacitiva y resonancia f0 (Guía 10)',
        'Impedancia compleja Z, fasores polares y rectangulares (Guía 11)'
      ],
      syllabus: [
        {
          id: 'c1_l1',
          title: 'Lección 1 (Guía 1 - Ley de Ohm)',
          desc: 'Relación entre voltaje, corriente y resistencia (V = I * R), analogía hidráulica y mediciones prácticas en protoboard con multímetro.',
          duration: '50 min',
          videoId: '8RVmRnfEvhQ',
          videoUrl: 'https://youtu.be/8RVmRnfEvhQ',
          embedUrl: 'https://www.youtube.com/embed/8RVmRnfEvhQ',
          isDemo: true
        },
        {
          id: 'c1_l2',
          title: 'Lección 2 (Guía 2 - Leyes de Kirchhoff)',
          desc: 'Análisis de redes mediante LKC para nodos (conservación de carga) y LKT para mallas (conservación de energía).',
          duration: '55 min',
          videoId: 'kOlhWGeLAgg',
          videoUrl: 'https://youtu.be/kOlhWGeLAgg',
          embedUrl: 'https://www.youtube.com/embed/kOlhWGeLAgg'
        },
        {
          id: 'c1_l3',
          title: 'Lección 3 (Guía 3 - Circuitos Mixtos)',
          desc: 'Simplificación de redes resistivas combinadas mediante divisores de tensión y divisores de corriente.',
          duration: '50 min',
          videoId: 'dnAPrSLchuo',
          videoUrl: 'https://youtu.be/dnAPrSLchuo',
          embedUrl: 'https://www.youtube.com/embed/dnAPrSLchuo'
        },
        {
          id: 'c1_l4',
          title: 'Lección 4 (Guía 4 - Resolución Integral de Circuitos Mixtos)',
          desc: 'Estrategias y métodos para abordar mallas complejas y combinación de herramientas esenciales.',
          duration: '55 min',
          videoId: 'XPuJWjUJjRk',
          videoUrl: 'https://youtu.be/XPuJWjUJjRk',
          embedUrl: 'https://www.youtube.com/embed/XPuJWjUJjRk'
        },
        {
          id: 'c1_l5',
          title: 'Lección 5 (Guía 5 - Teorema de Thévenin)',
          desc: 'Obtención del circuito equivalente de Thévenin, cálculo de Vth, Rth y ejercicios resueltos con simulación.',
          duration: '60 min',
          videoId: '0FEhYOAUWRI',
          videoUrl: 'https://youtu.be/0FEhYOAUWRI',
          embedUrl: 'https://www.youtube.com/embed/0FEhYOAUWRI'
        },
        {
          id: 'c1_l6',
          title: 'Lección 6 (Guía 6 - Teorema de Norton)',
          desc: 'Determinación de la corriente de Norton (In), resistencia equivalente (Rn) y equivalencia con Thévenin.',
          duration: '55 min',
          videoId: '2pkqHBu3ri4',
          videoUrl: 'https://youtu.be/2pkqHBu3ri4',
          embedUrl: 'https://www.youtube.com/embed/2pkqHBu3ri4'
        },
        {
          id: 'c1_l7',
          title: 'Lección 7 (Guía 7 - Capacitores)',
          desc: 'Tipos de capacitores (electrolítico, cerámico, poliéster), lectura con código EIA de 3 dígitos y conexiones serie/paralelo.',
          duration: '45 min',
          videoId: 'hEt5l89S5Zo',
          videoUrl: 'https://youtu.be/hEt5l89S5Zo',
          embedUrl: 'https://www.youtube.com/embed/hEt5l89S5Zo'
        },
        {
          id: 'c1_l8',
          title: 'Lección 8 (Guía 8 - Carga y Descarga RC)',
          desc: 'Comportamiento en el tiempo mediante la constante de tiempo (tau = R * C) y análisis transitorio con simulación.',
          duration: '55 min',
          videoId: '-XlLB1FmQkE',
          videoUrl: 'https://youtu.be/-XlLB1FmQkE',
          embedUrl: 'https://www.youtube.com/embed/-XlLB1FmQkE'
        },
        {
          id: 'c1_l9',
          title: 'Lección 9 (Guía 9 - Fundamentos de Corriente Alterna)',
          desc: 'Parámetros de la onda senoidal (Vrms, Vp, Vpp, frecuencia, periodo, omega) y cálculo de desfase angular.',
          duration: '50 min',
          videoId: 'bf5Qp9lEhlI',
          videoUrl: 'https://youtu.be/bf5Qp9lEhlI',
          embedUrl: 'https://www.youtube.com/embed/bf5Qp9lEhlI'
        },
        {
          id: 'c1_l10',
          title: 'Lección 10 (Guía 10 - Circuitos RLC y Resonancia)',
          desc: 'Reactancia inductiva (XL), reactancia capacitiva (XC), impedancia total (Z) y frecuencia de resonancia (f0).',
          duration: '55 min',
          videoId: 'D-HXRKJBq2U',
          videoUrl: 'https://youtu.be/D-HXRKJBq2U',
          embedUrl: 'https://www.youtube.com/embed/D-HXRKJBq2U'
        },
        {
          id: 'c1_l11',
          title: 'Lección 11 (Guía 11 - Impedancia Compleja)',
          desc: 'Resolución analítica de circuitos RLC utilizando números complejos y fasores (forma polar y rectangular).',
          duration: '60 min',
          videoId: 'M02HkNtz23M',
          videoUrl: 'https://youtu.be/M02HkNtz23M',
          embedUrl: 'https://www.youtube.com/embed/M02HkNtz23M'
        }
      ]
    },
    {
      id: 'curso-2',
      category: 'curso-2',
      title: 'Curso 2: Diodos, Fuentes Lineales Reguladas y Fuentes Conmutadas (DC-DC)',
      subtitle: 'Diseño, dimensionamiento y simulación en LTspice de fuentes de alimentación: diodos, zener, transformadores, rectificación, fuentes simétricas y convertidores DC-DC.',
      tag: '⚡ CURSO 2 · DIODOS & FUENTES LINEALES/CONMUTADAS',
      level: 'Principiante a Intermedio',
      duration: '10 Clases · +20 Horas de video HD',
      projectsCount: '10 Clases Prácticas',
      image: 'https://images.unsplash.com/photo-1583199873815-b58ce30591ea?auto=format&fit=crop&w=800&q=80',
      badgeColor: 'blue',
      priceARS: 50000,
      origARS: 70000,
      priceUSD: 50,
      origUSD: 70,
      driveFolder: 'https://drive.google.com/drive/folders/1g0FJAD-2iifE4DgZ789MvjOsHHfYQMVa?usp=sharing',
      recursosUrl: 'https://drive.google.com/drive/folders/1g0FJAD-2iifE4DgZ789MvjOsHHfYQMVa?usp=sharing',
      materialDescargable: 'https://drive.google.com/drive/folders/1g0FJAD-2iifE4DgZ789MvjOsHHfYQMVa?usp=sharing',
      youtubePreview: 'https://www.youtube.com/embed/oEIF7iT-68o',
      features: [
        'Conexión de diodos en serie y paralelo: cálculo de resistencias limitadoras',
        'Diodo Zener: regulación de voltaje y cálculo de resistencia serie',
        'El Transformador: inductancia mutua, relación de transformación y LTspice',
        'Rectificador de media onda: simulación en Multisim, Tinkercad y LTspice',
        'Cálculo de capacitor de filtro y porcentaje de rizado en fuentes',
        'Diseño y simulación de fuente lineal de 12V con LTspice',
        'Fuente simétrica regulada (+12V/-12V) y reguladores LM7805 / LM317',
        'Reguladores con transistores: análisis serie vs paralelo',
        'Introducción a fuentes conmutadas (switching): convertidores Buck y Boost',
        'Convertidor Buck Step-Down: conmutación, lazo de control y PWM en LTspice'
      ],
      syllabus: [
        {
          id: 1,
          lessonId: 'c2_l1',
          titulo: 'Clase 1: Conexión de Diodos en Serie y Paralelo: Cálculo de Resistencias',
          title: 'Clase 1: Conexión de Diodos en Serie y Paralelo: Cálculo de Resistencias',
          videoUrl: 'https://www.youtube.com/embed/oEIF7iT-68o',
          embedUrl: 'https://www.youtube.com/embed/oEIF7iT-68o',
          videoId: 'oEIF7iT-68o',
          duracion: '12:05',
          duration: '12:05',
          desc: 'Análisis de junturas PN polarizadas en serie y paralelo, cálculo de resistencias limitadoras y distribución de corriente en mallas.'
        },
        {
          id: 2,
          lessonId: 'c2_l2',
          titulo: 'Clase 2: Diodo Zener: Regulación de Voltaje y Cálculo de Resistencia Serie',
          title: 'Clase 2: Diodo Zener: Regulación de Voltaje y Cálculo de Resistencia Serie',
          videoUrl: 'https://www.youtube.com/embed/31MSP4YxTgY',
          embedUrl: 'https://www.youtube.com/embed/31MSP4YxTgY',
          videoId: '31MSP4YxTgY',
          duracion: '22:57',
          duration: '22:57',
          desc: 'Zona de ruptura inversa, estabilización de tensión de salida y cálculo analítico de la resistencia limitadora serie Rs.'
        },
        {
          id: 3,
          lessonId: 'c2_l3',
          titulo: 'Clase 3: El Transformador: Inductancia Mutua, Relación de Transformación y LTspice',
          title: 'Clase 3: El Transformador: Inductancia Mutua, Relación de Transformación y LTspice',
          videoUrl: 'https://www.youtube.com/embed/wkW9UXw378k',
          embedUrl: 'https://www.youtube.com/embed/wkW9UXw378k',
          videoId: 'wkW9UXw378k',
          duracion: '28:10',
          duration: '28:10',
          desc: 'Principios de inducción electromagnética, acoplamiento inductivo mutuo, relación de espiras Vp/Vs y modelado en LTspice.'
        },
        {
          id: 4,
          lessonId: 'c2_l4',
          titulo: 'Clase 4: Rectificador de Media Onda: Simulación en Multisim, Tinkercad y LTspice',
          title: 'Clase 4: Rectificador de Media Onda: Simulación en Multisim, Tinkercad y LTspice',
          videoUrl: 'https://www.youtube.com/embed/2ChV-jZMfEw',
          embedUrl: 'https://www.youtube.com/embed/2ChV-jZMfEw',
          videoId: '2ChV-jZMfEw',
          duracion: '12:04',
          duration: '12:04',
          desc: 'Conversión AC a CC con diodo rectificador, análisis de formas de onda en osciloscopio y comparación en simuladores.'
        },
        {
          id: 5,
          lessonId: 'c2_l5',
          titulo: 'Clase 5: Cálculo de Capacitor de Filtro y Porcentaje de Rizado en Fuentes',
          title: 'Clase 5: Cálculo de Capacitor de Filtro y Porcentaje de Rizado en Fuentes',
          videoUrl: 'https://www.youtube.com/embed/qDkpvQyHIJY',
          embedUrl: 'https://www.youtube.com/embed/qDkpvQyHIJY',
          videoId: 'qDkpvQyHIJY',
          duracion: '22:28',
          duration: '22:28',
          desc: 'Filtrado capacitivo, régimen de descarga, cálculo analítico del capacitor de filtro C y determinación del factor de rizado (ripple).'
        },
        {
          id: 6,
          lessonId: 'c2_l6',
          titulo: 'Clase 6: Diseño y Simulación de Fuente Lineal de 12V con LTspice',
          title: 'Clase 6: Diseño y Simulación de Fuente Lineal de 12V con LTspice',
          videoUrl: 'https://www.youtube.com/embed/Pyk8Jvn9r18',
          embedUrl: 'https://www.youtube.com/embed/Pyk8Jvn9r18',
          videoId: 'Pyk8Jvn9r18',
          duracion: '36:35',
          duration: '36:35',
          desc: 'Flujo completo de diseño: transformación, puente rectificador de Graetz, filtrado capacitivo y estabilización a 12V.'
        },
        {
          id: 7,
          lessonId: 'c2_l7',
          titulo: 'Clase 7: Fuente Simétrica Regulada (+12V/-12V) y Reguladores LM7805 / LM317',
          title: 'Clase 7: Fuente Simétrica Regulada (+12V/-12V) y Reguladores LM7805 / LM317',
          videoUrl: 'https://www.youtube.com/embed/OT8gnotv_vg',
          embedUrl: 'https://www.youtube.com/embed/OT8gnotv_vg',
          videoId: 'OT8gnotv_vg',
          duracion: '20:09',
          duration: '20:09',
          desc: 'Diseño de fuente dual partida (+12V, 0V, -12V), integración de reguladores lineales integrados serie 78XX y regulador ajustable LM317.'
        },
        {
          id: 8,
          lessonId: 'c2_l8',
          titulo: 'Clase 8: Reguladores con Transistores: Análisis Serie vs Paralelo',
          title: 'Clase 8: Reguladores con Transistores: Análisis Serie vs Paralelo',
          videoUrl: 'https://www.youtube.com/embed/QoignuPSQK0',
          embedUrl: 'https://www.youtube.com/embed/QoignuPSQK0',
          videoId: 'QoignuPSQK0',
          duracion: '13:43',
          duration: '13:43',
          desc: 'Regulación de tensión con transistor de paso BJT en configuración seguidor de emisor (serie) y regulación en derivación (paralelo).'
        },
        {
          id: 9,
          lessonId: 'c2_l9',
          titulo: 'Clase 9: Introducción a Fuentes Conmutadas (Switching): Convertidores Buck y Boost',
          title: 'Clase 9: Introducción a Fuentes Conmutadas (Switching): Convertidores Buck y Boost',
          videoUrl: 'https://www.youtube.com/embed/J8ZDi02wqnA',
          embedUrl: 'https://www.youtube.com/embed/J8ZDi02wqnA',
          videoId: 'J8ZDi02wqnA',
          duracion: '22:31',
          duration: '22:31',
          desc: 'Principios de conversión conmutada de alta eficiencia, conmutación por PWM y topologías Buck (reductora) y Boost (elevadora).'
        },
        {
          id: 10,
          lessonId: 'c2_l10',
          titulo: 'Clase 10: Convertidor Buck Step-Down: Conmutación, Lazo de Control y PWM en LTspice',
          title: 'Clase 10: Convertidor Buck Step-Down: Conmutación, Lazo de Control y PWM en LTspice',
          videoUrl: 'https://www.youtube.com/embed/F8wp4wQSp-g',
          embedUrl: 'https://www.youtube.com/embed/F8wp4wQSp-g',
          videoId: 'F8wp4wQSp-g',
          duracion: '18:37',
          duration: '18:37',
          desc: 'Análisis del convertidor reductor Buck en modo continuo (CCM), conmutación con MOSFET, lazo de realimentación y simulación dinámica en LTspice.'
        }
      ]
    },
    {
      id: 'curso-3',
      category: 'curso-3',
      title: 'Curso 3: Amplificación con Transistores y Electrónica de Potencia',
      subtitle: 'Estructuras BJT NPN/PNP, polarización en CC, excursión simétrica, pequeña señal, respuesta en frecuencia, JFET/MOSFET y fuentes conmutadas.',
      tag: '⚡ CURSO 3 · POTENCIA & BJT/FET',
      level: 'Intermedio a Avanzado',
      duration: '12 Clases · +28 Horas de video HD',
      projectsCount: '12 Clases Prácticas',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      badgeColor: 'cyan',
      priceARS: 50000,
      origARS: 70000,
      priceUSD: 50,
      origUSD: 70,
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
      id: 'curso-4',
      category: 'curso-4',
      title: 'Curso 4: Amplificadores Operacionales y Filtros Analógicos',
      subtitle: 'Etapas diferenciales, Op-Amps lineales y no lineales, Schmitt Triggers, temporizador 555, instrumentación, conversores ADC/DAC y filtros activos de orden superior.',
      tag: '🎛️ CURSO 4 · OP-AMPS & FILTROS',
      level: 'Intermedio a Avanzado',
      duration: '19 Clases · +40 Horas de video HD',
      projectsCount: '19 Clases Prácticas',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      badgeColor: 'emerald',
      priceARS: 50000,
      origARS: 70000,
      priceUSD: 50,
      origUSD: 70,
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
      id: 'curso-5',
      category: 'curso-5',
      title: 'Curso 5: Microcontroladores, Sensores y Adquisición de Datos',
      subtitle: 'Programación estructurada en C/C++, lógica no bloqueante con millis, multiplexación de 7 segmentos, lecturas analógicas ADC, termostatos y telemetría en tiempo real.',
      tag: '🤖 CURSO 5 · FIRMWARE & SENSORES',
      level: 'Todos los niveles',
      duration: '10 Clases · +25 Horas de video HD',
      projectsCount: '10 Clases Prácticas',
      image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
      badgeColor: 'purple',
      priceARS: 50000,
      origARS: 70000,
      priceUSD: 50,
      origUSD: 70,
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

  // Descuentos automáticos por volumen desactivados (cálculo lineal unitario: $50.000 ARS / 50 USD)

  // Cálculo en tiempo real de subtotales, descuentos y total a transferir
  function calculateCartTotals(currency = state.currency) {
    const cartCourses = [...new Set(state.cart)].map(id => COURSES.find(c => c.id === id)).filter(Boolean);
    const count = cartCourses.length;

    if (count === 0) {
      return {
        count: 0,
        subtotal: 0,
        volumeDiscount: 0,
        discountPct: 0,
        badge: '',
        saving: 0,
        couponDiscount: 0,
        total: 0,
        currency
      };
    }

    // Cálculo puramente lineal sin descuentos automáticos por volumen
    const unitPrice = currency === 'ARS' ? 50000 : 50;
    const subtotal = count * unitPrice;
    const volumeDiscount = 0;
    const discountPct = 0;
    const badge = '';
    const saving = 0;

    let couponDiscount = 0;
    let finalTotal = subtotal;
    if (state.appliedCoupon) {
      couponDiscount = Math.round(subtotal * CONFIG.couponDiscount);
      finalTotal = subtotal - couponDiscount;
    }

    return {
      count,
      subtotal,
      volumeDiscount,
      discountPct,
      badge,
      saving,
      couponDiscount,
      total: finalTotal,
      currency
    };
  }

  // Inicializar UI
  function initApp() {
    // Mantener en carrito únicamente Curso 1 si hubiera otros
    state.cart = (state.cart || []).filter(id => id === 'curso-1');
    saveState();
    renderCourses();
    updateCurrencyButtons();
    updateCartUI();
    setupEventListeners();
    setupFAQAccordion();
    checkPendingWaitlistOnStartup();
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

      const isAvailable = (course.id === 'curso-1');
      const isComingSoon = !isAvailable;
      const borderClass = isComingSoon
        ? 'border-2 border-amber-500/40 hover:border-amber-400 shadow-lg shadow-amber-500/5'
        : 'border-2 border-cyan-500/70 hover:border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.2)]';

      return `
        <article class="group relative flex flex-col justify-between bg-slate-900/90 rounded-2xl overflow-hidden transition-all duration-300 ${borderClass}">
          ${isComingSoon ? `
            <!-- Banda / Ribbon superior amarilla PRÓXIMAMENTE -->
            <div class="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest py-1.5 px-4 text-center shadow-md flex items-center justify-center gap-2">
              <span>⏳ PRÓXIMAMENTE</span>
            </div>
          ` : `
            <div class="bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider py-1 px-4 text-center">
              ✓ INSCRIPCIÓN INMEDIATA HABILITADA
            </div>
          `}

          <div>
            <!-- Course Image Header -->
            <div class="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
              <img src="${course.image}" alt="${course.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${isComingSoon ? 'opacity-70 grayscale-[25%]' : 'opacity-90 group-hover:opacity-100'}">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30"></div>

              <!-- Badge Tag -->
              <div class="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-700/60 px-3 py-1 rounded-full text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                <span>${course.tag}</span>
              </div>

              <!-- Insignia destacada amarilla en Cursos 2 al 5 / Descuento en Curso 1 -->
              ${isComingSoon ? `
                <div class="absolute top-3 right-3 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-lg shadow-lg border border-amber-300 tracking-wider flex items-center gap-1 z-10 animate-pulse">
                  <span>PRÓXIMAMENTE</span>
                </div>
              ` : `
                <div class="absolute top-3 right-3 bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                  <span>ACTIVO</span>
                </div>
              `}

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
              ${isComingSoon ? `
                <span class="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  Próximamente
                </span>
              ` : `
                <span class="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Acceso Inmediato
                </span>
              `}
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button onclick="window.ElectroLab.openSyllabus('${course.id}')" class="px-3 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/60 transition-all flex items-center justify-center gap-1.5">
                <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <span>Ver Temario</span>
              </button>

              ${isAvailable ? `
                <button onclick="window.ElectroLab.toggleCart('${course.id}')" class="px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
                  inCart
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black'
                }">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    ${inCart ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>' : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>'}
                  </svg>
                  <span>${inCart ? 'En el Carrito' : 'Inscribirme'}</span>
                </button>
              ` : (window.ElectroLabAuth && window.ElectroLabAuth.isInWaitlist(course.id)) ? `
                <button disabled class="px-2 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 cursor-default flex items-center justify-center gap-1.5 opacity-90 shadow-sm" title="Ya estás registrado en la lista de espera de este curso">
                  <span class="text-emerald-400 text-xs">✓</span>
                  <span>Ya estás en la lista de espera</span>
                </button>
              ` : `
                <button onclick="window.ElectroLab.joinWaitlist('${course.id}')" class="px-2 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/50 hover:border-amber-400 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer" title="Recibir aviso por correo al lanzarse este curso">
                  <span class="text-amber-400 text-xs">🔔</span>
                  <span>Avisarme cuando esté disponible</span>
                </button>
              `}
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
    if (courseId !== 'curso-1') {
      showToast('Este curso estará disponible próximamente.', 'info');
      return;
    }
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
    const cartVolumeDiscountRow = document.getElementById('cart-volume-discount-row');
    const cartVolumeBadge = document.getElementById('cart-volume-badge');
    const cartVolumeDiscountEl = document.getElementById('cart-volume-discount');
    const cartSavingHintRow = document.getElementById('cart-saving-hint-row');
    const cartSavingAmountEl = document.getElementById('cart-saving-amount');
    const cartVolumeTip = document.getElementById('cart-volume-tip');
    const cartVolumeTipText = document.getElementById('cart-volume-tip-text');
    const cartDiscountEl = document.getElementById('cart-discount');
    const cartDiscountRow = document.getElementById('cart-discount-row');
    const cartTotalEl = document.getElementById('cart-total');
    const emptyState = document.getElementById('cart-empty-state');
    const filledState = document.getElementById('cart-filled-state');

    const totals = calculateCartTotals();
    const totalCount = totals.count;

    if (badge) badge.textContent = totalCount;
    if (cartCountDrawer) cartCountDrawer.textContent = `(${totalCount})`;

    if (totalCount === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (filledState) filledState.classList.add('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (filledState) filledState.classList.remove('hidden');

    const cartCourses = [...new Set(state.cart)].map(id => COURSES.find(c => c.id === id)).filter(Boolean);

    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = cartCourses.map(course => {
        const price = getCoursePrice(course);

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

    // Subtotal
    if (cartSubtotalEl) {
      cartSubtotalEl.textContent = formatMoney(totals.subtotal);
    }

    // Descuento por Volumen (Desactivado)
    if (cartVolumeDiscountRow) cartVolumeDiscountRow.classList.add('hidden');
    if (cartSavingHintRow) cartSavingHintRow.classList.add('hidden');
    if (cartVolumeTip) cartVolumeTip.classList.add('hidden');

    // Descuento adicional por Cupón (si aplica)
    if (totals.couponDiscount > 0) {
      if (cartDiscountRow) cartDiscountRow.classList.remove('hidden');
      if (cartDiscountEl) cartDiscountEl.textContent = `- ${formatMoney(totals.couponDiscount)}`;
    } else {
      if (cartDiscountRow) cartDiscountRow.classList.add('hidden');
    }

    // Total Final a Transferir
    if (cartTotalEl) {
      cartTotalEl.textContent = formatMoney(totals.total);
    }
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
        <div class="space-y-3 mb-8">
          ${(course.id === 'curso-1' || !course.syllabus[0]?.lessons) ? `
            ${course.syllabus.map((lesson, idx) => {
              const thumbUrl = lesson.videoId ? `https://img.youtube.com/vi/${lesson.videoId}/mqdefault.jpg` : course.image;
              const lessonTitle = lesson.title || lesson.titulo || `Clase ${idx + 1}`;
              const lessonDuration = lesson.duration || lesson.duracion || '';
              const lessonDesc = lesson.desc || '';
              const lessonId = lesson.id || lesson.lessonId || '';
              return `
              <div class="border border-slate-800 rounded-2xl bg-slate-950/40 overflow-hidden group">
                <button onclick="window.ElectroLab.toggleModuleAccordion(this)" class="w-full text-left p-4 sm:p-5 flex items-center justify-between font-heading font-bold text-sm sm:text-base text-slate-200 hover:text-cyan-400 transition-colors">
                  <span class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                      ${idx + 1}
                    </span>
                    <span class="font-bold text-white text-sm sm:text-base">${lessonTitle}</span>
                    ${lesson.isDemo ? '<span class="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 ml-1">Clase Demo</span>' : ''}
                  </span>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="text-xs font-mono text-slate-500">${lessonDuration}</span>
                    <svg class="w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </button>
                <div class="module-body px-4 sm:px-6 pb-4 pt-3 border-t border-slate-900 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div class="flex items-start gap-3 sm:gap-4 flex-1">
                    <!-- Miniatura ilustrativa estática -->
                    <div class="relative w-24 sm:w-28 aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 shadow-inner group-hover:border-cyan-500/40">
                      <img src="${thumbUrl}" alt="${lessonTitle}" class="w-full h-full object-cover">
                      <div class="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                        <span class="w-6 h-6 rounded-lg bg-slate-900/90 border border-slate-700/80 text-amber-400 flex items-center justify-center text-[11px] shadow">
                          🔒
                        </span>
                      </div>
                    </div>
                    <!-- Título y síntesis teórica -->
                    <div class="space-y-1 flex-1">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-xs font-bold text-white">${lessonTitle}</span>
                        ${lessonDuration ? `<span class="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">${lessonDuration}</span>` : ''}
                      </div>
                      ${lessonDesc ? `<p class="text-xs text-slate-300 leading-relaxed">${lessonDesc}</p>` : ''}
                    </div>
                  </div>

                  <!-- Botón de acceso protegido -->
                  <button onclick="window.ElectroLab.handleLessonAccess('${course.id}', '${lessonId}')" class="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold text-cyan-300 hover:text-white bg-slate-900 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-400/60 px-3.5 py-2 rounded-xl transition-all shadow">
                    <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    <span>Acceder a esta clase</span>
                  </button>
                </div>
              </div>
            `;}).join('')}
          ` : `
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
                <div class="module-body px-4 sm:px-6 pb-4 pt-2 space-y-3 border-t border-slate-900">
                  ${mod.lessons.map(lesson => `
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs py-3 border-b border-slate-900/60 last:border-0 gap-3">
                      <div class="flex items-start gap-3 flex-1">
                        <!-- Miniatura ilustrativa -->
                        <div class="relative w-20 sm:w-24 aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                          <img src="${course.image}" alt="${lesson.title}" class="w-full h-full object-cover opacity-80">
                          <div class="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                            <span class="w-5 h-5 rounded-md bg-slate-900/90 border border-slate-700 text-amber-400 flex items-center justify-center text-[10px]">🔒</span>
                          </div>
                        </div>
                        <div>
                          <div class="flex items-center gap-2 flex-wrap">
                            <span class="font-bold text-white text-xs">${lesson.title}</span>
                            <span class="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">${lesson.duration}</span>
                          </div>
                          ${lesson.desc ? `<p class="text-[11px] text-slate-300 mt-1 leading-relaxed">${lesson.desc}</p>` : ''}
                        </div>
                      </div>
                      <button onclick="window.ElectroLab.handleLessonAccess('${course.id}', '${lesson.id || ''}')" class="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-cyan-300 hover:text-white bg-slate-900 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-400/60 px-3 py-1.5 rounded-lg transition-all">
                        <svg class="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        <span>Acceder a esta clase</span>
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          `}
        </div>

        <!-- Call to Action Footer -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
          <div>
            <span class="text-xs text-slate-400 block">${course.id === 'curso-1' ? 'Acceso Inmediato y de por vida' : 'Inversión Oficial'}</span>
            <div class="text-2xl font-black text-white">
              ${formatMoney(getCoursePrice(course))}
            </div>
          </div>
          <div class="flex items-center gap-3 w-full sm:w-auto">
            ${course.id === 'curso-1' ? `
              <button onclick="window.ElectroLab.toggleCart('${course.id}'); window.ElectroLab.closeSyllabus();" class="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <span>Inscribirme en este Curso</span>
              </button>
            ` : (window.ElectroLabAuth && window.ElectroLabAuth.isInWaitlist(course.id)) ? `
              <button disabled class="w-full sm:w-auto bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 cursor-default">
                <span>✓</span>
                <span>Ya estás en la lista de espera</span>
              </button>
            ` : `
              <button onclick="window.ElectroLab.joinWaitlist('${course.id}');" class="w-full sm:w-auto bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/50 hover:border-amber-400 font-bold px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer">
                <span>🔔</span>
                <span>Avisarme cuando esté disponible</span>
              </button>
            `}
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

  // Control de Acceso a Clases y Modal Informativo
  function handleLessonAccess(courseId, lessonId) {
    const user = window.ElectroLabAuth ? window.ElectroLabAuth.getCurrentUser() : null;
    const hasAccess = window.ElectroLabAuth && window.ElectroLabAuth.hasCourseAccess(courseId);

    if (user && hasAccess) {
      let targetUrl = `./aula.html?course=${encodeURIComponent(courseId)}`;
      if (lessonId) {
        targetUrl += `&lesson=${encodeURIComponent(lessonId)}`;
      }
      window.location.href = targetUrl;
    } else {
      openAccessNoticeModal(courseId, lessonId);
    }
  }

  function openAccessNoticeModal(courseId, lessonId) {
    const course = COURSES.find(c => c.id === courseId) || COURSES[0];
    const user = window.ElectroLabAuth ? window.ElectroLabAuth.getCurrentUser() : null;
    const price = getCoursePrice(course);

    const modal = document.getElementById('access-notice-modal');
    const body = document.getElementById('access-notice-modal-body');
    if (!modal || !body) return;

    body.innerHTML = `
      <div class="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-slate-100 text-center">
        <!-- Close Button -->
        <button onclick="window.ElectroLab.closeAccessNoticeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-amber-500/10">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        </div>

        <span class="inline-block text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/60 mb-3">
          ACCESO EXCLUSIVO PARA ALUMNOS
        </span>

        <h3 class="text-xl sm:text-2xl font-heading font-extrabold text-white mb-2">
          Inicia sesión o adquiere el curso para acceder a esta clase
        </h3>

        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          Los videos en alta definición, esquemáticos en PDF, códigos de Arduino y archivos .ASC de simulación LTspice están disponibles exclusivamente dentro del <strong>Aula Virtual</strong> para estudiantes habilitados.
        </p>

        <div class="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 text-left mb-6 space-y-2">
          <div class="text-[11px] font-mono font-bold text-cyan-400 uppercase">${course.tag}</div>
          <div class="font-bold text-sm text-white">${course.title}</div>
          <div class="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
            <span class="text-slate-400">Inversión única de acceso de por vida:</span>
            <span class="text-base font-black text-cyan-300">${formatMoney(price)}</span>
          </div>
        </div>

        <div class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href="./login.html" class="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all border border-slate-700 flex items-center justify-center gap-2">
              <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
              <span>${user ? 'Cambiar de Cuenta' : 'Iniciar Sesión'}</span>
            </a>

            ${course.id === 'curso-1' ? `
              <button onclick="window.ElectroLab.enrollAndCheckout('${course.id}')" class="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-heading font-extrabold py-3 px-4 rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <span>Adquirir Curso</span>
              </button>
            ` : (window.ElectroLabAuth && window.ElectroLabAuth.isInWaitlist(course.id)) ? `
              <button disabled class="w-full bg-emerald-950/70 text-emerald-300 font-bold py-3 px-4 rounded-xl text-xs border border-emerald-500/40 cursor-default flex items-center justify-center gap-2">
                <span>✓</span>
                <span>Ya estás en la lista de espera</span>
              </button>
            ` : `
              <button onclick="window.ElectroLab.closeAccessNoticeModal(); window.ElectroLab.joinWaitlist('${course.id}')" class="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/50 hover:border-amber-400 font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span>🔔</span>
                <span>Avisarme cuando esté disponible</span>
              </button>
            `}
          </div>

          <div class="text-[11px] text-slate-400 pt-2">
            ¿Ya realizaste el pago por transferencia o Mercado Pago?
            <a href="https://wa.me/5491123065347?text=Hola!%20Ya%20realic%C3%A9%20el%20pago%20para%20el%20curso%20${encodeURIComponent(course.title)}.%20Quiero%20habilitar%20mi%20cuenta." target="_blank" class="text-emerald-400 hover:underline font-bold block sm:inline ml-1">
              Enviar comprobante por WhatsApp (+54 9 11 2306-5347)
            </a>
          </div>
        </div>

      </div>
    `;

    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closeAccessNoticeModal() {
    const modal = document.getElementById('access-notice-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  function enrollAndCheckout(courseId) {
    closeAccessNoticeModal();
    closeSyllabus();
    if (courseId !== 'curso-1') {
      showToast('Este curso estará disponible próximamente.', 'info');
      return;
    }
    if (!state.cart.includes(courseId)) {
      state.cart.push(courseId);
      saveState();
      updateCartUI();
    }
    openCartDrawer();
  }

  // Compatibilidad hacia atrás (redirección a control de acceso)
  function openDemoVideo() {
    handleLessonAccess('curso-1', 'c1_l1');
  }

  function closeDemoVideo() {
    closeAccessNoticeModal();
  }

  // Pasarelas de Pago
  function checkoutWhatsApp() {
    if (state.cart.length === 0) {
      showToast('Agrega al menos un curso al carrito primero');
      return;
    }

    const totals = calculateCartTotals();
    const cartCourses = [...new Set(state.cart)].map(id => COURSES.find(c => c.id === id)).filter(Boolean);
    let itemsList = cartCourses.map(c => `• ${c.title}`).join('%0A');

    let msg = `Hola ElectroLab Educativa! Quiero comprar los siguientes cursos en mi moneda (${state.currency}):%0A%0A${itemsList}%0A%0A`;
    msg += `Subtotal (${totals.count} ${totals.count === 1 ? 'curso' : 'cursos'}): ${formatMoney(totals.subtotal, state.currency)}%0A`;
    if (totals.volumeDiscount > 0) {
      msg += `Descuento por volumen (${totals.badge}): -${formatMoney(totals.volumeDiscount, state.currency)}%0A`;
    }
    if (totals.couponDiscount > 0) {
      msg += `Cupón ${state.appliedCoupon}: -${formatMoney(totals.couponDiscount, state.currency)}%0A`;
    }
    msg += `*Total Final a abonar: ${formatMoney(totals.total, state.currency)}*%0A%0A¿Me confirman los datos para abonar (Transferencia bancaria / Mercado Pago / PayPal) y darme acceso? Gracias!`;

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
    const curr = (methodName === 'PayPal') ? 'USD' : 'ARS';
    const totals = calculateCartTotals(curr);
    const cartCourses = [...new Set(state.cart)].map(id => COURSES.find(c => c.id === id)).filter(Boolean);

    let itemsList = cartCourses.map(c => `• ${c.title}`).join('%0A');

    let msg = `Hola ElectroLab Educativa! Acabo de realizar el pago mediante *${methodName}* por un total de *${formatMoney(totals.total, curr)}*:%0A%0ACursos:%0A${itemsList}%0A%0A`;
    if (totals.volumeDiscount > 0) {
      msg += `(Incluye Descuento por Volumen: ${totals.badge})%0A`;
    }
    msg += `Adjunto el comprobante de la operación para que puedan habilitar mi acceso al aula virtual. Muchas gracias!`;

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`;
    window.open(url, '_blank');
  }

  function openPaymentModal(method) {
    const modal = document.getElementById('payment-modal');
    const container = document.getElementById('payment-modal-body');
    if (!modal || !container) return;

    const curr = (method === 'paypal') ? 'USD' : 'ARS';
    const totals = calculateCartTotals(curr);

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

            <!-- Total a transferir con desglose de descuento -->
            <div class="bg-black/60 border border-slate-800 p-3.5 rounded-xl space-y-2">
              ${totals.volumeDiscount > 0 ? `
                <div class="flex justify-between items-center text-xs text-slate-400">
                  <span>Subtotal (${totals.count} ${totals.count === 1 ? 'curso' : 'cursos'}):</span>
                  <span class="line-through text-slate-500 font-mono">${formatMoney(totals.subtotal, 'ARS')}</span>
                </div>
                <div class="flex justify-between items-center text-xs text-emerald-400 font-semibold">
                  <span class="flex items-center gap-1.5">
                    <span>Descuento por volumen:</span>
                    <span class="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-1.5 py-0.5 rounded border border-emerald-500/30">${totals.badge}</span>
                  </span>
                  <span class="font-mono">- ${formatMoney(totals.volumeDiscount, 'ARS')}</span>
                </div>
              ` : ''}
              ${totals.couponDiscount > 0 ? `
                <div class="flex justify-between items-center text-xs text-emerald-400 font-semibold">
                  <span>Cupón ${state.appliedCoupon} (10%):</span>
                  <span class="font-mono">- ${formatMoney(totals.couponDiscount, 'ARS')}</span>
                </div>
              ` : ''}
              <div class="flex items-center justify-between pt-1.5 border-t border-slate-800">
                <span class="text-xs text-slate-200 font-sans font-bold">Total Final a transferir:</span>
                <span class="text-xl sm:text-2xl font-bold font-mono text-emerald-400">${formatMoney(totals.total, 'ARS')}</span>
              </div>
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

          <p class="text-xs text-slate-400 text-center">Una vez realizada la transferencia, envía el comprobante por WhatsApp al <strong class="text-emerald-400">+54 9 11 2306-5347</strong> para darte de alta al instante:</p>

          <a href="${whatsappComprobanteUrl}" target="_blank" rel="noopener noreferrer" onclick="window.ElectroLab.closePaymentModal()" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 text-xs sm:text-sm">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            <span>Enviar Comprobante por WhatsApp (+54 9 11 2306-5347)</span>
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

            <!-- Total a transferir con desglose de descuento -->
            <div class="bg-black/60 border border-slate-800 p-3.5 rounded-xl space-y-2">
              ${totals.volumeDiscount > 0 ? `
                <div class="flex justify-between items-center text-xs text-slate-400">
                  <span>Subtotal (${totals.count} ${totals.count === 1 ? 'curso' : 'cursos'}):</span>
                  <span class="line-through text-slate-500 font-mono">${formatMoney(totals.subtotal, 'ARS')}</span>
                </div>
                <div class="flex justify-between items-center text-xs text-emerald-400 font-semibold">
                  <span class="flex items-center gap-1.5">
                    <span>Descuento por volumen:</span>
                    <span class="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-1.5 py-0.5 rounded border border-emerald-500/30">${totals.badge}</span>
                  </span>
                  <span class="font-mono">- ${formatMoney(totals.volumeDiscount, 'ARS')}</span>
                </div>
              ` : ''}
              ${totals.couponDiscount > 0 ? `
                <div class="flex justify-between items-center text-xs text-emerald-400 font-semibold">
                  <span>Cupón ${state.appliedCoupon} (10%):</span>
                  <span class="font-mono">- ${formatMoney(totals.couponDiscount, 'ARS')}</span>
                </div>
              ` : ''}
              <div class="flex items-center justify-between pt-1.5 border-t border-slate-800">
                <span class="text-xs text-slate-200 font-sans font-bold">Total Final a transferir:</span>
                <span class="text-xl sm:text-2xl font-bold font-mono text-sky-400">${formatMoney(totals.total, 'ARS')}</span>
              </div>
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

          <p class="text-xs text-slate-400 text-center">Transfiere dinero en cuenta desde tu app de Mercado Pago o cualquier banco con el CVU o Alias. Luego envía tu comprobante por WhatsApp al <strong class="text-emerald-400">+54 9 11 2306-5347</strong>:</p>

          <a href="${whatsappComprobanteUrl}" target="_blank" rel="noopener noreferrer" onclick="window.ElectroLab.closePaymentModal()" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 text-xs sm:text-sm">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            <span>Enviar Comprobante por WhatsApp (+54 9 11 2306-5347)</span>
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

            <!-- Total en USD con desglose de descuento -->
            <div class="bg-black/60 border border-slate-800 p-3.5 rounded-xl space-y-2">
              ${totals.volumeDiscount > 0 ? `
                <div class="flex justify-between items-center text-xs text-slate-400">
                  <span>Subtotal (${totals.count} ${totals.count === 1 ? 'curso' : 'cursos'}):</span>
                  <span class="line-through text-slate-500 font-mono">${formatMoney(totals.subtotal, 'USD')}</span>
                </div>
                <div class="flex justify-between items-center text-xs text-emerald-400 font-semibold">
                  <span class="flex items-center gap-1.5">
                    <span>Descuento por volumen:</span>
                    <span class="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-1.5 py-0.5 rounded border border-emerald-500/30">${totals.badge}</span>
                  </span>
                  <span class="font-mono">- ${formatMoney(totals.volumeDiscount, 'USD')}</span>
                </div>
              ` : ''}
              ${totals.couponDiscount > 0 ? `
                <div class="flex justify-between items-center text-xs text-emerald-400 font-semibold">
                  <span>Cupón ${state.appliedCoupon} (10%):</span>
                  <span class="font-mono">- ${formatMoney(totals.couponDiscount, 'USD')}</span>
                </div>
              ` : ''}
              <div class="flex items-center justify-between pt-1.5 border-t border-slate-800">
                <span class="text-xs text-slate-200 font-sans font-bold">Total Final en USD:</span>
                <span class="text-xl sm:text-2xl font-bold font-mono text-amber-400">${formatMoney(totals.total, 'USD')}</span>
              </div>
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

          <p class="text-xs text-slate-400 text-center">Una vez realizado el envío por PayPal, envía tu comprobante por WhatsApp al <strong class="text-emerald-400">+54 9 11 2306-5347</strong> para darte de alta al instante:</p>

          <a href="${whatsappComprobanteUrl}" target="_blank" rel="noopener noreferrer" onclick="window.ElectroLab.closePaymentModal()" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 text-xs sm:text-sm">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            <span>Enviar Comprobante por WhatsApp (+54 9 11 2306-5347)</span>
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
        closeAccessNoticeModal();
        closePaymentModal();
        closeWaitlistAuthModal();
      }
    });
  }

  // ================= LISTA DE ESPERA (WAITLIST) =================
  async function joinWaitlist(courseId, isAutoAfterLogin = false) {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;

    const user = window.ElectroLabAuth ? window.ElectroLabAuth.getCurrentUser() : null;

    if (!user) {
      // Requerimiento: guardar en localStorage el ID del curso y abrir modal de auth
      localStorage.setItem('electrolab_pending_waitlist', courseId);
      openWaitlistAuthModal(course);
      return;
    }

    if (window.ElectroLabAuth.isInWaitlist(courseId)) {
      if (!isAutoAfterLogin) {
        showToast('Ya estás en la lista de espera de este curso.', 'info');
      }
      return;
    }

    try {
      await window.ElectroLabAuth.addToWaitlist(courseId, course.title);
      localStorage.removeItem('electrolab_pending_waitlist');
      showToast('¡Listo! Te avisaremos por correo apenas el curso esté disponible para su lanzamiento.', 'success');
      renderCourses();

      // Refrescar modal de temario si estuviese abierto
      const syllabusModal = document.getElementById('syllabus-modal');
      if (syllabusModal && !syllabusModal.classList.contains('hidden')) {
        openSyllabus(courseId);
      }
      closeAccessNoticeModal();
    } catch (err) {
      showToast(err.message || 'No se pudo registrar en la lista de espera', 'error');
    }
  }

  function checkPendingWaitlistOnStartup() {
    const pending = localStorage.getItem('electrolab_pending_waitlist');
    const user = window.ElectroLabAuth ? window.ElectroLabAuth.getCurrentUser() : null;
    if (pending && user) {
      const course = COURSES.find(c => c.id === pending);
      if (course) {
        joinWaitlist(pending, true);
      }
    }
  }

  function openWaitlistAuthModal(course) {
    const modal = document.getElementById('waitlist-auth-modal');
    const content = document.getElementById('waitlist-auth-modal-content');
    if (!modal || !content) {
      // Fallback si no existiera el modal en el DOM
      window.location.href = `./login.html?waitlist=${encodeURIComponent(course.id)}`;
      return;
    }

    content.innerHTML = `
      <div class="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl glass-panel text-slate-100">
        <!-- Close Button -->
        <button onclick="window.ElectroLab.closeWaitlistAuthModal()" class="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <!-- Icon & Heading -->
        <div class="text-center mb-5 space-y-1">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <span class="text-xl">🔔</span>
          </div>
          <span class="inline-block text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/60">
            LISTA DE ESPERA OFICIAL
          </span>
          <h3 class="text-lg sm:text-xl font-heading font-extrabold text-white mt-2">${course.title}</h3>
        </div>

        <!-- Mensaje claro obligatorio del requerimiento -->
        <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center font-medium leading-relaxed mb-5 shadow-sm">
          Inicia sesión o regístrate gratis para anotarte en la lista de espera de este curso.
        </div>

        <!-- Tabs Toggle (Ingresar / Registrarse) -->
        <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-5 text-xs font-semibold">
          <button id="wl-tab-login" onclick="window.ElectroLab.switchWaitlistTab('login')" type="button" class="flex-1 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold transition-all shadow-sm">
            Iniciar Sesión
          </button>
          <button id="wl-tab-register" onclick="window.ElectroLab.switchWaitlistTab('register')" type="button" class="flex-1 py-2 rounded-lg text-slate-400 hover:text-white transition-all">
            Registrarse Gratis
          </button>
        </div>

        <!-- Error / Success Alert -->
        <div id="wl-auth-alert" class="hidden mb-4 p-3 rounded-xl text-xs font-medium border"></div>

        <!-- Form: Iniciar Sesión -->
        <form id="wl-form-login" onsubmit="window.ElectroLab.submitWaitlistLogin(event, '${course.id}')" class="space-y-4">
          <div>
            <label class="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">Correo Electrónico</label>
            <input id="wl-login-email" type="email" required placeholder="tu@email.com" class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors">
          </div>
          <div>
            <label class="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">Contraseña</label>
            <input id="wl-login-password" type="password" required placeholder="••••••••" class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors">
          </div>
          <button type="submit" class="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-heading font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs">
            <span>Iniciar Sesión y Anotarme</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>

        <!-- Form: Registrarse Gratis (Sin cobro) -->
        <form id="wl-form-register" onsubmit="window.ElectroLab.submitWaitlistRegister(event, '${course.id}')" class="space-y-3.5 hidden">
          <div>
            <label class="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">Nombre Completo</label>
            <input id="wl-reg-name" type="text" required placeholder="Tu Nombre y Apellido" class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors">
          </div>
          <div>
            <label class="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">Correo Electrónico</label>
            <input id="wl-reg-email" type="email" required placeholder="tu@email.com" class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors">
          </div>
          <div>
            <label class="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">Crear Contraseña</label>
            <input id="wl-reg-password" type="password" required minlength="4" placeholder="Mínimo 4 caracteres" class="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-white placeholder-slate-600 transition-colors">
          </div>
          <button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-heading font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs">
            <span>Crear Cuenta Gratis y Anotarme</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>

        <div class="mt-4 pt-3 border-t border-slate-800 text-center text-[11px] text-slate-400">
          ¿Prefieres ingresar desde la pantalla de login?
          <a href="./login.html" class="text-cyan-400 hover:underline font-semibold ml-1">Ir a login.html</a>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closeWaitlistAuthModal() {
    const modal = document.getElementById('waitlist-auth-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  function switchWaitlistTab(tab) {
    const tabLogin = document.getElementById('wl-tab-login');
    const tabRegister = document.getElementById('wl-tab-register');
    const formLogin = document.getElementById('wl-form-login');
    const formRegister = document.getElementById('wl-form-register');
    const alertBox = document.getElementById('wl-auth-alert');
    if (!tabLogin || !tabRegister || !formLogin || !formRegister) return;

    if (alertBox) alertBox.classList.add('hidden');

    if (tab === 'login') {
      tabLogin.className = 'flex-1 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold transition-all shadow-sm';
      tabRegister.className = 'flex-1 py-2 rounded-lg text-slate-400 hover:text-white transition-all';
      formLogin.classList.remove('hidden');
      formRegister.classList.add('hidden');
    } else {
      tabRegister.className = 'flex-1 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold transition-all shadow-sm';
      tabLogin.className = 'flex-1 py-2 rounded-lg text-slate-400 hover:text-white transition-all';
      formRegister.classList.remove('hidden');
      formLogin.classList.add('hidden');
    }
  }

  function showWaitlistAuthAlert(msg, isError = true) {
    const alertBox = document.getElementById('wl-auth-alert');
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.className = `mb-4 p-3 rounded-xl text-xs font-medium border ${
      isError ? 'bg-red-950/60 text-red-300 border-red-500/40' : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
    }`;
    alertBox.classList.remove('hidden');
  }

  async function submitWaitlistLogin(e, courseId) {
    e.preventDefault();
    const email = document.getElementById('wl-login-email').value;
    const pass = document.getElementById('wl-login-password').value;

    try {
      await window.ElectroLabAuth.login(email, pass);
      if (window.ElectroLabAuth.updateNavAuthUI) {
        window.ElectroLabAuth.updateNavAuthUI();
      }
      closeWaitlistAuthModal();
      await joinWaitlist(courseId);
    } catch (err) {
      showWaitlistAuthAlert(err.message || 'Error al iniciar sesión', true);
    }
  }

  async function submitWaitlistRegister(e, courseId) {
    e.preventDefault();
    const name = document.getElementById('wl-reg-name').value;
    const email = document.getElementById('wl-reg-email').value;
    const pass = document.getElementById('wl-reg-password').value;

    try {
      await window.ElectroLabAuth.register(name, email, pass);
      if (window.ElectroLabAuth.updateNavAuthUI) {
        window.ElectroLabAuth.updateNavAuthUI();
      }
      closeWaitlistAuthModal();
      await joinWaitlist(courseId);
    } catch (err) {
      showWaitlistAuthAlert(err.message || 'Error al registrarse', true);
    }
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
    handleLessonAccess,
    openAccessNoticeModal,
    closeAccessNoticeModal,
    enrollAndCheckout,
    openDemoVideo,
    closeDemoVideo,
    checkoutWhatsApp,
    checkoutMercadoPago,
    checkoutTransferencia,
    checkoutPayPal,
    openPaymentModal,
    closePaymentModal,
    calculateCartTotals,
    copyToClipboard,
    sendPaymentReceipt,
    showToast,
    joinWaitlist,
    openWaitlistAuthModal,
    closeWaitlistAuthModal,
    switchWaitlistTab,
    submitWaitlistLogin,
    submitWaitlistRegister,
    examenCurso1,
    examenCurso2
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
