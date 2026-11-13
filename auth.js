/**
 * ElectroLab Educativa - Authentication & Session Engine (auth.js)
 * Maneja sesiones, login, registro, roles (admin / student) y autorización.
 * Integrado oficialmente con Firebase Firestore ('electrolab-academia', colección 'usuarios')
 * como base de datos en la nube en tiempo real, manteniendo fallback local/offline.
 */

(function () {
  'use strict';

  const STORAGE_KEY_USER = 'electrolab_user';
  const STORAGE_KEY_TOKEN = 'electrolab_token';
  const STORAGE_KEY_USERS_DB = 'electrolab_mock_users_db';
  const STORAGE_KEY_PROGRESS = 'electrolab_lesson_progress';

  const ALL_OFFICIAL_COURSES = ['curso-1', 'curso-2', 'curso-3', 'curso-4', 'curso-5'];

  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDXXsdNO_s18-hko4riY6pc7_RJjBDInA0",
    authDomain: "electrolab-academia.firebaseapp.com",
    projectId: "electrolab-academia",
    storageBucket: "electrolab-academia.firebasestorage.app",
    messagingSenderId: "1013501407471",
    appId: "1:1013501407471:web:1de69c347f9a3edf046b1a"
  };

  // Normaliza IDs de cursos a los 5 Cursos Oficiales
  function normalizeCourseList(courses = []) {
    const normalized = new Set();
    courses.forEach(cid => {
      if (cid === 'curso-1') {
        normalized.add('curso-1');
      } else if (cid === 'curso-2' || cid === 'curso-electronica-cero') {
        normalized.add('curso-2');
      } else if (cid === 'curso-3' || cid === 'combo-master-electronica-arduino') {
        if (cid === 'combo-master-electronica-arduino') {
          ALL_OFFICIAL_COURSES.forEach(c => normalized.add(c));
        } else {
          normalized.add('curso-3');
        }
      } else if (cid === 'curso-4') {
        normalized.add('curso-4');
      } else if (cid === 'curso-5' || cid === 'curso-arduino-microcontroladores') {
        normalized.add('curso-5');
      } else if (typeof cid === 'string' && cid.trim()) {
        normalized.add(cid.trim());
      }
    });
    return Array.from(normalized);
  }

  // Obtener o inicializar la instancia oficial de Firebase Firestore
  function getDb() {
    if (window.db) return window.db;
    if (window.ElectroLab && window.ElectroLab.getDb) {
      const d = window.ElectroLab.getDb();
      if (d) {
        window.db = d;
        return window.db;
      }
    }
    if (typeof firebase !== 'undefined') {
      try {
        if (!firebase.apps || !firebase.apps.length) {
          firebase.initializeApp((window.ElectroLab && window.ElectroLab.firebaseConfig) || FIREBASE_CONFIG);
        }
        window.db = firebase.firestore();
        return window.db;
      } catch (e) {
        console.warn("Inicialización Firestore en auth.js:", e);
      }
    }
    return null;
  }

  // Garantizar que la cuenta de Administrador exista en Firestore
  async function ensureAdminInFirestore() {
    const db = getDb();
    if (!db) return;
    try {
      const adminRef = db.collection('usuarios').doc('admin@electrolab.com');
      const snap = await adminRef.get();
      if (!snap.exists) {
        await adminRef.set({
          id: 'admin@electrolab.com',
          name: 'Admin ElectroLab',
          email: 'admin@electrolab.com',
          password: 'Lobita2026',
          role: 'admin',
          courses: ['curso-1', 'curso-2', 'curso-3', 'curso-4', 'curso-5'],
          grades: {},
          lista_espera: [],
          createdAt: '2026-01-10T10:00:00Z'
        });
      }
    } catch (e) {
      // Ignorar silenciosamente si no hay conexión
    }
  }

  // Usuarios predeterminados para modo local / offline
  const DEFAULT_USERS = [
    {
      id: 'admin@electrolab.com',
      name: 'Admin ElectroLab',
      email: 'admin@electrolab.com',
      password: 'Lobita2026',
      role: 'admin',
      createdAt: '2026-01-10T10:00:00Z',
      courses: ['curso-1', 'curso-2', 'curso-3', 'curso-4', 'curso-5'],
      grades: {},
      lista_espera: []
    },
    {
      id: 'alumno@demo.com',
      name: 'Martín Gómez',
      email: 'alumno@demo.com',
      password: 'alumno123',
      role: 'student',
      createdAt: '2026-02-15T14:30:00Z',
      courses: ['curso-1'],
      grades: {
        'curso-1': {
          finalGrade: '9/10',
          attemptsUsed: 1,
          status: 'Aprobado',
          gradedAt: '2026-03-20',
          observations: 'Excelente proyecto integrador y resolución analítica de circuitos en CC.'
        }
      },
      lista_espera: []
    }
  ];

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

  // Obtener usuario actualmente autenticado desde la caché local
  function getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      if (!data) return null;
      const user = JSON.parse(data);
      user.courses = normalizeCourseList(user.courses || []);
      user.grades = user.grades || {};
      user.lista_espera = Array.isArray(user.lista_espera) ? user.lista_espera : [];
      return user;
    } catch (e) {
      return null;
    }
  }

  function getToken() {
    return localStorage.getItem(STORAGE_KEY_TOKEN) || '';
  }

  // Sincronizar en segundo plano el usuario autenticado con la versión más reciente en Firestore
  async function refreshCurrentUser() {
    const curr = getCurrentUser();
    if (!curr || !curr.email) return null;
    const db = getDb();
    if (db) {
      try {
        const snap = await db.collection('usuarios').doc(curr.email.toLowerCase().trim()).get();
        if (snap.exists) {
          const data = snap.data();
          curr.courses = normalizeCourseList(data.courses || []);
          curr.grades = data.grades || {};
          curr.role = data.role || curr.role || 'student';
          curr.name = data.name || curr.name;
          curr.lista_espera = Array.isArray(data.lista_espera) ? data.lista_espera : [];
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(curr));
        }
      } catch (err) {
        console.warn("Fallo sincronización Firestore en refreshCurrentUser:", err);
      }
    }
    return curr;
  }

  // Iniciar Sesión (Prioriza Firestore, con herencia de compras previas)
  async function login(email, password) {
    email = email.trim().toLowerCase();

    // 1. Acceso de Administrador Maestro
    if (email === 'admin@electrolab.com' && password === 'Lobita2026') {
      const adminSession = {
        id: 'admin@electrolab.com',
        name: 'Admin ElectroLab',
        email: 'admin@electrolab.com',
        role: 'admin',
        courses: ['curso-1', 'curso-2', 'curso-3', 'curso-4', 'curso-5'],
        grades: {},
        lista_espera: []
      };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(adminSession));
      localStorage.setItem(STORAGE_KEY_TOKEN, 'admin_token_' + Date.now());
      ensureAdminInFirestore().catch(() => {});
      return { success: true, user: adminSession };
    }

    // 2. Consulta en la nube (Firestore)
    const db = getDb();
    if (db) {
      try {
        const docRef = db.collection('usuarios').doc(email);
        const snap = await docRef.get();
        if (snap.exists) {
          const data = snap.data();

          // Si el alumno ya tenía clave, verificarla
          if (data.password && data.password !== password) {
            throw new Error('Correo o contraseña incorrectos');
          }

          // Si fue creado automáticamente por webhook (sin clave previa), establecer esta clave
          if (!data.password) {
            await docRef.set({
              password: password,
              updatedAt: new Date().toISOString()
            }, { merge: true });
            data.password = password;
          }

          const sessionUser = {
            id: data.id || email,
            name: data.name || email.split('@')[0],
            email: email,
            role: data.role || 'student',
            courses: normalizeCourseList(data.courses || []),
            grades: data.grades || {},
            lista_espera: Array.isArray(data.lista_espera) ? data.lista_espera : []
          };

          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));
          localStorage.setItem(STORAGE_KEY_TOKEN, 'fs_token_' + Date.now());
          return { success: true, user: sessionUser };
        }
      } catch (err) {
        if (err.message === 'Correo o contraseña incorrectos') {
          throw err;
        }
        console.warn("Fallo lectura Firestore en login, usando fallback:", err);
      }
    }

    // 3. Fallback local / offline
    const users = getLocalUsers();
    const found = users.find(u => u.email.toLowerCase() === email && u.password === password);
    if (!found) {
      throw new Error('Correo o contraseña incorrectos');
    }

    const sessionUser = {
      id: found.id || email,
      name: found.name,
      email: found.email,
      role: found.role,
      courses: normalizeCourseList(found.courses || []),
      grades: found.grades || {},
      lista_espera: Array.isArray(found.lista_espera) ? found.lista_espera : []
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));
    localStorage.setItem(STORAGE_KEY_TOKEN, 'mock_token_' + Date.now());
    return { success: true, user: sessionUser };
  }

  // Registro de nuevo estudiante (o completar cuenta pre-creada tras una compra)
  async function register(name, email, password) {
    email = email.trim().toLowerCase();
    name = name.trim();

    const db = getDb();
    if (db) {
      try {
        const docRef = db.collection('usuarios').doc(email);
        const snap = await docRef.get();

        if (snap.exists) {
          const existing = snap.data();
          if (existing.password) {
            throw new Error('Ya existe una cuenta registrada con este correo. Por favor inicia sesión.');
          }

          // El alumno compró previamente (su doc fue creado por el webhook con los cursos ya activados)
          const inheritedCourses = normalizeCourseList(existing.courses || []);
          const updatedUser = {
            name: name || existing.name || email.split('@')[0],
            password: password,
            role: existing.role || 'student',
            updatedAt: new Date().toISOString()
          };
          await docRef.set(updatedUser, { merge: true });

          const sessionUser = {
            id: existing.id || email,
            name: updatedUser.name,
            email: email,
            role: updatedUser.role,
            courses: inheritedCourses,
            grades: existing.grades || {},
            lista_espera: Array.isArray(existing.lista_espera) ? existing.lista_espera : []
          };

          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));
          localStorage.setItem(STORAGE_KEY_TOKEN, 'fs_token_' + Date.now());
          return { success: true, user: sessionUser };
        } else {
          // Estudiante nuevo sin compra previa
          const newUser = {
            id: email,
            name: name,
            email: email,
            password: password,
            role: 'student',
            courses: [],
            grades: {},
            lista_espera: [],
            createdAt: new Date().toISOString()
          };
          await docRef.set(newUser);

          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
          localStorage.setItem(STORAGE_KEY_TOKEN, 'fs_token_' + Date.now());
          return { success: true, user: newUser };
        }
      } catch (err) {
        if (err.message && err.message.includes('Ya existe una cuenta')) {
          throw err;
        }
        console.warn("Fallo registro Firestore, usando fallback local:", err);
      }
    }

    // Fallback local
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
      courses: [],
      grades: {},
      lista_espera: []
    };

    users.push(newUser);
    saveLocalUsers(users);

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      courses: [],
      grades: {},
      lista_espera: []
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionUser));
    localStorage.setItem(STORAGE_KEY_TOKEN, 'mock_token_' + Date.now());
    return { success: true, user: sessionUser };
  }

  // Cerrar sesión
  async function logout() {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    window.location.href = './index.html';
  }

  // Verificar si el usuario actual tiene acceso a un curso
  function hasCourseAccess(courseId) {
    const user = getCurrentUser();
    if (!user) return false;
    if (user.role === 'admin') return true;
    const list = normalizeCourseList(user.courses || []);
    return list.includes(courseId);
  }

  // Obtener cursos habilitados del usuario actual
  function getEnrolledCourses() {
    const user = getCurrentUser();
    if (!user) return [];
    if (user.role === 'admin') {
      return ALL_OFFICIAL_COURSES;
    }
    return normalizeCourseList(user.courses || []);
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
    const db = getDb();
    if (db) {
      try {
        const snap = await db.collection('usuarios').get();
        const users = [];
        snap.forEach(d => {
          const data = d.data();
          users.push({
            id: d.id,
            name: data.name || d.id.split('@')[0],
            email: data.email || d.id,
            role: data.role || 'student',
            courses: normalizeCourseList(data.courses || []),
            grades: data.grades || {},
            lista_espera: Array.isArray(data.lista_espera) ? data.lista_espera : [],
            createdAt: data.createdAt || ''
          });
        });

        // Garantizar que la cuenta administradora figure en la lista
        if (!users.some(u => u.role === 'admin' || u.email === 'admin@electrolab.com')) {
          users.unshift({
            id: 'admin@electrolab.com',
            name: 'Admin ElectroLab',
            email: 'admin@electrolab.com',
            role: 'admin',
            courses: ['curso-1', 'curso-2', 'curso-3', 'curso-4', 'curso-5'],
            grades: {},
            lista_espera: [],
            createdAt: '2026-01-10T10:00:00Z'
          });
        }
        return users;
      } catch (err) {
        console.warn("Fallo lectura usuarios Firestore en adminGetUsers:", err);
      }
    }

    // Fallback local
    const users = getLocalUsers();
    return users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      courses: normalizeCourseList(u.courses || []),
      grades: u.grades || {},
      lista_espera: u.lista_espera || []
    }));
  }

  async function adminToggleCourseAccess(userId, courseId, enabled) {
    const cleanId = (userId || '').toLowerCase().trim();
    const db = getDb();
    if (db) {
      try {
        const userRef = db.collection('usuarios').doc(cleanId);
        const snap = await userRef.get();
        let courses = [];
        if (snap.exists) {
          courses = normalizeCourseList(snap.data().courses || []);
        }
        const idx = courses.indexOf(courseId);
        if (enabled && idx === -1) {
          courses.push(courseId);
        } else if (!enabled && idx > -1) {
          courses.splice(idx, 1);
        }

        await userRef.set({
          courses: courses,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        // Si el usuario modificado es el actualmente autenticado, refrescar su sesión
        const curr = getCurrentUser();
        if (curr && (curr.id === userId || curr.email.toLowerCase() === cleanId)) {
          curr.courses = courses;
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(curr));
        }

        return { success: true, courses };
      } catch (err) {
        console.warn("Fallo adminToggleCourseAccess en Firestore:", err);
      }
    }

    // Fallback local
    const users = getLocalUsers();
    const user = users.find(u => u.id === userId || u.email.toLowerCase() === cleanId);
    if (!user) throw new Error('Usuario no encontrado');

    if (!user.courses) user.courses = [];
    const idx = user.courses.indexOf(courseId);
    if (enabled && idx === -1) {
      user.courses.push(courseId);
    } else if (!enabled && idx > -1) {
      user.courses.splice(idx, 1);
    }
    saveLocalUsers(users);

    const curr = getCurrentUser();
    if (curr && curr.id === userId) {
      curr.courses = user.courses;
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(curr));
    }
    return { success: true, courses: user.courses };
  }

  // Guardar calificaciones de un curso específico para un alumno
  async function adminSaveGrades(userId, courseId, gradeData) {
    const curr = getCurrentUser();
    if (!curr || curr.role !== 'admin') {
      throw new Error('Acceso denegado: Solo el Administrador puede asentar calificaciones.');
    }

    const cleanId = (userId || '').toLowerCase().trim();
    const db = getDb();
    if (db) {
      try {
        const userRef = db.collection('usuarios').doc(cleanId);
        const snap = await userRef.get();
        let grades = {};
        if (snap.exists && snap.data().grades) {
          grades = snap.data().grades;
        }
        grades[courseId] = {
          finalGrade: gradeData.finalGrade || '',
          attemptsUsed: parseInt(gradeData.attemptsUsed || 0, 10),
          status: gradeData.status || 'Pendiente',
          gradedAt: gradeData.gradedAt || (gradeData.finalGrade ? new Date().toISOString().split('T')[0] : ''),
          observations: gradeData.observations || '',
          updatedAt: new Date().toISOString()
        };
        await userRef.set({ grades, updatedAt: new Date().toISOString() }, { merge: true });
        return { success: true, grades };
      } catch (err) {
        console.warn("Fallo adminSaveGrades en Firestore:", err);
      }
    }

    // Fallback local
    const users = getLocalUsers();
    const user = users.find(u => u.id === userId || u.email.toLowerCase() === cleanId);
    if (!user) throw new Error('Usuario no encontrado');

    if (!user.grades) user.grades = {};
    user.grades[courseId] = {
      finalGrade: gradeData.finalGrade || '',
      attemptsUsed: parseInt(gradeData.attemptsUsed || 0, 10),
      status: gradeData.status || 'Pendiente',
      gradedAt: gradeData.gradedAt || (gradeData.finalGrade ? new Date().toISOString().split('T')[0] : ''),
      observations: gradeData.observations || '',
      updatedAt: new Date().toISOString()
    };
    saveLocalUsers(users);

    return { success: true, grades: user.grades };
  }

  // Guardar boletín completo de un alumno
  async function adminSaveUserReportCard(userId, gradesMap) {
    const curr = getCurrentUser();
    if (!curr || curr.role !== 'admin') {
      throw new Error('Acceso denegado: Solo el Administrador puede asentar calificaciones.');
    }

    const cleanId = (userId || '').toLowerCase().trim();
    const db = getDb();
    if (db) {
      try {
        const userRef = db.collection('usuarios').doc(cleanId);
        const snap = await userRef.get();
        let grades = {};
        if (snap.exists && snap.data().grades) {
          grades = snap.data().grades;
        }
        for (const cid in gradesMap) {
          const g = gradesMap[cid];
          grades[cid] = {
            finalGrade: g.finalGrade || '',
            attemptsUsed: parseInt(g.attemptsUsed || 0, 10),
            status: g.status || 'Pendiente',
            gradedAt: g.gradedAt || (g.finalGrade ? new Date().toISOString().split('T')[0] : ''),
            observations: g.observations || '',
            updatedAt: new Date().toISOString()
          };
        }
        await userRef.set({ grades, updatedAt: new Date().toISOString() }, { merge: true });
        return { success: true, grades };
      } catch (err) {
        console.warn("Fallo adminSaveUserReportCard en Firestore:", err);
      }
    }

    // Fallback local
    const users = getLocalUsers();
    const user = users.find(u => u.id === userId || u.email.toLowerCase() === cleanId);
    if (!user) throw new Error('Usuario no encontrado');

    if (!user.grades) user.grades = {};
    for (const cid in gradesMap) {
      const g = gradesMap[cid];
      user.grades[cid] = {
        finalGrade: g.finalGrade || '',
        attemptsUsed: parseInt(g.attemptsUsed || 0, 10),
        status: g.status || 'Pendiente',
        gradedAt: g.gradedAt || (g.finalGrade ? new Date().toISOString().split('T')[0] : ''),
        observations: g.observations || '',
        updatedAt: new Date().toISOString()
      };
    }
    saveLocalUsers(users);
    return { success: true, grades: user.grades };
  }

  // Registrar resultado de examen rendido por el propio alumno
  async function recordStudentExamResult(courseId, { finalGrade, status, attemptsUsed, gradedAt, observations }) {
    const curr = getCurrentUser();
    if (!curr) throw new Error('No hay sesión activa.');

    const cleanEmail = curr.email.toLowerCase().trim();
    const db = getDb();

    if (db) {
      try {
        const userRef = db.collection('usuarios').doc(cleanEmail);
        const snap = await userRef.get();
        let grades = {};
        if (snap.exists && snap.data().grades) {
          grades = snap.data().grades;
        }
        const existing = grades[courseId] || {};
        const attempts = attemptsUsed !== undefined ? attemptsUsed : ((existing.attemptsUsed || existing.attempts_used || 0) + 1);

        grades[courseId] = {
          finalGrade: finalGrade || '',
          attemptsUsed: Math.min(parseInt(attempts, 10), 2),
          status: status || (parseInt(finalGrade, 10) >= 6 ? 'Aprobado' : 'Desaprobado'),
          gradedAt: gradedAt || new Date().toISOString().split('T')[0],
          observations: observations || `Examen final calificado automáticamente. Intento ${attempts} de 2.`,
          updatedAt: new Date().toISOString()
        };

        await userRef.set({ grades, updatedAt: new Date().toISOString() }, { merge: true });
        curr.grades = grades;
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(curr));
        return { success: true, grades };
      } catch (e) {
        console.warn("Fallo guardado de examen en Firestore:", e);
      }
    }

    // Fallback local
    const users = getLocalUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail || u.id === curr.id);
    if (user) {
      if (!user.grades) user.grades = {};
      const existing = user.grades[courseId] || {};
      const attempts = attemptsUsed !== undefined ? attemptsUsed : ((existing.attemptsUsed || 0) + 1);
      user.grades[courseId] = {
        finalGrade: finalGrade || '',
        attemptsUsed: Math.min(parseInt(attempts, 10), 2),
        status: status || (parseInt(finalGrade, 10) >= 6 ? 'Aprobado' : 'Desaprobado'),
        gradedAt: gradedAt || new Date().toISOString().split('T')[0],
        observations: observations || `Examen final calificado automáticamente. Intento ${attempts} de 2.`,
        updatedAt: new Date().toISOString()
      };
      saveLocalUsers(users);
      curr.grades = user.grades;
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(curr));
    }
    return { success: true, grades: curr.grades };
  }

  function getUserGrades(userId) {
    const targetId = userId || (getCurrentUser() ? getCurrentUser().id : null);
    if (!targetId) return {};
    const curr = getCurrentUser();
    if (curr && (curr.id === targetId || curr.email.toLowerCase() === targetId.toLowerCase())) {
      return curr.grades || {};
    }
    const users = getLocalUsers();
    const found = users.find(u => u.id === targetId || u.email.toLowerCase() === targetId.toLowerCase());
    return found && found.grades ? found.grades : {};
  }

  async function adminCreateUser(name, email, password, courses = [], role = 'student') {
    email = email.trim().toLowerCase();
    name = name.trim();

    const db = getDb();
    if (db) {
      try {
        const userRef = db.collection('usuarios').doc(email);
        const snap = await userRef.get();
        if (snap.exists && snap.data().password) {
          throw new Error('Ya existe un usuario con este correo');
        }
        const newUser = {
          id: email,
          name,
          email,
          password,
          role,
          courses: normalizeCourseList(courses),
          grades: {},
          lista_espera: [],
          createdAt: new Date().toISOString()
        };
        await userRef.set(newUser, { merge: true });
        return { success: true, user: newUser };
      } catch (e) {
        if (e.message.includes('Ya existe')) throw e;
        console.warn("Fallo adminCreateUser en Firestore:", e);
      }
    }

    // Fallback local
    const users = getLocalUsers();
    if (users.some(u => u.email.toLowerCase() === email)) {
      throw new Error('Ya existe un usuario con este correo');
    }

    const newUser = {
      id: email,
      name,
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
      courses: normalizeCourseList(courses),
      grades: {}
    };
    users.push(newUser);
    saveLocalUsers(users);
    return { success: true, user: newUser };
  }

  async function adminDeleteUser(userId) {
    const cleanId = (userId || '').toLowerCase().trim();
    const db = getDb();
    if (db) {
      try {
        await db.collection('usuarios').doc(cleanId).delete();
      } catch (e) {
        console.warn("Fallo adminDeleteUser en Firestore:", e);
      }
    }

    let users = getLocalUsers();
    users = users.filter(u => u.id !== userId && u.email.toLowerCase() !== cleanId);
    saveLocalUsers(users);
    return { success: true };
  }

  // ================= LISTA DE ESPERA (WAITLIST) =================
  async function sendWaitlistNotification(user, courseTitle) {
    try {
      await fetch('https://formspree.io/f/xbgdqedy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          tipo_evento: "Lista de Espera",
          email_usuario: user.email || '',
          nombre_usuario: user.name || 'Estudiante',
          curso_solicitado: courseTitle || 'Curso ElectroLab',
          fecha_registro: new Date().toLocaleString()
        })
      });
    } catch (err) {
      console.warn('Notificación Formspree de Lista de Espera enviada en segundo plano:', err);
    }
  }

  function isInWaitlist(courseId, userId = null) {
    if (!courseId) return false;
    let user = null;
    if (userId) {
      const users = getLocalUsers();
      user = users.find(u => u.id === userId || u.email.toLowerCase() === userId.toLowerCase());
    } else {
      user = getCurrentUser();
    }
    if (!user || !Array.isArray(user.lista_espera)) return false;
    return user.lista_espera.includes(courseId);
  }

  async function addToWaitlist(courseId, courseTitle = '') {
    if (!courseId) throw new Error('ID de curso no especificado');
    const curr = getCurrentUser();
    if (!curr) {
      throw new Error('Debes iniciar sesión o registrarte gratis para unirte a la lista de espera.');
    }

    if (!Array.isArray(curr.lista_espera)) curr.lista_espera = [];
    if (!curr.lista_espera.includes(courseId)) {
      curr.lista_espera.push(courseId);
    }
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(curr));

    const db = getDb();
    if (db && curr.email) {
      try {
        await db.collection('usuarios').doc(curr.email.toLowerCase().trim()).set({
          lista_espera: curr.lista_espera,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn("Fallo guardado de lista de espera en Firestore:", e);
      }
    }

    // Notificación en segundo plano a Formspree
    await sendWaitlistNotification(curr, courseTitle || courseId);
    return { success: true, lista_espera: curr.lista_espera };
  }

  function getWaitlist(userId = null) {
    let user = null;
    if (userId) {
      const users = getLocalUsers();
      user = users.find(u => u.id === userId || u.email.toLowerCase() === userId.toLowerCase());
    } else {
      user = getCurrentUser();
    }
    return user && Array.isArray(user.lista_espera) ? user.lista_espera : [];
  }

  // Actualizar la barra superior en páginas públicas
  function updateNavAuthUI() {
    const container = document.getElementById('nav-auth-container');
    if (!container) return;

    const user = getCurrentUser();
    if (!user) {
      container.innerHTML = `
        <a href="./login.html" class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700/80 hover:border-cyan-400 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/60 transition-all">
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

  // Intentar refrescar la sesión si hay usuario en caché
  if (getCurrentUser()) {
    setTimeout(() => {
      refreshCurrentUser().then(() => {
        updateNavAuthUI();
      }).catch(() => {});
    }, 500);
  }

  // Exponer API en el objeto global
  window.ElectroLabAuth = {
    getCurrentUser,
    refreshCurrentUser,
    getToken,
    login,
    register,
    logout,
    hasCourseAccess,
    getEnrolledCourses,
    getLessonProgress,
    toggleLessonCompleted,
    getUserGrades,
    adminGetUsers,
    adminToggleCourseAccess,
    adminCreateUser,
    adminDeleteUser,
    adminSaveGrades,
    adminSaveUserReportCard,
    recordStudentExamResult,
    isInWaitlist,
    addToWaitlist,
    getWaitlist,
    sendWaitlistNotification,
    updateNavAuthUI,
    getDb
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNavAuthUI);
  } else {
    updateNavAuthUI();
  }
})();
