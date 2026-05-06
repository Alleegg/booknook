import { adminService } from '../services/adminService.js';

export class AdminController {
  async getStats(req, res) {
    try {
      const stats = await adminService.getStats();
      return res.json(stats);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await adminService.getUsers();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export const adminController = new AdminController();
