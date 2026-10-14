# ⚡ ElectroLab Educativa - Plataforma Web Moderna de Cursos

Plataforma web de última generación diseñada para la venta y presentación de cursos de **Electrónica Práctica Desde Cero** y **Arduino con Microcontroladores**, creada para **ElectroLab Educativa**.

---

## 🚀 Características Principales

1. **Diseño High-Tech de Alta Conversión**:
   - Estética tecnológica moderna en tonos azul eléctrico, cian neón y grafito profundo (`#060913`).
   - Identidad visual oficial con el logo original de ElectroLab Educativa.
   - Totalmente responsivo para celulares, tablets y computadoras de escritorio.

2. **Simulador de Laboratorio Interactivo en Tiempo Real**:
   - **Osciloscopio digital animado en Canvas**: Muestra ondas cuadradas (PWM/555), señales senoidales AC y curvas de carga/descarga exponencial RC.
   - **Controles interactivos**: Frecuencia (Hz) y potenciómetro con cálculo automático de voltaje pico a pico ($V_{pp}$), $V_{rms}$ y ciclo de trabajo (Duty Cycle).
   - **Simulación de pin digital con LED virtual**: Varía su brillo con PWM en vivo.
   - **Consola de Monitor Serie**: Demuestra en tiempo real la lectura de ADC del microcontrolador.

3. **Catálogo de Cursos & Motor de Ventas**:
   - **Curso 1**: *Electrónica Práctica Desde CERO (Analógica y Digital)*.
   - **Curso 2**: *Arduino & Microcontroladores: Del Primer Sketch a IoT*.
   - **Combo Master (Best Seller)**: *Electrónica Total + Arduino Full Stack* con 58% de descuento promocional.
   - **Biblioteca de Descargas**: *+60 Modelos de Simulación en LTspice (.ASC)*.
   - Filtros dinámicos por categoría (Todos, Electrónica, Arduino, Combos, Guías).

4. **Temario Interactivo & Clase Demo Gratuita**:
   - Ventana modal con el desglose detallado módulo por módulo y lección por lección.
   - Reproductor de video de muestra integrado con el canal oficial de YouTube `@ElectroLabEducativa`.

5. **Carrito de Compras Multi-Moneda & Multi-Pasarela**:
   - **Conmutador de Moneda**: Alterna entre **ARS ($)** (Pesos Argentinos) y **USD ($)** (Dólares para alumnos internacionales) con persistencia en el navegador.
   - **Cupón de descuento**: Sistema de cupón activo con código `ELECTRO2026` (10% OFF extra).
   - **Pasarelas Integradas**:
     - **WhatsApp en 1 Clic**: Arma automáticamente el mensaje de pedido con el detalle de los cursos seleccionados, total y moneda, listo para enviar.
     - **Mercado Pago (Argentina)**: Flujo preparado para cobro con tarjeta, débito, Rapipago o Pago Fácil.
     - **Transferencia Bancaria Directa**: Muestra el Alias y CBU oficial con confirmación de comprobante.
     - **PayPal / Tarjetas Internacionales**: Para alumnos de México, Colombia, Chile, España, etc.

6. **Formulario Institucional & Preguntas Frecuentes (FAQ)**:
   - Formulario de contacto conectado con tu endpoint verificado de Formspree (`mqpeydok`).
   - Acordeón interactivo con las 6 preguntas más frecuentes que resuelven objeciones de compra.
   - Botón flotante de WhatsApp siempre visible.

---

## 🛠️ Personalización Rápida

En el archivo `app.js` puedes modificar fácilmente la configuración:

### 1. Cambiar tu número de WhatsApp
En las primeras líneas de `app.js`:
```javascript
const CONFIG = {
  whatsappNumber: '5491138805566', // Coloca aquí tu número con código de país sin el '+'
  defaultCurrency: 'ARS',
  couponCode: 'ELECTRO2026',
  couponDiscount: 0.10 // 10% de descuento
};
```

### 2. Modificar Precios o Agregar Nuevos Cursos
En la lista `COURSES` de `app.js`:
```javascript
{
  id: 'curso-electronica-cero',
  title: 'Electrónica Práctica Desde CERO',
  priceARS: 18900,   // Precio de venta en Pesos Argentinos
  origARS: 34500,    // Precio tachado
  priceUSD: 19,      // Precio de venta en USD
  origUSD: 35,       // Precio tachado en USD
  ...
}
```

### 3. Actualizar Datos Bancarios (Alias / CBU)
En la función `checkoutTransferencia` de `app.js`, edita el Alias y CBU que deseas mostrar a tus clientes.

---

## 🌐 Cómo Subir a tu Dominio (`electrolabeducativa.com.ar`)

Solo necesitas copiar estos 5 archivos a la carpeta raíz de tu hosting (por ejemplo `public_html` vía cPanel o FTP):
1. `index.html`
2. `styles.css`
3. `app.js`
4. `circuit-sim.js`
5. `logo.jpg`

No requiere Node.js, compilación ni servidores backend complejos; funciona instantáneamente en cualquier hosting compartido, VPS, GitHub Pages, Netlify o Vercel.

---

## 💻 Cómo Probarlo Localmente

Si quieres verlo en funcionamiento en tu computadora:

1. Abre una terminal de PowerShell en esta carpeta:
```powershell
cd "C:\Users\dbarr\.gemini\antigravity\scratch\electrolab-web"
```
2. Ejecuta el servidor local de prueba:
```powershell
python -m http.server 8000
```
3. Abre tu navegador en [http://localhost:8000](http://localhost:8000).
