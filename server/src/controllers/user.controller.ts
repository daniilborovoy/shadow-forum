import {Request, Response, NextFunction} from 'express';

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {

    } catch (err: any) {

    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {

    } catch (err: any) {

    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (err: any) {

    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (err: any) {

    }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {

    } catch (err: any) {

    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(['123', '321']);
    } catch (err: any) {

    }
  }
}

export default new UserController();