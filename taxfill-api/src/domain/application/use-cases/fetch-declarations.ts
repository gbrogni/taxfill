import { Either, right } from '@/core/either';
import { Declaration } from '@/domain/enterprise/entities/declaration';
import { DeclarationStatus } from '@/domain/enterprise/enums/declaration-status';
import { Injectable } from '@nestjs/common';
import { DeclarationsRepository } from '../repositories/declarations-repository';

interface FetchDeclarationsUseCaseRequest {
  year?: number;
  status?: DeclarationStatus;
}

type FetchDeclarationsUseCaseResponse = Either<null, Declaration[]>;

@Injectable()
export class FetchDeclarationsUseCase {

  constructor(
    private readonly declarationsRepository: DeclarationsRepository
  ) { }

  async execute({ year, status }: FetchDeclarationsUseCaseRequest): Promise<FetchDeclarationsUseCaseResponse> {
    const declarations: Declaration[] = await this.declarationsRepository.find(year, status);
    return right(declarations);
  }
}