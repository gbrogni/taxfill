import { Either } from '@/core/either';

export abstract class Encrypter {
  abstract encrypt(payload: Record<string, unknown>, expiresIn?: string): Promise<string>;
  abstract validateRefreshToken(token: string): Promise<Either<Error, Record<string, unknown>>>;
  abstract getUserIdFromRefreshToken(token: string): Promise<string>;
  abstract generateRefreshToken(user: any): Promise<string>;
}