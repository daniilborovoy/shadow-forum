import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { body } from 'express-validator';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

router.post('/registration', body('email')
    .isEmail(), body('password')
    .isLength({
      min: 8,
      max: 32,
    }),
  body('name')
    .isLength({
      min: 1,
      max: 30,
    }),
  UserController.registration);
router.post('/login', UserController.login);
router.post('/logout', authMiddleware, UserController.logout);
router.get('/activate/:link', UserController.activate);
router.get('/refresh', UserController.refresh);

export default router;
