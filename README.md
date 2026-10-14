# ⚡ ElectroLab Educativa - Plataforma Web & Aula Virtual con Control de Accesos

Plataforma web completa de última generación con **tienda de cursos de alta conversión**, **área privada para alumnos**, **reproductor de clases con descarga de materiales (.ASC, .INO, PDF)** y un **Panel de Control de Administración** para habilitar o deshabilitar accesos a cursos con un solo clic.

---

## 🚀 Arquitectura del Sistema

El proyecto está diseñado para funcionar en dos modos sin que tengas que cambiar nada:

1. **Modo Servidor Full-Stack (Recomendado)**:
   - Ejecutando `python server.py`, el servidor autónomo crea una base de datos **SQLite (`electrolab.db`)**, gestiona sesiones cifradas con tokens, almacena los usuarios y maneja las autorizaciones de cursos.
   - **Zero-Dependencies**: No requiere `pip install` de ningún paquete externo; utiliza exclusivamente las librerías nativas de Python (`http.server`, `sqlite3`, `hashlib`, etc.).

2. **Modo Estático / Offline (Fallback en navegador)**:
   - Si se sube a un hosting estático simple (como GitHub Pages o cPanel sin Python), el motor [`auth.js`](file:///C:/Users/dbarr/.gemini/antigravity/scratch/electrolab-web/auth.js) conmuta automáticamente a almacenamiento local persistente (`localStorage`), permitiendo probar todas las funciones, el login, el aula y el panel admin exactamente igual.

---

## 🔐 Credenciales Predeterminadas de Prueba

Al iniciar el sistema por primera vez, se configuran dos cuentas automáticas:

### 👑 Administrador (Tú como Dueño / Profesor)
* **URL:** `http://localhost:8000/admin.html` (o ingresando por `login.html`)
* **Correo:** `admin@electrolab.com`
* **Contraseña:** `Lobita2026`
* **Seguridad:** El autocompletado y botones de prueba han sido deshabilitados en el login para mayor resguardo y privacidad.
* **Permisos:** Acceso total a todos los cursos y control absoluto de los alumnos.

### 🎓 Alumno Demo (Para pruebas)
* **URL:** `http://localhost:8000/aula.html` (o ingresando por `login.html`)
* **Correo:** `alumno@demo.com`
* **Contraseña:** `alumno123`
* **Permisos Iniciales:** Solo tiene habilitado el curso *Electrónica Práctica Desde CERO*.

---

## 💻 Funcionalidades de Cada Panel

### 1. Panel de Administración ([`admin.html`](file:///C:/Users/dbarr/.gemini/antigravity/scratch/electrolab-web/admin.html))
* **Métricas en Tiempo Real:** Total de alumnos registrados, accesos concedidos y distribución por curso.
* **Control de Cursos por Alumno:** Cada alumno aparece en una tabla con interruptores (switches) para cada curso:
  - *Electrónica Práctica Desde Cero* (ON / OFF)
  - *Arduino & Microcontroladores* (ON / OFF)
  - *Pack Master Completo* (ON / OFF)
  - *Biblioteca LTspice .ASC* (ON / OFF)
  Al hacer clic en un switch, el permiso se actualiza inmediatamente en la base de datos SQLite.
* **Alta Manual de Alumnos:** Botón `➕ Registrar Nuevo Alumno` para crear una cuenta en el acto cuando alguien compra por Transferencia Bancaria o WhatsApp, asignándole sus cursos de inmediato.
* **Aviso por WhatsApp en 1 Clic:** Botón directo para enviar un WhatsApp al alumno confirmándole que sus cursos ya están activos en su cuenta.
* **Buscador en Vivo:** Filtra al instante por nombre o correo electrónico.

### 2. Aula Virtual Privada del Alumno ([`aula.html`](file:///C:/Users/dbarr/.gemini/antigravity/scratch/electrolab-web/aula.html))
* **Cursos Habilitados:** El alumno **SOLO puede ver y acceder** a los cursos que ha comprado o que el administrador le haya activado.
* **Cursos Disponibles para Desbloquear:** Los cursos no adquiridos aparecen bloqueados con un candado 🔒 y un botón directo para adquirirlos.
* **Reproductor de Clases Integrado:**
  - Pantalla de video en alta definición con lista de lecciones agrupadas por módulo.
  - **Descargas y Materiales en Google Drive:** Enlaces directos a las carpetas privadas de Google Drive para descargar los archivos `.asc` de LTspice, sketches `.ino` de Arduino y diagramas esquemáticos en PDF correspondientes a cada curso con `target="_blank"`.
  - **Seguimiento de Progreso:** Botón para marcar cada clase como completada con barra de porcentaje en tiempo real.
  - **Soporte Directo con el Profesor:** Botón flotante para consultar dudas de la clase por WhatsApp.

### 📁 Carpetas de Materiales Oficiales (Google Drive)
* **Curso 1 (Electrónica Desde Cero):** `https://drive.google.com/drive/folders/1rXuc5CcPYwX8eChWINgNXDo7Sl7a0It8?usp=drive_link`
* **Curso 2 (Arduino & Microcontroladores):** `https://drive.google.com/drive/folders/1g0FJAD-2iifE4DgZ789MvjOsHHfYQMVa?usp=drive_link`
* **Curso 3 (Combo Master):** `https://drive.google.com/drive/folders/18vYXavKUw_ge42v26zVGgFxHzGsSWV5J?usp=drive_link`
* **Curso 4 (Simulaciones LTspice):** `https://drive.google.com/drive/folders/1Ria3iinViGHPSRa1VlQIypBTQRrf-IAX?usp=drive_link`
*(Los enlaces públicos a repositorios de GitHub han sido eliminados por seguridad y sustituidos por estas carpetas).*

### 3. Pantalla de Acceso ([`login.html`](file:///C:/Users/dbarr/.gemini/antigravity/scratch/electrolab-web/login.html))
* Pestañas para **Iniciar Sesión** o **Crear Cuenta**.
* **Autocompletado desactivado**: Los campos y formularios no se autocompletan para máxima seguridad.
* Redirección inteligente: los administradores son dirigidos a `admin.html` y los alumnos a `aula.html`.

### 4. Tienda Pública y Landing Page ([`index.html`](file:///C:/Users/dbarr/.gemini/antigravity/scratch/electrolab-web/index.html))
* **WhatsApp Oficial:** Vinculado a `+54 9 11 2306-5347` (`5491123065347`) en botones de compra, soporte y consultas.
* Simulador interactivo con **osciloscopio digital en vivo**, formas de onda (PWM/555, Senoidal, RC), potenciómetro y monitor serie.
* Catálogo de cursos con conmutador de moneda (**ARS $** y **USD $**).
* Carrito de compras con cupón `ELECTRO2026`.
* Botón en la cabecera que muestra dinámicamente "Acceso Alumnos" o el acceso directo a "Mi Aula" y "Admin" si ya se inició sesión.

---

## 🏃 Cómo Ejecutarlo Localmente

1. Abre PowerShell y ve a la carpeta del proyecto:
```powershell
cd "C:\Users\dbarr\.gemini\antigravity\scratch\electrolab-web"
```

2. Inicia el servidor con base de datos SQLite:
```powershell
python server.py
```

3. Abre en tu navegador cualquiera de las siguientes URLs:
   - **Tienda Pública:** [http://localhost:8000/index.html](http://localhost:8000/index.html)
   - **Login / Registro:** [http://localhost:8000/login.html](http://localhost:8000/login.html)
   - **Panel de Administración:** [http://localhost:8000/admin.html](http://localhost:8000/admin.html)
   - **Aula del Alumno:** [http://localhost:8000/aula.html](http://localhost:8000/aula.html)

---

## 🌐 Publicación en tu Dominio (`electrolabeducativa.com.ar`)

* Si utilizas un hosting con soporte de Python (cPanel con *Setup Python App*, VPS, Render, Railway o PythonAnywhere), puedes ejecutar `server.py` directamente.
* Si utilizas un hosting compartido puramente HTML/PHP tradicional, puedes subir todos los archivos (`index.html`, `login.html`, `aula.html`, `admin.html`, `auth.js`, `app.js`, `circuit-sim.js`, `styles.css` y `logo.jpg`). El sistema funcionará con el almacenamiento persistente integrado en el navegador.
