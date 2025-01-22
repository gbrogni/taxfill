import { Either, right } from '@/core/either';
import { Income } from '@/domain/enterprise/entities/income';
import { Injectable } from '@nestjs/common';
import { IncomesRepository } from '../repositories/incomes-repository';

interface CreateIncomeUseCaseRequest {
  declarationId: string;
  incomes: Income[];
}

type CreateIncomeUseCaseResponse = Either<null, { incomes: Income[]; }>;

@Injectable()
export class CreateIncomeUseCase {

  constructor(
    private readonly incomeRepository: IncomesRepository
  ) { }

  async execute({ incomes, declarationId }: CreateIncomeUseCaseRequest): Promise<CreateIncomeUseCaseResponse> {
    // const recentlyAddedIncomes: Income[] = await this.incomeRepository.findMany(incomes.map(income => income.id.toString()));

    // const newIncomes: Income[] = recentlyAddedIncomes.map((income: Income) => {
    //   return Income.create({
    //     amount: income.amount,
    //     type: income.type,
    //     description: income.description,
    //     declarationId: declarationId ?? ''
    //   })
    // })

    const createdIncomes: Income[] = [];
    // for (const incomeData of newIncomes) {
    //   await this.incomeRepository.create(incomeData, declarationId);
    //   createdIncomes.push(incomeData);
    // }
    return right({ incomes: createdIncomes });
  }
}