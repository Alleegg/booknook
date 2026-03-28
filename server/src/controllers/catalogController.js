import { sanitizeString } from '../validation/input.js';

const ALLOWED_GENRES = new Set(['all', 'fantasy', 'science', 'fiction']);

export function createCatalogController({ bookModel }) {
  return {
    async getCatalog(req, res, next) {
      try {
        const raw = sanitizeString(req.query.genre, 50) || 'all';
        const currentGenre = ALLOWED_GENRES.has(raw) ? raw : 'all';
        const books = await bookModel.findAllWithGenre(currentGenre);
        res.render('catalog', {
          title: 'BookNook — Каталог',
          activePath: '/catalog',
          books,
          currentGenre,
        });
      } catch (err) {
        next(err);
      }
    },
  };
}
