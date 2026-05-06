import { prisma } from '../prisma.js';

export class UserRepository {
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByIdWithoutPassword(id) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  async create(data) {
    return prisma.user.create({ data });
  }

  async findAll() {
    return prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async count() {
    return prisma.user.count();
  }

  async countByRole(role) {
    return prisma.user.count({ where: { role } });
  }
}

export const userRepository = new UserRepository();
