import UserModel, { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import mailService from './mail.service';
import tokenService from './token.service';
import { UserDto } from '../dtos/user.dto';
import ApiError from '../exceptions/api.error';
import userModel from '../models/user.model';
import mongoose, { HydratedDocument } from 'mongoose';
import { Token } from '../models/token.model';
import { Types } from 'mongoose';

class UserService {

  async registration(email: string, name: string, password: string) {

    const candidateEmail = await UserModel.findOne({ email });
    const candidateName = await UserModel.findOne({ name });
    if (candidateEmail) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует!`);
    }
    if (candidateName) {
      throw ApiError.BadRequest(`Пользователь с именем ${name} уже существует!`);
    }
    const hashPassword: string = await bcrypt.hash(password, 3);
    const activationLink: string = uuid.v4();
    const user = await UserModel.create({
      name,
      email,
      password: hashPassword,
      activationLink,
      creationDate: new Date(),
    });
    const apiUrl: string | undefined = process.env.API_URL;
    if (!apiUrl) throw ApiError.ServerError('Отсутствует ссылка на апи в конфигурационном файле!');

    await mailService.sendActivationMail(email, `${apiUrl}/activate/${activationLink}`);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    if (tokens) {
      await tokenService.saveToken(userDto.id, tokens.refreshToken);
    } else {
      throw ApiError.ServerError('Отсутсвует секретный ключ приложения!');
    }
    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink: string) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest('Неккоректная ссылка активации!');
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email: string, password: string) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest('Пользователь не найден!');
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль');
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    if (tokens) {
      await tokenService.saveToken(userDto.id, tokens.refreshToken);
    } else {
      throw ApiError.ServerError('Отсутсвует секретный ключ приложения!');
    }
    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken: string) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw ApiError.UnauthorizedError();

    const userData: any = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb: HydratedDocument<Token> | null = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) throw ApiError.UnauthorizedError();

    const user: HydratedDocument<User> | null = await userModel.findById(userData.id);

    if (!user) throw ApiError.UnauthorizedError();

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    if (!tokens) throw ApiError.ServerError('Не удалось сгенерировать токены!');

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    const usersDto: UserDto[] = users.map(user => new UserDto(user));
    return usersDto;
  }

  async getUserById(userId: string) {
    const user: HydratedDocument<User> | null = await UserModel.findById(userId);
    if (!user) throw ApiError.BadRequest(`Пользователя с id:${userId} не существет!`);
    const userDto: UserDto = new UserDto(user);
    return userDto;
  }
}

export default new UserService();
