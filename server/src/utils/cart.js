export function ensureCart(req) {
  const c = req.session.cart;
  if (!c || typeof c !== 'object' || Array.isArray(c)) {
    req.session.cart = {};
  }
  return req.session.cart;
}

export function cartLinesFromSession(cartObj) {
  return Object.entries(cartObj)
    .map(([bookId, quantity]) => ({
      bookId: parseInt(bookId, 10),
      quantity: parseInt(quantity, 10),
    }))
    .filter(
      (x) =>
        Number.isFinite(x.bookId) &&
        x.bookId > 0 &&
        Number.isFinite(x.quantity) &&
        x.quantity > 0,
    );
}
