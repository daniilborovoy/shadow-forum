import { Router } from 'express';
import userController from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';
import uploadAvatarMiddleware from '../middlewares/uploadAvatarMiddleware';
import multer from 'multer';
import path from 'path';
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

const upload = multer({
  storage: storage,
}).single('avatar');

router.get('/users', authMiddleware, userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.put('/avatar', authMiddleware, upload, (req, res, next) => {
  res.status(200).send({ ok: 1 });
});
router.put('/change-theme', authMiddleware, userController.changeTheme);

export default router;
