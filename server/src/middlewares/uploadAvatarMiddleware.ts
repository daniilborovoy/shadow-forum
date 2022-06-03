import multer from 'multer';
import { Request } from 'express';
import ApiError from '../exceptions/api.error';

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) => {
  if ((file.mimetype.startsWith('image'), file.mimetype !== 'image/x-icon')) {
    callback(null, true);
  } else {
    callback(null, false);
    if (file.mimetype === 'image/x-icon') {
      return callback(
        ApiError.BadRequestError('Использовать изображения типа ico для аватара запрещено!'),
      );
    }
    return callback(ApiError.BadRequestError('Разрешено использовать только файлы изображений!'));
  }
};

export default multer({
  fileFilter,
}).single('avatar');
