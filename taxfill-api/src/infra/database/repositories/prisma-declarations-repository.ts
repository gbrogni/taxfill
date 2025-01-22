import { DeclarationsRepository } from '@/domain/application/repositories/declarations-repository';
import { PrismaService } from '../prisma.service';
import { PrismaDeclarationMapper } from '../mappers/prisma-declaration-mapper';
import { Declaration } from '@/domain/enterprise/entities/declaration';
import { DeclarationStatus } from '@/domain/enterprise/enums/declaration-status';
import { Injectable } from '@nestjs/common';
import { IncomesRepository } from '@/domain/application/repositories/incomes-repository';
import { DeductionsRepository } from '@/domain/application/repositories/deductions-repository';

@Injectable()
export class PrismaDeclarationsRepository implements DeclarationsRepository {

  constructor(
    private readonly prisma: PrismaService,
    private readonly incomesRepository: IncomesRepository,
    private readonly deductionsRepository: DeductionsRepository
  ) { }

  async createDraft(declaration: Declaration, totalIncomes: number, totalDeductions: number): Promise<void> {
    const data = PrismaDeclarationMapper.toPrisma(declaration);
    data.totalIncome = totalIncomes;
    data.totalDeductions = totalDeductions;
    await this.prisma.declaration.create({ data });
    this.incomesRepository.create(
      declaration.incomes.getItems(),
      declaration.id.toString()
    )
    this.deductionsRepository.create(
      declaration.deductions.getItems(),
      declaration.id.toString()
    )
  }

  async update(declaration: Declaration, totalIncomes: number, totalDeductions: number): Promise<void> {
    const data = PrismaDeclarationMapper.toPrisma(declaration);
    data.totalIncome = totalIncomes;
    data.totalDeductions = totalDeductions;
    await this.prisma.declaration.update({
      where: { id: declaration.id.toString() },
      data
    });
    await this.deductionsRepository.deleteMany(declaration.deductions.getRemovedItems())
    await this.deductionsRepository.create(
      declaration.deductions.getNewItems(),
      declaration.id.toString()
    )
    for (const deduction of declaration.deductions.getItems()) {
      await this.deductionsRepository.update(deduction, declaration.id.toString())
    }
    await this.incomesRepository.deleteMany(declaration.incomes.getRemovedItems())
    await this.incomesRepository.create(
      declaration.incomes.getNewItems(),
      declaration.id.toString()
    )
    for (const income of declaration.incomes.getItems()) {
      await this.incomesRepository.update(income, declaration.id.toString())
    }
  }

  async find(userId: string, year?: number, status?: DeclarationStatus): Promise<Declaration[]> {
    console.log('userId', userId);
    const whereClause = {
      userId,
      ...(year && { year }),
      ...(status && { status })
    };

    const declarations = await this.prisma.declaration.findMany({
      include: {
        incomes: true,
        deductions: true
      },
      where: whereClause
    });

    return declarations?.map(declaration => PrismaDeclarationMapper.toDomain(declaration, declaration.incomes, declaration.deductions));
  }

  async findById(id: string): Promise<Declaration | null> {
    const declaration = await this.prisma.declaration.findUnique({
      include: {
        incomes: true,
        deductions: true
      },
      where: {
        id
      }
    });

    return declaration ? PrismaDeclarationMapper.toDomain(declaration, declaration.incomes, declaration.deductions) : null;
  }

  async findByYear(year: number): Promise<Declaration[]> {
    const declarations = await this.prisma.declaration.findMany({
      include: {
        incomes: true,
        deductions: true
      },
      where: {
        year
      }
    });

    return declarations.map(declaration => PrismaDeclarationMapper.toDomain(declaration, declaration.incomes, declaration.deductions));
  }

}