import { Request, Response, NextFunction } from 'express';
import userService from '../service/user.service';
import { validationResult } from 'express-validator';
import ApiError from '../exceptions/api.error';

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
      }
      const {
        email,
        password,
        name,
      } = req.body;
      const userData = await userService.registration(email, name, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false, // при https поменять на true
        sameSite: 'strict'
      });
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        email,
        password,
      } = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false, // при https поменять на true
        sameSite: 'strict'
      });
      return res.json(userData);

    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.status(200)
        .json(token);
    } catch (e) {
      next(e);
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
        sameSite: 'strict'
      });
      return res.status(200)
        .json(userData);
    } catch (e) {
      next(e);
    }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      if (!process.env.CLIENT_URL) throw ApiError.ServerError('Отсутсвует клиентский url!');
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200)
        .json(users);
    } catch (e) {
      next(e);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.params;
      const user = await userService.getUserById(userId);
      return res.status(200)
        .json(user);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
