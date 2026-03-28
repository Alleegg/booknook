import crypto from 'crypto';

function hashUtf8(s) {
  return crypto.createHash('sha256').update(String(s), 'utf8').digest();
}

export function verifyAdminPassword(expected, provided) {
  if (expected == null || provided == null) return false;
  const a = hashUtf8(expected);
  const b = hashUtf8(provided);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
