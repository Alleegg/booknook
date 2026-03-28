import { sanitizeString } from '../validation/input.js';
import { verifyAdminPassword } from '../utils/adminAuth.js';
import { setFlash } from '../middleware/flash.js';

export function createAdminAuthController({ config }) {
  return {
    getLogin(req, res) {
      if (req.session.admin) {
        return res.redirect('/admin/books');
      }
      res.render('admin/login', {
        title: 'Вход администратора',
        activePath: '/admin',
      });
    },

    postLogin(req, res) {
      const password = sanitizeString(req.body?.password, 200);
      if (verifyAdminPassword(config.adminPassword, password)) {
        req.session.admin = true;
        setFlash(req, 'success', 'Добро пожаловать');
        return res.redirect('/admin/books');
      }
      setFlash(req, 'error', 'Неверный пароль');
      return res.redirect('/admin/login');
    },

    postLogout(req, res) {
      req.session.admin = false;
      delete req.session.admin;
      setFlash(req, 'success', 'Вы вышли');
      return res.redirect('/');
    },
  };
}
