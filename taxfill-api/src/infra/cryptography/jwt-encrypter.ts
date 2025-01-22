import { Either, left, right } from '@/core/either';
import { Encrypter } from '@/domain/application/cryptography/encrypter';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private readonly jwtService: JwtService) { }

  encrypt(payload: Record<string, unknown>, expiresIn?: string): Promise<string> {
    if (!expiresIn) {
      return this.jwtService.signAsync(payload);
    }
    return this.jwtService.signAsync(payload, { expiresIn });
  }

  async validateRefreshToken(token: string): Promise<Either<Error, Record<string, unknown>>> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return right(decoded);
    } catch (error) {
      return left(new Error('Invalid refresh token'));
    }
  }

  async getUserIdFromRefreshToken(token: string): Promise<string> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return decoded.sub;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async generateRefreshToken(user: any): Promise<string> {
    return this.encrypt({ sub: user.id, role: user.role }, '7d');
  }

}