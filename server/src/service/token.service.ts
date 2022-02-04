import jwt, { JwtPayload } from 'jsonwebtoken';
import tokenModel, { Token } from '../models/token.model';
import { Types } from 'mongoose';
import { UserDto } from '../dtos/user.dto';
import ApiError from '../exceptions/api.error';

interface tokens {
  accessToken: string;
  refreshToken: string;
}

class TokenService {
  private secret: string | null = process.env.JWT_ACCESS_SECRET || null;

  generateTokens(payload: UserDto): tokens | null {
    if (this.secret) {
      const accessToken = jwt.sign(payload, this.secret, { expiresIn: '30m' });
      const refreshToken = jwt.sign(payload, this.secret, { expiresIn: '30d' });
      return {
        accessToken,
        refreshToken,
      };
    }
    return null;
  }

  async saveToken(userId: Types.ObjectId, refreshToken: string) {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenModel.create({
      user: userId,
      refreshToken,
    });
    return token;
  }

  async removeToken(refreshToken: string) {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, this.secret!);
      return userData;
    } catch (err: any) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      if (!this.secret) throw ApiError.ServerError('Отсутсвует секретный ключ приложения!');
      const userData = jwt.verify(token, this.secret);
      return userData;
    } catch (err) {
      return null;
    }
  }

  async findToken(refreshToken: string) {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
  }

}

export default new TokenService();
