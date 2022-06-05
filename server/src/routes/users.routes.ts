import { Router } from 'express';
import userController from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';
import uploadAvatarMiddleware from '../middlewares/uploadAvatarMiddleware';

const router = Router();

router.get('/users', authMiddleware, userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.put('/avatar', uploadAvatarMiddleware, authMiddleware, userController.updateUserAvatar);
router.put('/change-theme', authMiddleware, userController.changeTheme);
router.delete('/delete-user-account', authMiddleware, userController.deleteUserAccount);

export default router;
