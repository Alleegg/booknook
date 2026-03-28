export function createLogger() {
  const ts = () => new Date().toISOString();
  return {
    info(message, meta) {
      if (meta !== undefined) console.log(`[INFO] ${ts()} ${message}`, meta);
      else console.log(`[INFO] ${ts()} ${message}`);
    },
    warn(message, meta) {
      if (meta !== undefined) console.warn(`[WARN] ${ts()} ${message}`, meta);
      else console.warn(`[WARN] ${ts()} ${message}`);
    },
    error(message, err) {
      console.error(`[ERROR] ${ts()} ${message}`, err);
    },
  };
}
