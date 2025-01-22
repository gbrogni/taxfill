import { Declaration } from '@/domain/enterprise/entities/declaration';
import { DeclarationStatus } from '@/domain/enterprise/enums/declaration-status';

export abstract class DeclarationsRepository {
  abstract createDraft(declaration: Declaration, totalIncomes: number, totalDeductions: number): Promise<void>;
  abstract update(declaration: Declaration, totalIncomes: number, totalDeductions: number): Promise<void>;
  abstract find(year?: number, status?: DeclarationStatus): Promise<Declaration[]>;
  abstract findById(id: string): Promise<Declaration | null>;
  abstract findByYear(year: number): Promise<Declaration[]>;
}