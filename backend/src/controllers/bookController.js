import { bookService } from '../services/bookService.js';

export class BookController {
  async getMyBooks(req, res) {
    try {
      const userId = Number(req.user.sub);
      const books = await bookService.getMyBooks(userId);
      return res.json(books);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async createBook(req, res) {
    try {
      const userId = Number(req.user.sub);
      const { title, description } = req.body;
      const book = await bookService.createBook(userId, title, description);
      return res.status(201).json(book);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getBookById(req, res) {
    try {
      const id = Number(req.params.id);
      const userId = Number(req.user.sub);
      const userRole = req.user.role;
      const book = await bookService.getBookById(id, userId, userRole);
      return res.json(book);
    } catch (error) {
      if (error.message === 'Book not found') {
        return res.status(404).json({ message: error.message });
      }
      return res.status(403).json({ message: error.message });
    }
  }
}

export const bookController = new BookController();
