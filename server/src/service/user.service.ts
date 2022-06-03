import UserModel, { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import mailService from './mail.service';
import tokenService from './token.service';
import { UserDto } from '../dtos/user.dto';
import ApiError from '../exceptions/api.error';
import userModel from '../models/user.model';
import { HydratedDocument } from 'mongoose';
import { Token } from '../models/token.model';
import sharp from 'sharp';
import fs from 'fs';

class UserService {
  private readonly apiUrl;

  constructor() {
    this.apiUrl = process.env.API_URL;
  }

  async registration(email: string, name: string, password: string) {
    const candidateEmail = await UserModel.findOne({ email });
    const candidateName = await UserModel.findOne({ name });
    if (candidateEmail) {
      throw ApiError.BadRequestError(`Пользователь с почтовым адресом ${email} уже существует!`);
    }
    if (candidateName) {
      throw ApiError.BadRequestError(`Пользователь с именем ${name} уже существует!`);
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
    const origin: string | undefined = process.env.ORIGIN;
    if (!origin)
      throw ApiError.InternalServerError('Отсутствует ссылка на origin в конфигурационном файле!');
    await mailService.sendActivationMail(email, `${origin}/activation/${activationLink}`);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    if (tokens) {
      await tokenService.saveToken(userDto.id, tokens.refreshToken);
    } else {
      throw ApiError.InternalServerError('Отсутсвует секретный ключ приложения!');
    }
    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink: string) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequestError('Неккоректная ссылка активации!');
    }
    if (!user.isActivated) {
      user.isActivated = true;
      await user.save();
    }
  }

  async login(email: string, password: string) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequestError('Пользователь не найден!');
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequestError('Неверный пароль');
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    if (tokens) {
      await tokenService.saveToken(userDto.id, tokens.refreshToken);
    } else {
      throw ApiError.InternalServerError('Отсутсвует секретный ключ приложения!');
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

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb: HydratedDocument<Token> | null = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) throw ApiError.UnauthorizedError();

    const user: HydratedDocument<User> | null = await userModel.findById(userData.id);

    if (!user) throw ApiError.UnauthorizedError();

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    if (!tokens) throw ApiError.InternalServerError('Не удалось сгенерировать токены!');

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    const usersDto: UserDto[] = users.map((user) => new UserDto(user));
    return usersDto;
  }

  async getUserById(userId: string) {
    const user: HydratedDocument<User> | null = await UserModel.findById(userId);
    if (!user) throw ApiError.BadRequestError(`user with id: ${userId} does not exist!`);
    const userDto: UserDto = new UserDto(user);
    return userDto;
  }

  async changeTheme(userId: string, theme: 'dark' | 'light' | 'system') {
    const user: HydratedDocument<User> | null = await UserModel.findById(userId);
    if (!user) throw ApiError.BadRequestError(`user with id: ${userId} does not exist!`);
    user.userTheme = theme;
    await user.save();
    return theme;
  }

  async saveUserAvatar(
    imageFile: Express.Multer.File | undefined,
    uploadPath: string,
    userId: string,
  ) {
    const user: HydratedDocument<User> | null = await UserModel.findById(userId);
    if (!user) throw ApiError.BadRequestError('пользователь не найден!');
    if (imageFile) {
      sharp(imageFile.buffer, { animated: true })
        .resize(150, 150)
        .webp({ quality: 90 })
        .toBuffer(async (err, data, info) => {
          fs.writeFileSync(uploadPath, data);
          user.avatar = `${this.apiUrl}/static/${userId}.webp`;
          await user.save();
        });
    } else {
      throw new Error('Ошибка при сохранении аватара!');
    }
  }
}

export default new UserService();
