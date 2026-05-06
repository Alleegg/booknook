import { userRepository } from '../repositories/userRepository.js';
import { bookRepository } from '../repositories/bookRepository.js';

export class AdminService {
  async getStats() {
    const [usersCount, booksCount, adminsCount] = await Promise.all([
      userRepository.count(),
      bookRepository.count(),
      userRepository.countByRole('ADMIN'),
    ]);

    return {
      usersCount,
      booksCount,
      adminsCount,
    };
  }

  async getUsers() {
    return userRepository.findAll();
  }
}

export const adminService = new AdminService();
