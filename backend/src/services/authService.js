import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository.js';

export class AuthService {
  async register(email, name, password) {
    // Валидация
    if (!email || !name || !password || String(password).length < 6) {
      throw new Error('Provide email, name and password (min 6 symbols)');
    }

    // Проверка существования
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new Error('Email already exists');
    }

    // Хэширование пароля
    const passwordHash = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = await userRepository.create({
      email,
      name,
      passwordHash,
    });

    // Генерация токена
    const token = this.createToken(user);

    return {
      token,
      user: this.formatUser(user),
    };
  }

  async login(email, password) {
    // Валидация
    if (!email || !password) {
      throw new Error('Provide email and password');
    }

    // Поиск пользователя
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Wrong credentials');
    }

    // Проверка пароля
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Wrong credentials');
    }

    // Генерация токена
    const token = this.createToken(user);

    return {
      token,
      user: this.formatUser(user),
    };
  }

  async getMe(userId) {
    const user = await userRepository.findByIdWithoutPassword(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  createToken(user) {
    return jwt.sign(
      { sub: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    );
  }

  formatUser(user) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}

export const authService = new AuthService();
