import { DeductionsRepository } from '@/domain/application/repositories/deductions-repository';
import { PrismaService } from '../prisma.service';
import { Deduction } from '@/domain/enterprise/entities/deduction';
import { PrismaDeductionMapper } from '../mappers/prisma-deduction-mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaDeductionsRepository implements DeductionsRepository {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(deductions: Deduction[], declarationId: string): Promise<void> {
    const data = PrismaDeductionMapper.toPrismaCreateMany(deductions, declarationId);
    await this.prisma.deduction.createMany(data);
  }

  async update(deduction: Deduction, declarationId: string): Promise<void> {
    const data = PrismaDeductionMapper.toPrisma(deduction, declarationId);
    await this.prisma.deduction.update({
      where: { id: deduction.id.toString() },
      data
    });
  }

  async findById(id: string): Promise<Deduction | null> {
    const deduction = await this.prisma.deduction.findUnique({
      where: {
        id
      }
    });

    return deduction ? PrismaDeductionMapper.toDomain(deduction) : null;
  }

  async findManyByDeclarationId(id: string): Promise<Deduction[]> {
    const deductions = await this.prisma.deduction.findMany({
      where: {
        declarationId: id
      }
    });

    return deductions.map(deduction => PrismaDeductionMapper.toDomain(deduction));
  }

  async deleteMany(deductions: Deduction[]): Promise<void> {
    if (!deductions.length) return;
    const deductionIds: string[] = deductions.map(deduction => deduction.id.toString());
    await this.prisma.deduction.deleteMany({
      where: {
        id: {
          in: deductionIds
        }
      }
    });
  }

}