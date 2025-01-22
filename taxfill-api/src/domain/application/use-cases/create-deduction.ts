import { Either, right } from '@/core/either';
import { Deduction } from '@/domain/enterprise/entities/deduction';
import { Injectable } from '@nestjs/common';
import { DeductionsRepository } from '../repositories/deductions-repository';

interface CreateDeductionUseCaseRequest {
  deductions: Deduction[];
  declarationId: string;
}

type CreateDeductionUseCaseResponse = Either<null, { deductions: Deduction[]; }>;

@Injectable()
export class CreateDeductionUseCase {

  constructor(
    private readonly deductionRepository: DeductionsRepository,
  ) { }

  async execute({ deductions, declarationId }: CreateDeductionUseCaseRequest): Promise<CreateDeductionUseCaseResponse> {
    const createdDeductions: Deduction[] = [];
    // for (const deductionData of deductions) {
    //   const deduction: Deduction = Deduction.create(deductionData);
    //   await this.deductionRepository.create(deduction, declarationId);
    //   createdDeductions.push(deduction);
    // }
    return right({ deductions: createdDeductions });
  }
}