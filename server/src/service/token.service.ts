import jwt from 'jsonwebtoken';
import tokenModel from '../models/token.model';
import { Types } from 'mongoose';
import { UserDto } from '../dtos/user.dto';

interface tokens {
  accessToken: string;
  refreshToken: string;
}

class TokenService {

  private secret: string | undefined = process.env.JWT_ACCESS_SECRET;

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

  validateAccessToken(token: string): UserDto | null {
    try {
      if (this.secret) {
        const userData = jwt.verify(token, this.secret) as UserDto;
        return userData;
      }
      return null;
    } catch (err: unknown) {
      return null;
    }
  }

  validateRefreshToken(token: string): UserDto | null {
    try {
      if (this.secret) {
        const userData = jwt.verify(token, this.secret) as UserDto;
        return userData;
      }
      return null;
    } catch (err: unknown) {
      return null;
    }
  }

  async findToken(refreshToken: string) {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
  }

}

export default new TokenService();
