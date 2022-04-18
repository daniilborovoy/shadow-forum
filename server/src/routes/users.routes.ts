import { Router } from 'express';
import userController from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

router.get('/users', authMiddleware, userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.put('/change-theme', authMiddleware, userController.changeTheme);

export default router;
