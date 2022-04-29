import ApiError from '../exceptions/api.error';
import { Request, Response, NextFunction } from 'express';
import tokenService from '../service/token.service';

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader: string | undefined = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError('access token missing!'));
    }

    const accessToken = authorizationHeader.split(' ')[1];

    if (!accessToken) return next(ApiError.UnauthorizedError());
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError('Не авторизован!'));
    }
    req.body.user = userData;
    next();
  } catch (err) {}
};
