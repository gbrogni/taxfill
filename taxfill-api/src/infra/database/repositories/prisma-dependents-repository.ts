import { DependentsRepository } from '@/domain/application/repositories/dependents-repository';
import { Dependent } from '@/domain/enterprise/entities/dependent';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaDependentsRepository implements DependentsRepository {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(dependent: Dependent): Promise<void> {
    // const data = PrismaDependentsMapper.toPrisma(dependent);
    // await this.prisma.dependent.create({ data });
  }

}