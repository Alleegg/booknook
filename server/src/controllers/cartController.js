import { parsePositiveInt } from '../validation/input.js';
import { ensureCart, cartLinesFromSession } from '../utils/cart.js';
import { setFlash } from '../middleware/flash.js';

export function createCartController({ bookModel }) {
  return {
    postAdd(req, res) {
      const bookId = parsePositiveInt(req.body?.book_id);
      const quantity = parsePositiveInt(req.body?.quantity) ?? 1;
      if (!bookId) {
        setFlash(req, 'error', 'Некорректная книга');
        return res.redirect('/catalog');
      }
      const cart = ensureCart(req);
      const prev = parseInt(cart[bookId], 10) || 0;
      cart[bookId] = prev + quantity;
      setFlash(req, 'success', 'Книга добавлена в корзину');
      return res.redirect('/cart');
    },

    async getCart(req, res, next) {
      try {
        const cart = ensureCart(req);
        const lines = cartLinesFromSession(cart);
        const ids = lines.map((l) => l.bookId);
        const books = await bookModel.findByIds(ids);
        const byId = new Map(books.map((b) => [b.id, b]));
        const rows = [];
        let total = 0;
        for (const line of lines) {
          const b = byId.get(line.bookId);
          if (!b) continue;
          const sub = Number(b.price) * line.quantity;
          total += sub;
          rows.push({
            book: b,
            quantity: line.quantity,
            subtotal: sub,
          });
        }
        res.render('cart', {
          title: 'BookNook — Корзина',
          activePath: '/cart',
          cartRows: rows,
          total,
          cartEmpty: rows.length === 0,
        });
      } catch (err) {
        next(err);
      }
    },

    postRemove(req, res) {
      const bookId = parsePositiveInt(req.body?.book_id);
      if (!bookId) {
        setFlash(req, 'error', 'Некорректный запрос');
        return res.redirect('/cart');
      }
      const cart = ensureCart(req);
      delete cart[bookId];
      setFlash(req, 'success', 'Позиция удалена');
      return res.redirect('/cart');
    },

    postClear(req, res) {
      req.session.cart = {};
      setFlash(req, 'success', 'Корзина очищена');
      return res.redirect('/cart');
    },
  };
}
