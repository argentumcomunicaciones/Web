/**
 * ElectroLab Educativa - Firestore REST & Google Sheets Integration
 * Provee persistencia serverless sin dependencias externas pesadas.
 */

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "electrolab-academia";
const API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyDXXsdNO_s18-hko4riY6pc7_RJjBDInA0";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const SCRIPT_URL = process.env.GOOGLE_SHEETS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbz84SFzFw5nEieoZ8c2tOrccjdbP4a4nj8uILIAWlRIivBIsRUHRpMVLHIFKvJfCNo/exec";

export function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === 'object') {
    return { mapValue: { fields: toFirestoreFields(val) } };
  }
  return { stringValue: String(val) };
}

export function toFirestoreFields(obj) {
  const fields = {};
  if (!obj || typeof obj !== 'object') return fields;
  for (const [key, value] of Object.entries(obj)) {
    fields[key] = toFirestoreValue(value);
  }
  return fields;
}

export function fromFirestoreValue(val) {
  if (!val || typeof val !== 'object') return val;
  if ('stringValue' in val) return val.stringValue;
  if ('booleanValue' in val) return val.booleanValue;
  if ('integerValue' in val) return parseInt(val.integerValue, 10);
  if ('doubleValue' in val) return parseFloat(val.doubleValue);
  if ('nullValue' in val) return null;
  if ('arrayValue' in val) {
    return (val.arrayValue.values || []).map(fromFirestoreValue);
  }
  if ('mapValue' in val) {
    return fromFirestoreFields(val.mapValue.fields || {});
  }
  return val;
}

export function fromFirestoreFields(fields) {
  const result = {};
  if (!fields || typeof fields !== 'object') return result;
  for (const [key, val] of Object.entries(fields)) {
    result[key] = fromFirestoreValue(val);
  }
  return result;
}

export async function getFirestoreDoc(collection, docId) {
  try {
    const url = `${BASE_URL}/${encodeURIComponent(collection)}/${encodeURIComponent(docId)}?key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const doc = await res.json();
    return fromFirestoreFields(doc.fields || {});
  } catch (err) {
    console.error(`Error getFirestoreDoc (${collection}/${docId}):`, err);
    return null;
  }
}

export async function setFirestoreDoc(collection, docId, data) {
  try {
    const url = `${BASE_URL}/${encodeURIComponent(collection)}/${encodeURIComponent(docId)}?key=${API_KEY}`;
    const fields = toFirestoreFields(data);
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error(`Error setFirestoreDoc (${collection}/${docId}):`, res.status, errText);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Error setFirestoreDoc exception (${collection}/${docId}):`, err);
    return false;
  }
}

export async function getFirestoreUser(email) {
  if (!email) return null;
  return await getFirestoreDoc('usuarios', email.toLowerCase().trim());
}

export async function upsertFirestoreStudent(email, newCourses = [], name = '', extraData = {}) {
  if (!email) return null;
  const cleanEmail = email.toLowerCase().trim();
  const existing = await getFirestoreUser(cleanEmail);

  const coursesSet = new Set(existing && Array.isArray(existing.courses) ? existing.courses : []);
  (newCourses || []).forEach(c => {
    if (c) coursesSet.add(c);
  });
  const updatedCourses = Array.from(coursesSet);

  const payload = {
    id: cleanEmail,
    email: cleanEmail,
    name: (existing && existing.name) || name || cleanEmail.split('@')[0],
    role: (existing && existing.role) || 'student',
    courses: updatedCourses,
    grades: (existing && existing.grades) || {},
    lista_espera: (existing && Array.isArray(existing.lista_espera)) ? existing.lista_espera : [],
    createdAt: (existing && existing.createdAt) || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...extraData
  };

  // Conservar contraseña si ya existía
  if (existing && existing.password) {
    payload.password = existing.password;
  }

  await setFirestoreDoc('usuarios', cleanEmail, payload);
  return payload;
}

export async function isPaymentProcessed(paymentKey) {
  if (!paymentKey) return false;
  const doc = await getFirestoreDoc('pagos_procesados', paymentKey);
  return !!doc;
}

export async function markPaymentProcessed(paymentKey, details = {}) {
  if (!paymentKey) return false;
  return await setFirestoreDoc('pagos_procesados', paymentKey, {
    key: paymentKey,
    processedAt: new Date().toISOString(),
    ...details
  });
}

export async function appendGoogleSheetsSale(email, curso, monto) {
  try {
    const url = `${SCRIPT_URL}?email=${encodeURIComponent(email)}&curso=${encodeURIComponent(curso)}&monto=${encodeURIComponent(monto)}`;
    const res = await fetch(url);
    return res.ok;
  } catch (err) {
    console.error("Error registrando venta en Google Sheets:", err);
    return false;
  }
}
