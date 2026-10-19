#!/usr/bin/env python3
"""
ElectroLab Educativa - Servidor Backend Autónomo con SQLite y Autenticación
Sin dependencias externas. Utiliza únicamente la librería estándar de Python.
"""

import http.server
import socketserver
import os
import sys
import json
import sqlite3
import hashlib
import uuid
import mimetypes
from urllib.parse import urlparse, parse_qs
from datetime import datetime

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, 'electrolab.db')

def hash_password(password: str) -> str:
    """Hash SHA-256 seguro con sal fija para el sistema"""
    salt = "electrolab_2026_salt_key"
    return hashlib.sha256((salt + password).encode('utf-8')).hexdigest()

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Crea las tablas y precarga los usuarios iniciales (Admin y Alumno Demo)"""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'student',
            created_at TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS enrollments (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            course_id TEXT NOT NULL,
            granted_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(user_id, course_id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS grades (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            course_id TEXT NOT NULL,
            final_grade TEXT DEFAULT '',
            attempts_used INTEGER DEFAULT 0,
            status TEXT DEFAULT 'Pendiente',
            graded_at TEXT DEFAULT '',
            observations TEXT DEFAULT '',
            updated_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(user_id, course_id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS waitlist (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            course_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(user_id, course_id)
        )
    ''')

    conn.commit()

    # Verificar y actualizar clave del usuario administrador
    cursor.execute("SELECT id FROM users WHERE email = ?", ('admin@electrolab.com',))
    row = cursor.fetchone()
    if not row:
        admin_id = 'usr_admin_' + uuid.uuid4().hex[:8]
        now = datetime.utcnow().isoformat()
        cursor.execute('''
            INSERT INTO users (id, name, email, password_hash, role, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (admin_id, 'Admin ElectroLab', 'admin@electrolab.com', hash_password('Lobita2026'), 'admin', now))

        # Habilitar todos los 5 cursos oficiales para el admin
        all_courses = [
            'curso-1',
            'curso-2',
            'curso-3',
            'curso-4',
            'curso-5'
        ]
        for cid in all_courses:
            cursor.execute('''
                INSERT INTO enrollments (id, user_id, course_id, granted_at)
                VALUES (?, ?, ?, ?)
            ''', (uuid.uuid4().hex, admin_id, cid, now))
        conn.commit()
        print("[DB] Usuario Administrador creado: admin@electrolab.com")
    else:
        # Asegurar que la clave de administrador esté actualizada a Lobita2026
        cursor.execute("UPDATE users SET password_hash = ? WHERE email = ?", (hash_password('Lobita2026'), 'admin@electrolab.com'))
        # Asegurar que el admin tenga los 5 cursos oficiales
        for cid in ['curso-1', 'curso-2', 'curso-3', 'curso-4', 'curso-5']:
            cursor.execute('''
                INSERT OR IGNORE INTO enrollments (id, user_id, course_id, granted_at)
                VALUES (?, ?, ?, ?)
            ''', (uuid.uuid4().hex, row['id'], cid, datetime.utcnow().isoformat()))
        conn.commit()
        print("[DB] Clave y cursos de Administrador verificados en base de datos.")

    # Verificar si existe el alumno demo
    cursor.execute("SELECT id FROM users WHERE email = ?", ('alumno@demo.com',))
    student_row = cursor.fetchone()
    if not student_row:
        student_id = 'usr_student_' + uuid.uuid4().hex[:8]
        now = datetime.utcnow().isoformat()
        cursor.execute('''
            INSERT INTO users (id, name, email, password_hash, role, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (student_id, 'Martín Gómez', 'alumno@demo.com', hash_password('alumno123'), 'student', now))

        # Habilitar Curso 1 al alumno demo
        cursor.execute('''
            INSERT INTO enrollments (id, user_id, course_id, granted_at)
            VALUES (?, ?, ?, ?)
        ''', (uuid.uuid4().hex, student_id, 'curso-1', now))

        # Cargar calificación inicial demo para Curso 1
        cursor.execute('''
            INSERT OR IGNORE INTO grades (id, user_id, course_id, final_grade, attempts_used, status, graded_at, observations, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (uuid.uuid4().hex, student_id, 'curso-1', '9/10', 1, 'Aprobado', '2026-03-20', 'Excelente proyecto integrador y resolución analítica de circuitos en CC.', now))

        conn.commit()
        print("[DB] Alumno Demo creado: alumno@demo.com (Clave: alumno123)")
    else:
        # Asegurar que el alumno demo tenga curso-1 y su calificación oficial
        cursor.execute('''
            INSERT OR IGNORE INTO enrollments (id, user_id, course_id, granted_at)
            VALUES (?, ?, ?, ?)
        ''', (uuid.uuid4().hex, student_row['id'], 'curso-1', datetime.utcnow().isoformat()))

        cursor.execute('''
            INSERT OR IGNORE INTO grades (id, user_id, course_id, final_grade, attempts_used, status, graded_at, observations, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (uuid.uuid4().hex, student_row['id'], 'curso-1', '9/10', 1, 'Aprobado', '2026-03-20', 'Excelente proyecto integrador y resolución analítica de circuitos en CC.', datetime.utcnow().isoformat()))
        conn.commit()

    conn.close()

def get_user_courses(cursor, user_id):
    cursor.execute("SELECT course_id FROM enrollments WHERE user_id = ?", (user_id,))
    rows = cursor.fetchall()
    return [r['course_id'] for r in rows]

def get_user_grades(cursor, user_id):
    cursor.execute('''
        SELECT course_id, final_grade, attempts_used, status, graded_at, observations, updated_at
        FROM grades WHERE user_id = ?
    ''', (user_id,))
    rows = cursor.fetchall()
    result = {}
    for r in rows:
        result[r['course_id']] = {
            'finalGrade': r['final_grade'] or '',
            'attemptsUsed': int(r['attempts_used'] or 0),
            'status': r['status'] or 'Pendiente',
            'gradedAt': r['graded_at'] or '',
            'observations': r['observations'] or '',
            'updatedAt': r['updated_at'] or ''
        }
    return result

def get_user_waitlist(cursor, user_id):
    cursor.execute("SELECT course_id FROM waitlist WHERE user_id = ?", (user_id,))
    rows = cursor.fetchall()
    return [r['course_id'] for r in rows]

def get_user_from_token(token):
    if not token:
        return None
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT u.id, u.name, u.email, u.role, u.created_at
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ?
    ''', (token,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return None
    user = dict(row)
    user['courses'] = get_user_courses(cursor, user['id'])
    user['grades'] = get_user_grades(cursor, user['id'])
    user['lista_espera'] = get_user_waitlist(cursor, user['id'])
    conn.close()
    return user

class ElectroLabHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def _send_json(self, data, status=200):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self):
        content_len = int(self.headers.get('Content-Length', 0))
        if content_len == 0:
            return {}
        body = self.rfile.read(content_len).decode('utf-8')
        return json.loads(body)

    def _get_auth_token(self):
        auth_header = self.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            return auth_header[7:].strip()
        return ''

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # Endpoints API
        if path == '/api/health':
            return self._send_json({'status': 'ok', 'mode': 'python-sqlite', 'timestamp': datetime.utcnow().isoformat()})

        if path == '/api/me':
            token = self._get_auth_token()
            user = get_user_from_token(token)
            if not user:
                return self._send_json({'error': 'No autorizado'}, 401)
            return self._send_json({'user': user})

        if path == '/api/admin/users':
            token = self._get_auth_token()
            user = get_user_from_token(token)
            if not user or user.get('role') != 'admin':
                return self._send_json({'error': 'Acceso exclusivo de administrador'}, 403)

            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC")
            users = []
            for row in cursor.fetchall():
                u = dict(row)
                u['courses'] = get_user_courses(cursor, u['id'])
                u['grades'] = get_user_grades(cursor, u['id'])
                u['lista_espera'] = get_user_waitlist(cursor, u['id'])
                users.append(u)
            conn.close()
            return self._send_json(users)

        # Archivos estáticos por defecto (index.html, login.html, etc.)
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == '/api/login':
            try:
                data = self._read_json()
                email = data.get('email', '').strip().lower()
                password = data.get('password', '')

                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT id, name, email, password_hash, role, created_at
                    FROM users WHERE LOWER(email) = ?
                ''', (email,))
                row = cursor.fetchone()

                if not row or row['password_hash'] != hash_password(password):
                    conn.close()
                    return self._send_json({'error': 'Correo o contraseña incorrectos'}, 401)

                user = dict(row)
                del user['password_hash']
                user['courses'] = get_user_courses(cursor, user['id'])
                user['grades'] = get_user_grades(cursor, user['id'])
                user['lista_espera'] = get_user_waitlist(cursor, user['id'])

                # Generar token de sesión
                token = 'tok_' + uuid.uuid4().hex
                now = datetime.utcnow().isoformat()
                cursor.execute('INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)', (token, user['id'], now))
                conn.commit()
                conn.close()

                return self._send_json({'token': token, 'user': user})
            except Exception as e:
                return self._send_json({'error': str(e)}, 500)

        if path == '/api/register':
            try:
                data = self._read_json()
                name = data.get('name', '').strip()
                email = data.get('email', '').strip().lower()
                password = data.get('password', '')

                if not name or not email or not password:
                    return self._send_json({'error': 'Todos los campos son obligatorios'}, 400)

                conn = get_db()
                cursor = conn.cursor()
                cursor.execute("SELECT id FROM users WHERE LOWER(email) = ?", (email,))
                if cursor.fetchone():
                    conn.close()
                    return self._send_json({'error': 'Ya existe una cuenta con este correo'}, 400)

                new_id = 'usr_' + uuid.uuid4().hex[:10]
                now = datetime.utcnow().isoformat()
                cursor.execute('''
                    INSERT INTO users (id, name, email, password_hash, role, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (new_id, name, email, hash_password(password), 'student', now))

                token = 'tok_' + uuid.uuid4().hex
                cursor.execute('INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)', (token, new_id, now))
                conn.commit()
                conn.close()

                return self._send_json({
                    'token': token,
                    'user': {
                        'id': new_id,
                        'name': name,
                        'email': email,
                        'role': 'student',
                        'courses': [],
                        'grades': {},
                        'lista_espera': []
                    }
                })
            except Exception as e:
                return self._send_json({'error': str(e)}, 500)

        if path == '/api/logout':
            token = self._get_auth_token()
            if token:
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
                conn.commit()
                conn.close()
            return self._send_json({'success': True})

        # Rutas de administración
        if path == '/api/admin/toggle-access':
            token = self._get_auth_token()
            user = get_user_from_token(token)
            if not user or user.get('role') != 'admin':
                return self._send_json({'error': 'Acceso no autorizado'}, 403)

            data = self._read_json()
            user_id = data.get('userId')
            course_id = data.get('courseId')
            enabled = bool(data.get('enabled'))

            conn = get_db()
            cursor = conn.cursor()
            if enabled:
                cursor.execute('''
                    INSERT OR IGNORE INTO enrollments (id, user_id, course_id, granted_at)
                    VALUES (?, ?, ?, ?)
                ''', (uuid.uuid4().hex, user_id, course_id, datetime.utcnow().isoformat()))
            else:
                cursor.execute('DELETE FROM enrollments WHERE user_id = ? AND course_id = ?', (user_id, course_id))

            conn.commit()
            updated_courses = get_user_courses(cursor, user_id)
            conn.close()
            return self._send_json({'success': True, 'courses': updated_courses})

        if path == '/api/admin/create-user':
            token = self._get_auth_token()
            user = get_user_from_token(token)
            if not user or user.get('role') != 'admin':
                return self._send_json({'error': 'Acceso no autorizado'}, 403)

            data = self._read_json()
            name = data.get('name', '').strip()
            email = data.get('email', '').strip().lower()
            password = data.get('password', '123456')
            courses = data.get('courses', [])
            role = data.get('role', 'student')

            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM users WHERE LOWER(email) = ?", (email,))
            if cursor.fetchone():
                conn.close()
                return self._send_json({'error': 'El correo ya está registrado'}, 400)

            user_id = 'usr_' + uuid.uuid4().hex[:10]
            now = datetime.utcnow().isoformat()
            cursor.execute('''
                INSERT INTO users (id, name, email, password_hash, role, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (user_id, name, email, hash_password(password), role, now))

            for cid in courses:
                cursor.execute('''
                    INSERT INTO enrollments (id, user_id, course_id, granted_at)
                    VALUES (?, ?, ?, ?)
                ''', (uuid.uuid4().hex, user_id, cid, now))

            conn.commit()
            conn.close()
            return self._send_json({'success': True, 'userId': user_id})

        if path == '/api/admin/save-grades':
            token = self._get_auth_token()
            user = get_user_from_token(token)
            if not user or user.get('role') != 'admin':
                return self._send_json({'error': 'Acceso no autorizado: Solo el Administrador puede asentar calificaciones'}, 403)

            data = self._read_json()
            user_id = data.get('userId')
            if not user_id:
                return self._send_json({'error': 'userId es obligatorio'}, 400)

            conn = get_db()
            cursor = conn.cursor()
            now = datetime.utcnow().isoformat()

            batch_grades = data.get('grades')
            if isinstance(batch_grades, dict):
                for cid, gdata in batch_grades.items():
                    if not isinstance(gdata, dict):
                        continue
                    final_grade = str(gdata.get('finalGrade', '')).strip()
                    attempts_used = int(gdata.get('attemptsUsed', 0))
                    status = str(gdata.get('status', 'Pendiente')).strip()
                    graded_at = str(gdata.get('gradedAt', '')).strip()
                    observations = str(gdata.get('observations', '')).strip()

                    cursor.execute('''
                        INSERT INTO grades (id, user_id, course_id, final_grade, attempts_used, status, graded_at, observations, updated_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(user_id, course_id) DO UPDATE SET
                            final_grade = excluded.final_grade,
                            attempts_used = excluded.attempts_used,
                            status = excluded.status,
                            graded_at = excluded.graded_at,
                            observations = excluded.observations,
                            updated_at = excluded.updated_at
                    ''', (uuid.uuid4().hex, user_id, cid, final_grade, attempts_used, status, graded_at, observations, now))
            else:
                course_id = data.get('courseId')
                if not course_id:
                    conn.close()
                    return self._send_json({'error': 'courseId o mapa de calificaciones requerido'}, 400)
                final_grade = str(data.get('finalGrade', '')).strip()
                attempts_used = int(data.get('attemptsUsed', 0))
                status = str(data.get('status', 'Pendiente')).strip()
                graded_at = str(data.get('gradedAt', '')).strip()
                observations = str(data.get('observations', '')).strip()

                cursor.execute('''
                    INSERT INTO grades (id, user_id, course_id, final_grade, attempts_used, status, graded_at, observations, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(user_id, course_id) DO UPDATE SET
                        final_grade = excluded.final_grade,
                        attempts_used = excluded.attempts_used,
                        status = excluded.status,
                        graded_at = excluded.graded_at,
                        observations = excluded.observations,
                        updated_at = excluded.updated_at
                ''', (uuid.uuid4().hex, user_id, course_id, final_grade, attempts_used, status, graded_at, observations, now))

            conn.commit()
            updated_grades = get_user_grades(cursor, user_id)
            conn.close()
            return self._send_json({'success': True, 'grades': updated_grades})

        if path == '/api/student/exam-result':
            token = self._get_auth_token()
            user = get_user_from_token(token)
            if not user:
                return self._send_json({'error': 'No autorizado'}, 401)

            data = self._read_json()
            course_id = data.get('courseId')
            final_grade = str(data.get('finalGrade', '')).strip()
            attempts_used = int(data.get('attemptsUsed', 1))
            status = str(data.get('status', 'Pendiente')).strip()
            graded_at = str(data.get('gradedAt', '')).strip()
            observations = str(data.get('observations', '')).strip()

            conn = get_db()
            cursor = conn.cursor()
            now = datetime.utcnow().isoformat()
            cursor.execute('''
                INSERT INTO grades (id, user_id, course_id, final_grade, attempts_used, status, graded_at, observations, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id, course_id) DO UPDATE SET
                    final_grade = excluded.final_grade,
                    attempts_used = excluded.attempts_used,
                    status = excluded.status,
                    graded_at = excluded.graded_at,
                    observations = excluded.observations,
                    updated_at = excluded.updated_at
            ''', (uuid.uuid4().hex, user['id'], course_id, final_grade, attempts_used, status, graded_at, observations, now))
            conn.commit()
            updated_grades = get_user_grades(cursor, user['id'])
            conn.close()
            return self._send_json({'success': True, 'grades': updated_grades})

        if path == '/api/waitlist':
            token = self._get_auth_token()
            user = get_user_from_token(token)
            if not user:
                return self._send_json({'error': 'No autorizado'}, 401)

            data = self._read_json()
            course_id = data.get('courseId')
            if not course_id:
                return self._send_json({'error': 'Falta courseId'}, 400)

            conn = get_db()
            cursor = conn.cursor()
            now = datetime.utcnow().isoformat()
            cursor.execute('''
                INSERT OR IGNORE INTO waitlist (id, user_id, course_id, created_at)
                VALUES (?, ?, ?, ?)
            ''', (uuid.uuid4().hex, user['id'], course_id, now))
            conn.commit()
            waitlist = get_user_waitlist(cursor, user['id'])
            conn.close()
            return self._send_json({'success': True, 'lista_espera': waitlist})

        return self._send_json({'error': 'Ruta no encontrada'}, 404)

    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path.startswith('/api/admin/user/'):
            token = self._get_auth_token()
            user = get_user_from_token(token)
            if not user or user.get('role') != 'admin':
                return self._send_json({'error': 'Acceso no autorizado'}, 403)

            target_id = path.split('/')[-1]
            if target_id == user['id']:
                return self._send_json({'error': 'No puedes eliminarte a ti mismo'}, 400)

            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM users WHERE id = ?", (target_id,))
            conn.commit()
            conn.close()
            return self._send_json({'success': True})

        return self._send_json({'error': 'Ruta no encontrada'}, 404)

def run():
    init_database()
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), ElectroLabHandler) as httpd:
        print("\n=======================================================")
        print(f"🚀 Servidor ElectroLab Educativa Activo en:")
        print(f"   http://localhost:{PORT}")
        print("-------------------------------------------------------")
        print("🔐 Credenciales del sistema:")
        print("   👑 Administrador: admin@electrolab.com | Clave: [CONFIGURADA - PRIVADA]")
        print("   🎓 Alumno Demo:   alumno@demo.com   | Clave: alumno123")
        print("=======================================================\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nDeteniendo servidor...")
            httpd.server_close()

if __name__ == '__main__':
    run()
