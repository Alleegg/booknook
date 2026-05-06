import { prisma } from '../prisma.js';

export class BookRepository {
  async findByUserId(userId) {
    return prisma.book.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id) {
    return prisma.book.findUnique({ where: { id } });
  }

  async create(data) {
    return prisma.book.create({ data });
  }

  async count() {
    return prisma.book.count();
  }
}

export const bookRepository = new BookRepository();
