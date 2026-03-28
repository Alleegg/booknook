import { validateCheckout } from '../validation/input.js';
import { ensureCart, cartLinesFromSession } from '../utils/cart.js';
import { setFlash } from '../middleware/flash.js';

export function createOrderController({ bookModel, orderModel }) {
  return {
    async postOrder(req, res, next) {
      try {
        const v = validateCheckout({
          name: req.body?.name,
          phone: req.body?.phone,
          address: req.body?.address,
        });
        if (!v.ok) {
          setFlash(req, 'error', v.error);
          return res.redirect('/cart');
        }
        const cart = ensureCart(req);
        const lines = cartLinesFromSession(cart);
        if (lines.length === 0) {
          setFlash(req, 'error', 'Корзина пуста');
          return res.redirect('/cart');
        }
        const ids = lines.map((l) => l.bookId);
        const books = await bookModel.findByIds(ids);
        const byId = new Map(books.map((b) => [b.id, b]));
        const items = [];
        for (const line of lines) {
          const b = byId.get(line.bookId);
          if (!b) continue;
          items.push({
            book_id: b.id,
            quantity: line.quantity,
            unit_price: b.price,
          });
        }
        if (items.length === 0) {
          setFlash(req, 'error', 'В корзине нет доступных книг');
          return res.redirect('/cart');
        }
        await orderModel.createOrderWithItems({
          customerName: v.value.customerName,
          phone: v.value.phone,
          address: v.value.address,
          items,
        });
        req.session.cart = {};
        setFlash(req, 'success', 'Заказ успешно оформлен. Спасибо!');
        return res.redirect('/cart');
      } catch (err) {
        next(err);
      }
    },
  };
}
