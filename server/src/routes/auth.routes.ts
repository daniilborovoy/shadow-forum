import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { validateRegistrationBody } from '../validators/auth.validators';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

router.post('/registration', validateRegistrationBody(), UserController.registration);
router.post('/login', UserController.login);
router.post('/logout', authMiddleware, UserController.logout);
router.get('/activate/:link', UserController.activate);
router.get('/refresh', UserController.refresh);

export default router;
