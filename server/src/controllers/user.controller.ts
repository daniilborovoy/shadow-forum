import { Request, Response, NextFunction } from 'express';
import userService from '../service/user.service';
import { validationResult, ValidationError, Result } from 'express-validator';
import ApiError from '../exceptions/api.error';
import path from 'path';

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors: Result<ValidationError> = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequestError('validation error!', errors.array()));
      }
      const { email, password, name } = req.body;
      const userData = await userService.registration(email, name, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false, // TODO при https поменять на true
        sameSite: 'strict',
      });
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors: Result<ValidationError> = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequestError('validation error!', errors.array()));
      }
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false, // TODO при https поменять на true
        sameSite: 'strict',
      });
      return res.status(200).json(userData);
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) throw ApiError.UnauthorizedError();
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.status(200).json(token);
    } catch (err: unknown) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false, // при https поменять на true
        sameSite: 'strict',
      });
      return res.status(200).json(userData);
    } catch (err: unknown) {
      next(err);
    }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const activationLink = req.params.link;
      if (!activationLink) throw ApiError.BadRequestError('activation link missing!');
      await userService.activate(activationLink);
      if (!process.env.ORIGIN) throw ApiError.InternalServerError('origin missing!');
      return res.redirect(process.env.ORIGIN);
    } catch (err: unknown) {
      next(err);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(users);
    } catch (err: unknown) {
      next(err);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: string = req.params.id;
      if (!userId) throw ApiError.BadRequestError('user id missing!');
      const user = await userService.getUserById(userId);
      return res.status(200).json(user);
    } catch (err: unknown) {
      next(err);
    }
  }

  async changeTheme(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.body.user.id;
      const theme: 'dark' | 'light' | 'system' = req.body.theme;
      if (!userId) throw ApiError.BadRequestError('user id missing!');
      const newTheme = await userService.changeTheme(userId, theme);
      return res.status(200).json(newTheme);
    } catch (err: unknown) {
      next(err);
    }
  }

  async updateUserAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const imageFile = req.file;
      const fileName = req.body.user.id + '.webp';
      const userId = req.body.user.id;
      const uploadPath = path.resolve(__dirname, '..', 'avatars', fileName);
      await userService.saveUserAvatar(imageFile, uploadPath, userId);
      return res.status(200).json('Аватар успешно обновлён!');
    } catch (err: unknown) {
      next(err);
    }
  }
}

export default new UserController();
