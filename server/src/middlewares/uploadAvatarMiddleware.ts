import multer from 'multer';
import path from 'path';
import { NextFunction, Request } from 'express';

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
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg, .mp4 and .jpeg format allowed!'));
    }
  },
}).single('avatar');

export default (req: Request, res: any, next: NextFunction) => {
  return upload(req, res, () => {
    // Remember, the middleware will call it's next function
    // so we can inject our controller manually as the next()
    next();
  });
};
