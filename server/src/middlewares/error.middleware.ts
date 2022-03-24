import { Request, Response, NextFunction } from 'express';
import ApiError from '../exceptions/api.error';

export default (error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ApiError) {
    return res.status(error.status)
      .json({
        message: error.message,
        errors: error.errors,
      });
  } else {
    res.status(500)
      .json({ message: `Unexpected error: ${error}` });
  }
}
