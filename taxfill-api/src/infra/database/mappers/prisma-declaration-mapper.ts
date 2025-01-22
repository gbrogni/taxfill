import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Declaration } from '@/domain/enterprise/entities/declaration';
import { DeclarationStatus } from '@/domain/enterprise/enums/declaration-status';
import { $Enums, Declaration as PrismaDeclaration, Prisma, Deduction as PrismaDeduction, Income as PrismaIncome } from '@prisma/client';
import { PrismaIncomeMapper } from './prisma-income-mapper';
import { PrismaDeductionMapper } from './prisma-deduction-mapper';
import { Income } from '@/domain/enterprise/entities/income';
import { Deduction } from '@/domain/enterprise/entities/deduction';
import { IncomeList } from '@/domain/enterprise/entities/income-list';
import { DeductionList } from '@/domain/enterprise/entities/deduction-list';

export class PrismaDeclarationMapper {

  static toDomain(raw: PrismaDeclaration, incomes: PrismaIncome[], deductions: PrismaDeduction[]): Declaration {
    const mappedIncomes: Income[] = incomes.map(income => PrismaIncomeMapper.toDomain(income));
    const incomeList = new IncomeList(mappedIncomes);
    const mappedDeductions: Deduction[] = deductions.map(deduction => PrismaDeductionMapper.toDomain(deduction));
    const deductionsList = new DeductionList(mappedDeductions);

    return Declaration.create({
      year: raw.year,
      description: raw.description ?? '',
      status: this.mapStatus(raw.status),
      taxDue: raw.taxDue,
      taxRefund: raw.taxRefund,
      userId: raw.userId,
      originalDeclarationId: raw.originalDeclarationId ?? '',
      incomes: incomeList,
      deductions: deductionsList
    }, new UniqueEntityID(raw.id));
  }

  static toPrisma(declaration: Declaration): Prisma.DeclarationUncheckedCreateInput {
    return {
      id: declaration.id.toString(),
      year: declaration.year,
      description: declaration.description,
      status: declaration.status,
      taxDue: declaration.taxDue,
      taxRefund: declaration.taxRefund,
      userId: declaration.userId,
      originalDeclarationId: declaration.originalDeclarationId,
    };
  }

  private static mapStatus(status: $Enums.DeclarationStatus): DeclarationStatus {
    switch (status) {
      case 'DRAFT':
        return DeclarationStatus.DRAFT;
      case 'SUBMITTED':
        return DeclarationStatus.SUBMITTED;
      default:
        throw new Error(`Invalid status: ${status}`);
    }
  }

}