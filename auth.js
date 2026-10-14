/**
 * ElectroLab Educativa - Authentication & Session Engine (auth.js)
 * Maneja sesiones, login, registro, roles (admin / student) y autorización
 * Compatible con backend Python (server.py) y modo local/offline (localStorage).
 */

(function () {
  'use strict';

  const STORAGE_KEY_USER = 'electrolab_user';
  const STORAGE_KEY_TOKEN = 'electrolab_token';
  const STORAGE_KEY_USERS_DB = 'electrolab_mock_users_db';
  const STORAGE_KEY_ENROLLMENTS = 'electrolab_mock_enrollments_db';
  const STORAGE_KEY_PROGRESS = 'electrolab_lesson_progress';

  // Usuarios iniciales predeterminados para modo local/offline
  const DEFAULT_USERS = [
    {
      id: 'usr_admin',
      name: 'Admin ElectroLab',
      email: 'admin@electrolab.com',
      password: 'admin',
      role: 'admin',
      createdAt: '2026-01-10T10:00:00Z',
      courses: ['curso-electronica-cero', 'curso-arduino-microcontroladores', 'combo-master-electronica-arduino', 'guia-simulaciones-ltspice']
    },
    {
      id: 'usr_alumno1',
      name: 'Martín Gómez',
      email: 'alumno@demo.com',
      password: 'alumno123',
      role: 'student',
      createdAt: '2026-02-15T14:30:00Z',
      courses: ['curso-electronica-cero'] // Solo tiene habilitado Electrónica desde Cero
    }
  ];

  // Inicializar base de datos local si no existe
  function initLocalDB() {
    if (!localStorage.getItem(STORAGE_KEY_USERS_DB)) {
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(DEFAULT_USERS));
    }
  }
  initLocalDB();

  function getLocalUsers() {
    initLocalDB();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '[]');
    } catch (e) {
      return DEFAULT_USERS;
    }
  }

  function saveLocalUsers(users) {
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
  }

  // Comprobar si hay backend Python respondiendo en /api
  let isBackendAvailable = null;
  async function checkBackend() {
    if (isBackendAvailable !== null) return isBackendAvailable;
    try {
      const res = await fetch('/api/health', { method: 'GET', headers: { 'Cache-Control': 'no-cache' } });
      isBackendAvailable = res.ok;
    } catch (e) {
      isBackendAvailable = false;
    }
    return isBackendAvailable;
  }

  // Obtener usuario actualmente autenticado
  function getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function getToken() {
    return localStorage.getItem(STORAGE_KEY_TOKEN) || '';
  }

  // Login
  async function login(email, password) {
    email = email.trim().toLowerCase();
    const hasBackend = await checkBackend();

    if (hasBackend) {
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Credenciales inválidas');
        }
        localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
        return { success: true, user: data.user };
      } catch (err) {
        throw err;
      }
    }

    // Modo local / Fallback
    const users = getLocalUsers();
    const found = users.find(u => u.email.toLowerCase() === email && u.password === password);
    if (!found) {
      throw new Error('Correo o contraseña incorrectos');
    }

    const sessionUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      courses: found.courses || []
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));
    localStorage.setItem(STORAGE_KEY_TOKEN, 'mock_token_' + Date.now());
    return { success: true, user: sessionUser };
  }

  // Registro de nuevo estudiante
  async function register(name, email, password) {
    email = email.trim().toLowerCase();
    name = name.trim();
    const hasBackend = await checkBackend();

    if (hasBackend) {
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Error al registrar');
        }
        localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
        return { success: true, user: data.user };
      } catch (err) {
        throw err;
      }
    }

    // Modo local
    const users = getLocalUsers();
    if (users.some(u => u.email.toLowerCase() === email)) {
      throw new Error('Ya existe una cuenta registrada con este correo');
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: name,
      email: email,
      password: password,
      role: 'student',
      createdAt: new Date().toISOString(),
      courses: [] // Inicialmente sin cursos comprados hasta que el admin los habilite o pague
    };

    users.push(newUser);
    saveLocalUsers(users);

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      courses: []
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));
    localStorage.setItem(STORAGE_KEY_TOKEN, 'mock_token_' + Date.now());
    return { success: true, user: sessionUser };
  }

  // Cerrar sesión
  async function logout() {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        await fetch('/api/logout', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + getToken() }
        });
      } catch (e) {}
    }
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    window.location.href = './index.html';
  }

  // Verificar si el usuario actual tiene acceso a un curso
  function hasCourseAccess(courseId) {
    const user = getCurrentUser();
    if (!user) return false;
    if (user.role === 'admin') return true; // El admin tiene acceso a todos los cursos
    const list = user.courses || [];
    // Si tiene el pack master, tiene acceso a todos los cursos
    if (list.includes('combo-master-electronica-arduino')) return true;
    return list.includes(courseId);
  }

  // Obtener cursos habilitados del usuario actual
  function getEnrolledCourses() {
    const user = getCurrentUser();
    if (!user) return [];
    if (user.role === 'admin') {
      return ['curso-electronica-cero', 'curso-arduino-microcontroladores', 'combo-master-electronica-arduino', 'guia-simulaciones-ltspice'];
    }
    const list = user.courses || [];
    if (list.includes('combo-master-electronica-arduino')) {
      return ['curso-electronica-cero', 'curso-arduino-microcontroladores', 'combo-master-electronica-arduino', 'guia-simulaciones-ltspice'];
    }
    return list;
  }

  // Progreso de lecciones completadas
  function getLessonProgress(courseId) {
    const user = getCurrentUser();
    if (!user) return [];
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY_PROGRESS) || '{}');
      const userProg = all[user.id] || {};
      return userProg[courseId] || [];
    } catch (e) {
      return [];
    }
  }

  function toggleLessonCompleted(courseId, lessonId) {
    const user = getCurrentUser();
    if (!user) return false;
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY_PROGRESS) || '{}');
      if (!all[user.id]) all[user.id] = {};
      if (!all[user.id][courseId]) all[user.id][courseId] = [];

      const list = all[user.id][courseId];
      const idx = list.indexOf(lessonId);
      let isCompleted = false;
      if (idx > -1) {
        list.splice(idx, 1);
        isCompleted = false;
      } else {
        list.push(lessonId);
        isCompleted = true;
      }
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(all));
      return isCompleted;
    } catch (e) {
      return false;
    }
  }

  // ================= ADMIN FUNCTIONS =================
  async function adminGetUsers() {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Acceso no autorizado');
      return await res.json();
    }
    // Fallback local
    const users = getLocalUsers();
    return users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      courses: u.courses || []
    }));
  }

  async function adminToggleCourseAccess(userId, courseId, enabled) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      const res = await fetch('/api/admin/toggle-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({ userId, courseId, enabled })
      });
      if (!res.ok) throw new Error('Error al actualizar permisos');
      return await res.json();
    }

    // Fallback local
    const users = getLocalUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('Usuario no encontrado');

    if (!user.courses) user.courses = [];
    const idx = user.courses.indexOf(courseId);
    if (enabled && idx === -1) {
      user.courses.push(courseId);
    } else if (!enabled && idx > -1) {
      user.courses.splice(idx, 1);
    }
    saveLocalUsers(users);

    // Si el usuario modificado es el logueado actualmente, actualizar su sesión
    const curr = getCurrentUser();
    if (curr && curr.id === userId) {
      curr.courses = user.courses;
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(curr));
    }
    return { success: true, courses: user.courses };
  }

  async function adminCreateUser(name, email, password, courses = [], role = 'student') {
    email = email.trim().toLowerCase();
    name = name.trim();
    const hasBackend = await checkBackend();

    if (hasBackend) {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({ name, email, password, courses, role })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al crear usuario');
      }
      return await res.json();
    }

    // Fallback local
    const users = getLocalUsers();
    if (users.some(u => u.email.toLowerCase() === email)) {
      throw new Error('Ya existe un usuario con este correo');
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
      courses
    };
    users.push(newUser);
    saveLocalUsers(users);
    return { success: true, user: newUser };
  }

  async function adminDeleteUser(userId) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      const res = await fetch(`/api/admin/user/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Error al eliminar usuario');
      return await res.json();
    }

    let users = getLocalUsers();
    users = users.filter(u => u.id !== userId);
    saveLocalUsers(users);
    return { success: true };
  }

  // Actualizar la barra superior en páginas públicas
  function updateNavAuthUI() {
    const container = document.getElementById('nav-auth-container');
    if (!container) return;

    const user = getCurrentUser();
    if (!user) {
      container.innerHTML = `
        <a href="./login.html" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/80 hover:border-cyan-400/80 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/60 transition-all">
          <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
          <span>Acceso Alumnos</span>
        </a>
      `;
    } else {
      const isAdm = user.role === 'admin';
      container.innerHTML = `
        <div class="flex items-center gap-2">
          ${isAdm ? `
            <a href="./admin.html" class="px-2.5 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 text-xs font-bold transition-all flex items-center gap-1" title="Panel de Administración">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
              <span>Admin</span>
            </a>
          ` : ''}
          <a href="./aula.html" class="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-all flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            <span>Mi Aula</span>
          </a>
          <button onclick="window.ElectroLabAuth.logout()" class="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors" title="Cerrar sesión">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      `;
    }
  }

  // Exponer a nivel global
  window.ElectroLabAuth = {
    getCurrentUser,
    getToken,
    login,
    register,
    logout,
    hasCourseAccess,
    getEnrolledCourses,
    getLessonProgress,
    toggleLessonCompleted,
    adminGetUsers,
    adminToggleCourseAccess,
    adminCreateUser,
    adminDeleteUser,
    updateNavAuthUI
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNavAuthUI);
  } else {
    updateNavAuthUI();
  }
})();
