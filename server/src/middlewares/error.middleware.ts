import { Request, Response, NextFunction } from 'express';
import ApiError from '../exceptions/api.error';

export default (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status)
      .json({
        message: err.message,
        errors: err.errors,
      });
  } else {
    res.status(500)
      .json({ message: `Произошла непредвиденная ошибка: ${err}` });
  }
}
