import { Either, left, right } from '@/core/either';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';
import { User } from '../../enterprise/entities/user';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { HashGenerator } from '../cryptography/hash-generator';

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type CreateUserUseCaseResponse = Either<UserAlreadyExistsError, { user: User; }>;

@Injectable()
export class CreateUserUseCase {

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashGenerator: HashGenerator
  ) { }

  async execute({ name, email, password }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameEmail: User | null = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email));
    }

    const hashedPassword: string = await this.hashGenerator.hash(password);
    const user: User = User.create({ name, email, password: hashedPassword });

    await this.usersRepository.create(user);

    return right({ user });
  }

}