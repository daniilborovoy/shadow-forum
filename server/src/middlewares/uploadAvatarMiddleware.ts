import multer from 'multer';
import { Request } from 'express';
import ApiError from '../exceptions/api.error';

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(null, false);
    return callback(ApiError.BadRequestError('Разрешено использовать только файлы изображений!'));
  }
};

export default multer({
  fileFilter,
}).single('avatar');
