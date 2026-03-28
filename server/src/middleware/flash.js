export function flashMiddleware(req, res, next) {
  if (req.session && req.session.flash) {
    res.locals.flash = req.session.flash;
    delete req.session.flash;
  }
  next();
}

export function setFlash(req, type, message) {
  req.session.flash = { type, message };
}
