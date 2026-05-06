import { bookRepository } from '../repositories/bookRepository.js';

export class BookService {
  async getMyBooks(userId) {
    return bookRepository.findByUserId(userId);
  }

  async createBook(userId, title, description) {
    // Валидация
    if (!title || !description) {
      throw new Error('Title and description are required');
    }

    return bookRepository.create({
      title,
      description,
      ownerId: userId,
    });
  }

  async getBookById(id, userId, userRole) {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }

    // Проверка доступа
    const isOwner = book.ownerId === userId;
    const isAdmin = userRole === 'ADMIN';
    if (!isOwner && !isAdmin) {
      throw new Error('Access denied for this book');
    }

    return book;
  }
}

export const bookService = new BookService();
