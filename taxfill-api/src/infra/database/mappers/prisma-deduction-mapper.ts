import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Deduction } from '@/domain/enterprise/entities/deduction';
import { DeductionType } from '@/domain/enterprise/enums/deduction-type';
import { $Enums, Deduction as PrismaDeduction, Prisma } from '@prisma/client';

export class PrismaDeductionMapper {

  static toDomain(raw: PrismaDeduction): Deduction {
    return Deduction.create({
      type: this.mapType(raw.type),
      description: raw.description ?? '',
      amount: raw.amount,
      declarationId: raw.declarationId
    }, new UniqueEntityID(raw.id));
  }

  static toPrisma(deduction: Deduction, declarationId: string): Prisma.DeductionUncheckedCreateInput {
    return {
      type: deduction.type,
      description: deduction.description,
      amount: deduction.amount,
      declarationId: declarationId
    };
  }

  static toPrismaCreateMany(deductions: Deduction[], declarationId: string): Prisma.DeductionCreateManyArgs {
    return {
      data: deductions.map((deduction) => ({
        declarationId: declarationId,
        amount: deduction.amount,
        description: deduction.description,
        type: deduction.type,
      })),
    };
  }

  private static mapType(status: $Enums.DeductionType): DeductionType {
    switch (status) {
      case 'HEALTH':
        return DeductionType.HEALTH;
      case 'EDUCATION':
        return DeductionType.EDUCATION;
      case 'DEPENDENTS':
        return DeductionType.DEPENDENTS;
      case 'OTHER':
        return DeductionType.OTHER;
      default:
        throw new Error(`Invalid type: ${status}`);
    }
  }

}