import { Either, right } from '@/core/either';
import { Dependent } from '@/domain/enterprise/entities/dependent';
import { Injectable } from '@nestjs/common';
import { DependentsRepository } from '../repositories/dependents-repository';

interface CreateDependentUseCaseRequest {
  name: string;
  birthDate: Date;
  relationship: string;
  userId: string;
}

type CreateDependentUseCaseResponse = Either<null, { dependent: Dependent; }>;

@Injectable()
export class CreateDependentUseCase {

  constructor(
    private readonly dependentRepository: DependentsRepository
  ) { }

  async execute({ name, birthDate, relationship, userId }: CreateDependentUseCaseRequest): Promise<CreateDependentUseCaseResponse> {
    const dependent: Dependent = Dependent.create({ name, birthDate, relationship, userId });
    await this.dependentRepository.create(dependent);
    return right({ dependent });
  }

}