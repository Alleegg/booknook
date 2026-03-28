import express from 'express';
import { createHomeController } from '../controllers/homeController.js';
import { createCatalogController } from '../controllers/catalogController.js';
import { createCartController } from '../controllers/cartController.js';
import { createOrderController } from '../controllers/orderController.js';
import { createAdminAuthController } from '../controllers/adminAuthController.js';
import { createAdminBooksController } from '../controllers/adminBooksController.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

export function createRouter(container) {
  const router = express.Router();

  const home = createHomeController({
    bookModel: container.bookModel,
  });
  const catalog = createCatalogController({
    bookModel: container.bookModel,
  });
  const cart = createCartController({
    bookModel: container.bookModel,
  });
  const order = createOrderController({
    bookModel: container.bookModel,
    orderModel: container.orderModel,
  });
  const adminAuth = createAdminAuthController({
    config: container.config,
  });
  const adminBooks = createAdminBooksController({
    bookModel: container.bookModel,
    genreModel: container.genreModel,
  });

  router.get('/', (req, res, next) => home.getIndex(req, res, next));
  router.post('/newsletter', (req, res, next) => home.postNewsletter(req, res, next));

  router.get('/catalog', (req, res, next) => catalog.getCatalog(req, res, next));

  router.post('/cart/add', (req, res, next) => cart.postAdd(req, res, next));
  router.get('/cart', (req, res, next) => cart.getCart(req, res, next));
  router.post('/cart/remove', (req, res, next) => cart.postRemove(req, res, next));
  router.post('/cart/clear', (req, res, next) => cart.postClear(req, res, next));

  router.post('/orders', (req, res, next) => order.postOrder(req, res, next));

  router.get('/admin/login', (req, res, next) => adminAuth.getLogin(req, res, next));
  router.post('/admin/login', (req, res, next) => adminAuth.postLogin(req, res, next));
  router.post('/admin/logout', (req, res, next) => adminAuth.postLogout(req, res, next));

  router.get('/admin/books', requireAdmin, (req, res, next) => adminBooks.list(req, res, next));
  router.get('/admin/books/new', requireAdmin, (req, res, next) => adminBooks.getNew(req, res, next));
  router.post('/admin/books', requireAdmin, (req, res, next) => adminBooks.postCreate(req, res, next));
  router.get('/admin/books/:id/edit', requireAdmin, (req, res, next) => adminBooks.getEdit(req, res, next));
  router.post('/admin/books/:id', requireAdmin, (req, res, next) => adminBooks.postUpdate(req, res, next));
  router.post('/admin/books/:id/delete', requireAdmin, (req, res, next) => adminBooks.postDelete(req, res, next));

  return router;
}
