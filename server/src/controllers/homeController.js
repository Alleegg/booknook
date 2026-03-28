import { validateNewsletterEmail } from '../validation/input.js';
import { setFlash } from '../middleware/flash.js';

export function createHomeController({ bookModel }) {
  return {
    async getIndex(req, res, next) {
      try {
        const all = await bookModel.findAllWithGenre('all');
        const featuredBooks = all.slice(0, 3);
        res.render('index', {
          title: 'BookNook — Главная',
          activePath: '/',
          featuredBooks,
        });
      } catch (err) {
        next(err);
      }
    },

    postNewsletter(req, res) {
      const result = validateNewsletterEmail(req.body?.email);
      if (!result.ok) {
        setFlash(req, 'error', result.error);
        return res.redirect('/');
      }
      setFlash(req, 'success', 'Спасибо за подписку! Проверьте почту.');
      return res.redirect('/');
    },
  };
}
