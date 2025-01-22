import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Income } from '@/domain/enterprise/entities/income';
import { IncomeType } from '@/domain/enterprise/enums/income-type';
import { $Enums, Income as PrismaIncome, Prisma } from '@prisma/client';

export class PrismaIncomeMapper {

  static toDomain(raw: PrismaIncome): Income {
    return Income.create({
      type: this.mapType(raw.type),
      description: raw.description ?? '',
      amount: raw.amount,
      declarationId: raw.declarationId,
    }, new UniqueEntityID(raw.id));
  }

  static toPrisma(income: Income, declarationId: string): Prisma.IncomeUncheckedCreateInput {
    return {
      id: income.id.toString(),
      type: income.type,
      description: income.description,
      amount: income.amount,
      declarationId: declarationId
    };
  }

  static toPrismaCreateMany(incomes: Income[], declarationId: string): Prisma.IncomeCreateManyArgs {
    return {
      data: incomes.map((income) => ({
        id: income.id.toString(),
        declarationId: declarationId,
        amount: income.amount,
        description: income.description,
        type: income.type,
      })),
    };
  }

  private static mapType(status: $Enums.IncomeType): IncomeType {
    switch (status) {
      case 'SALARY':
        return IncomeType.SALARY;
      case 'RENT':
        return IncomeType.RENT;
      case 'INVESTMENT':
        return IncomeType.INVESTMENT;
      case 'OTHER':
        return IncomeType.OTHER;
      default:
        throw new Error(`Invalid type: ${status}`);
    }
  }

}