import { Income } from '@/domain/enterprise/entities/income';

export abstract class IncomesRepository {
  abstract create(incomes: Income[], declarationId: string): Promise<void>;
  abstract update(income: Income, declarationId: string): Promise<void>;
  abstract findManyByDeclarationId(incomeId: string): Promise<Income[]>;
  abstract findById(id: string): Promise<Income | null>;
  abstract deleteMany(incomes: Income[]): Promise<void>;
}