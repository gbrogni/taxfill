import { IncomesRepository } from '@/domain/application/repositories/incomes-repository';
import { Income } from '@/domain/enterprise/entities/income';
import { PrismaService } from '../prisma.service';
import { PrismaIncomeMapper } from '../mappers/prisma-income-mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaIncomesRepository implements IncomesRepository {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(incomes: Income[], declarationId: string): Promise<void> {
    const data = PrismaIncomeMapper.toPrismaCreateMany(incomes, declarationId);
    await this.prisma.income.createMany(data);
  }

  async update(income: Income, declarationId: string): Promise<void> {
    const data = PrismaIncomeMapper.toPrisma(income, declarationId);
    await this.prisma.income.update({
      where: { id: income.id.toString() },
      data
    });
  }

  async findById(id: string): Promise<Income | null> {
    const income = await this.prisma.income.findUnique({
      where: {
        id
      }
    });

    return income ? PrismaIncomeMapper.toDomain(income) : null;
  }

  async findManyByDeclarationId(declarationId: string): Promise<Income[]> {
    const incomes = await this.prisma.income.findMany({
      where: {
        declarationId: declarationId
      }
    });

    return incomes.map(income => PrismaIncomeMapper.toDomain(income));
  }

  async deleteMany(incomes: Income[]): Promise<void> {
    if (!incomes.length) return;
    const incomeIds = incomes.map(income => income.id.toString());
    await this.prisma.income.deleteMany({
      where: {
        id: {
          in: incomeIds
        }
      }
    });
  }

}