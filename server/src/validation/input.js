const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function sanitizeString(str, maxLen) {
  if (str == null) return '';
  let s = String(str).trim();
  if (s.length > maxLen) s = s.slice(0, maxLen);
  return s;
}

export function parsePositiveInt(value) {
  const n = parseInt(String(value), 10);
  if (!Number.isFinite(n) || n < 1) return null;
  return n;
}

export function parseNonNegativeMoney(value) {
  const raw = String(value ?? '')
    .trim()
    .replace(',', '.');
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}

export function validateNewsletterEmail(email) {
  const e = sanitizeString(email, 254);
  if (!e) return { ok: false, error: 'Введите email' };
  if (!EMAIL_RE.test(e)) return { ok: false, error: 'Некорректный email' };
  return { ok: true, value: e };
}

export function validateCheckout({ name, phone, address }) {
  const customerName = sanitizeString(name, 200);
  const phoneClean = sanitizeString(phone, 50).replace(/\s/g, '');
  const addressText = sanitizeString(address, 2000);
  if (!customerName) return { ok: false, error: 'Укажите имя' };
  if (phoneClean.length < 10) return { ok: false, error: 'Укажите корректный телефон' };
  if (!addressText) return { ok: false, error: 'Укажите адрес' };
  return { ok: true, value: { customerName, phone: phoneClean, address: addressText } };
}

export function validateBookPayload(body) {
  const title = sanitizeString(body.title, 255);
  const author = sanitizeString(body.author, 255);
  const genreId = parsePositiveInt(body.genre_id);
  const price = parseNonNegativeMoney(body.price);
  if (!title) return { ok: false, error: 'Укажите название' };
  if (!author) return { ok: false, error: 'Укажите автора' };
  if (!genreId) return { ok: false, error: 'Выберите жанр' };
  if (price === null) return { ok: false, error: 'Укажите цену ≥ 0' };
  return { ok: true, value: { title, author, genreId, price } };
}
