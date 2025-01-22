import { Either, left, right } from '@/core/either';
import { WrongCredentialsError } from '../errors/wrong-credentials-error';
import { Injectable } from '@nestjs/common';
import { Encrypter } from '../cryptography/encrypter';
import { HashComparer } from '../cryptography/hash-comparer';
import { UsersRepository } from '../repositories/users-repository';
import { User } from '@/domain/enterprise/entities/user';

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUserUseCaseResponse = Either<WrongCredentialsError, { accessToken: string; }>;

@Injectable()
export class AuthenticateUserUseCase {

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) { }

  async execute({ email, password }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user: User | null = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid: boolean = await this.hashComparer.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken: string = await this.encrypter.encrypt({
      sub: user.id.toString(),
    });

    return right({
      accessToken,
    });
  }

}