import { Either, left, right } from '@/core/either';
import { Declaration } from '@/domain/enterprise/entities/declaration';
import { Deduction } from '@/domain/enterprise/entities/deduction';
import { Income } from '@/domain/enterprise/entities/income';
import { DeclarationStatus } from '@/domain/enterprise/enums/declaration-status';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DeclarationsRepository } from '../repositories/declarations-repository';
import { SubmittedDeclarationAlreadyExistsError } from '@/core/errors/errors/submitted-declaration-already-exists-error';
import { IncomeList } from '@/domain/enterprise/entities/income-list';
import { DeductionList } from '@/domain/enterprise/entities/deduction-list';

interface CreateDeclarationUseCaseRequest {
  userId: string;
  year: number;
  description?: string;
  status: DeclarationStatus;
  incomes: Income[];
  deductions: Deduction[];
  taxDue: number;
  taxRefund: number;
}

type CreateDeclarationUseCaseResponse = Either<SubmittedDeclarationAlreadyExistsError, { declaration: Declaration; }>;

@Injectable()
export class CreateDeclarationUseCase {

  constructor(
    private readonly declarationRepository: DeclarationsRepository,
  ) { }

  async execute({ userId, year, description, status, incomes = [], deductions = [], taxDue, taxRefund }: CreateDeclarationUseCaseRequest): Promise<CreateDeclarationUseCaseResponse> {
    if (status === DeclarationStatus.SUBMITTED) {
      if (incomes.length === 0 || deductions.length === 0 || incomes.some(income => income.amount <= 0) || deductions.some(deduction => deduction.amount <= 0)) {
        throw new BadRequestException('Incomes and deductions must be populated and have valid amounts when status is submitted.');
      }
      const declarations: Declaration[] = await this.declarationRepository.findByYear(year);
      const submittedDeclaration: Declaration | undefined = declarations.find(declaration => declaration.status === DeclarationStatus.SUBMITTED);
      if (submittedDeclaration) {
        return left(new SubmittedDeclarationAlreadyExistsError());
      }
    }

    const declaration: Declaration = Declaration.create({
      year: year,
      userId: userId,
      description: description,
      status: status,
      taxDue: taxDue,
      taxRefund: taxRefund,
      originalDeclarationId: undefined,
    });

    const newIncomes: Income[] = incomes.map((income: Income) => {
      return Income.create({
        amount: income.amount,
        type: income.type,
        description: income.description,
        declarationId: declaration.id.toString() ?? '',
      });
    });

    const newDeductions: Deduction[] = deductions.map((deduction: Deduction) => {
      return Deduction.create({
        amount: deduction.amount,
        type: deduction.type,
        description: deduction.description,
        declarationId: declaration.id.toString() ?? '',
      });
    });

    declaration.incomes = new IncomeList(newIncomes);
    declaration.deductions = new DeductionList(newDeductions);

    const totalIncomes: number = newIncomes.reduce((acc, income) => acc + income.amount, 0);
    const totalDeductions: number = newDeductions.reduce((acc, deduction) => acc + deduction.amount, 0);

    if (status === DeclarationStatus.SUBMITTED) {
      const taxableIncome: number = Math.max(totalIncomes - totalDeductions, 0);
      const calculatedTaxDue: number = this.calculateTaxDue(taxableIncome);
      const calculatedTaxRefund: number = Math.max(totalDeductions - calculatedTaxDue, 0);
      declaration.taxDue = calculatedTaxDue;
      declaration.taxRefund = calculatedTaxRefund;
    }

    await this.declarationRepository.createDraft(declaration, totalIncomes, totalDeductions);

    return right({ declaration });
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