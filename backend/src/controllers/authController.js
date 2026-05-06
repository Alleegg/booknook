import { authService } from '../services/authService.js';

export class AuthController {
  async register(req, res) {
    try {
      const { email, name, password } = req.body;
      const result = await authService.register(email, name, password);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return res.json(result);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }

  async getMe(req, res) {
    try {
      const userId = Number(req.user.sub);
      const user = await authService.getMe(userId);
      return res.json(user);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }
}

export const authController = new AuthController();
