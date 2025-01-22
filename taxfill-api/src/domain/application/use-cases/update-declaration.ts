import { Either, left, right } from '@/core/either';
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
import { SubmittedDeclarationAlreadyExistsError } from '@/core/errors/errors/submitted-declaration-already-exists-error';

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

  async execute({
    declarationId, description, userId, year, status, incomes = [], deductions = [], taxDue, taxRefund
  }: UpdateDeclarationUseCaseRequest): Promise<UpdateDeclarationUseCaseResponse> {

    if (status === DeclarationStatus.SUBMITTED) {
      const declarations: Declaration[] = await this.declarationsRepository.findByYear(year);
      const submittedDeclaration: Declaration | undefined = declarations.find(declaration => declaration.status === DeclarationStatus.SUBMITTED);
      if (submittedDeclaration) {
        return left(new SubmittedDeclarationAlreadyExistsError());
      }
    }

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

    const totalIncomes: number = incomeList.getItems().reduce((acc, income) => acc + income.amount, 0);
    const totalDeductions: number = deductionList.getItems().reduce((acc, deduction) => acc + deduction.amount, 0);

    const taxableIncome: number = Math.max(totalIncomes - totalDeductions, 0);
    const calculatedTaxDue: number = this.calculateTaxDue(taxableIncome);
    const calculatedTaxRefund: number = Math.max(totalDeductions - calculatedTaxDue, 0);

    const updatedDeclaration: Declaration = Declaration.create({
      userId,
      description,
      year,
      status,
      incomes: incomeList,
      deductions: deductionList,
      taxDue: calculatedTaxDue,
      taxRefund: calculatedTaxRefund,
    }, new UniqueEntityID(declarationId));

    await this.declarationsRepository.update(updatedDeclaration, totalIncomes, totalDeductions);

    return right({ declaration: updatedDeclaration });
  }

  private calculateTaxDue(taxableIncome: number): number {
    if (taxableIncome <= 20000) {
      return taxableIncome * 0.10;
    } else if (taxableIncome <= 50000) {
      return 2000 + (taxableIncome - 20000) * 0.20;
    } else {
      return 8000 + (taxableIncome - 50000) * 0.30;
    }
  }
}
