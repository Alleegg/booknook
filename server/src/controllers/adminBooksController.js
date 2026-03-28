import { parsePositiveInt } from '../validation/input.js';
import { validateBookPayload } from '../validation/input.js';
import { setFlash } from '../middleware/flash.js';

export function createAdminBooksController({ bookModel, genreModel }) {
  return {
    async list(req, res, next) {
      try {
        const books = await bookModel.findAllWithGenre('all');
        res.render('admin/books-list', {
          title: 'Админ — книги',
          activePath: '/admin/books',
          books,
        });
      } catch (err) {
        next(err);
      }
    },

    async getNew(req, res, next) {
      try {
        const genres = await genreModel.findAll();
        res.render('admin/book-form', {
          title: 'Новая книга',
          activePath: '/admin/books',
          genres,
          book: null,
          formAction: '/admin/books',
        });
      } catch (err) {
        next(err);
      }
    },

    async postCreate(req, res, next) {
      try {
        const v = validateBookPayload(req.body);
        if (!v.ok) {
          setFlash(req, 'error', v.error);
          return res.redirect('/admin/books/new');
        }
        const genre = await genreModel.findById(v.value.genreId);
        if (!genre) {
          setFlash(req, 'error', 'Жанр не найден');
          return res.redirect('/admin/books/new');
        }
        await bookModel.create(v.value);
        setFlash(req, 'success', 'Книга добавлена');
        return res.redirect('/admin/books');
      } catch (err) {
        next(err);
      }
    },

    async getEdit(req, res, next) {
      try {
        const id = parsePositiveInt(req.params.id);
        if (!id) {
          setFlash(req, 'error', 'Некорректный id');
          return res.redirect('/admin/books');
        }
        const book = await bookModel.findById(id);
        if (!book) {
          setFlash(req, 'error', 'Книга не найдена');
          return res.redirect('/admin/books');
        }
        const genres = await genreModel.findAll();
        res.render('admin/book-form', {
          title: 'Редактирование книги',
          activePath: '/admin/books',
          genres,
          book,
          formAction: `/admin/books/${id}`,
        });
      } catch (err) {
        next(err);
      }
    },

    async postUpdate(req, res, next) {
      try {
        const id = parsePositiveInt(req.params.id);
        if (!id) {
          setFlash(req, 'error', 'Некорректный id');
          return res.redirect('/admin/books');
        }
        const v = validateBookPayload(req.body);
        if (!v.ok) {
          setFlash(req, 'error', v.error);
          return res.redirect(`/admin/books/${id}/edit`);
        }
        const genre = await genreModel.findById(v.value.genreId);
        if (!genre) {
          setFlash(req, 'error', 'Жанр не найден');
          return res.redirect(`/admin/books/${id}/edit`);
        }
        const updated = await bookModel.update(id, v.value);
        if (!updated) {
          setFlash(req, 'error', 'Книга не найдена');
          return res.redirect('/admin/books');
        }
        setFlash(req, 'success', 'Книга обновлена');
        return res.redirect('/admin/books');
      } catch (err) {
        next(err);
      }
    },

    async postDelete(req, res, next) {
      try {
        const id = parsePositiveInt(req.params.id);
        if (!id) {
          setFlash(req, 'error', 'Некорректный id');
          return res.redirect('/admin/books');
        }
        const ok = await bookModel.deleteById(id);
        if (!ok) {
          setFlash(req, 'error', 'Книга не найдена');
          return res.redirect('/admin/books');
        }
        setFlash(req, 'success', 'Книга удалена');
        return res.redirect('/admin/books');
      } catch (err) {
        if (err && err.code === '23503') {
          setFlash(req, 'error', 'Нельзя удалить: книга есть в заказах');
          return res.redirect('/admin/books');
        }
        next(err);
      }
    },
  };
}
