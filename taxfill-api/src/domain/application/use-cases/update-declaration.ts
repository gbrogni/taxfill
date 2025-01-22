import { Either, right } from '@/core/either';
import { Declaration } from '@/domain/enterprise/entities/declaration';
import { Deduction } from '@/domain/enterprise/entities/deduction';
import { Income } from '@/domain/enterprise/entities/income';
import { DeclarationStatus } from '@/domain/enterprise/enums/declaration-status';
import { Injectable } from '@nestjs/common';
import { DeclarationsRepository } from '../repositories/declarations-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { IncomeType } from '@/domain/enterprise/enums/income-type';
import { DeductionType } from '@/domain/enterprise/enums/deduction-type';
import { IncomeList } from '@/domain/enterprise/entities/income-list';
import { DeductionList } from '@/domain/enterprise/entities/deduction-list';

interface UpdateDeclarationUseCaseRequest {
  declarationId: string;
  description?: string;
  userId: string;
  year: number;
  status: DeclarationStatus;
  incomes: { id?: string, type: IncomeType, description?: string, amount: number; }[];
  deductions: { id?: string, type: DeductionType, description?: string, amount: number; }[];
  taxDue: number;
  taxRefund: number;
}

type UpdateDeclarationUseCaseResponse = Either<ResourceNotFoundError, { declaration: Declaration; }>;

@Injectable()
export class UpdateDeclarationUseCase {

  constructor(
    private readonly declarationsRepository: DeclarationsRepository,
  ) { }

  async execute({ declarationId, description, userId, year, status, incomes = [], deductions = [], taxDue, taxRefund }: UpdateDeclarationUseCaseRequest): Promise<UpdateDeclarationUseCaseResponse> {
    const existingDeclaration: Declaration | null = await this.declarationsRepository.findById(declarationId);
    if (!existingDeclaration) {
      throw new ResourceNotFoundError();
    }

    const existingIncomes: Income[] = existingDeclaration.incomes.getItems();
    const existingDeductions: Deduction[] = existingDeclaration.deductions.getItems();

    const incomeList = new IncomeList(existingIncomes);
    const deductionList = new DeductionList(existingDeductions);

    for (const income of incomes) {
      const incomeEntity = Income.create({ ...income, declarationId }, new UniqueEntityID(income?.id));
      incomeList.add(incomeEntity);
    }

    for (const deduction of deductions) {
      const existingDeduction = existingDeductions.find(d => d.id.toString() === deduction.id);
      if (existingDeduction) {
        existingDeduction.update(deduction);
      } else {
        const deductionEntity = Deduction.create({ ...deduction, declarationId }, new UniqueEntityID(deduction?.id));
        deductionList.add(deductionEntity);
      }
    }

    for (const existingIncome of existingIncomes) {
      if (!incomes.some(income => income.id === existingIncome.id.toString())) {
        incomeList.remove(existingIncome);
      }
    }

    for (const existingDeduction of existingDeductions) {
      if (!deductions.some(deduction => deduction.id === existingDeduction.id.toString())) {
        deductionList.remove(existingDeduction);
      }
    }

    const updatedDeclaration: Declaration = Declaration.create({
      userId,
      description,
      year,
      status,
      incomes: incomeList,
      deductions: deductionList,
      taxDue,
      taxRefund,
    }, new UniqueEntityID(declarationId));

    const totalIncomes: number = incomeList.getItems().reduce((acc, income) => acc + income.amount, 0);
    const totalDeductions: number = deductionList.getItems().reduce((acc, deduction) => acc + deduction.amount, 0);

    await this.declarationsRepository.update(updatedDeclaration, totalIncomes, totalDeductions);

    return right({ declaration: updatedDeclaration });
  }
}