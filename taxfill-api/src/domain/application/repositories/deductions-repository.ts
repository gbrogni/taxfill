import { Deduction } from '@/domain/enterprise/entities/deduction';

export abstract class DeductionsRepository {
  abstract create(deductions: Deduction[], declarationId: string): Promise<void>;
  abstract update(deduction: Deduction, declarationId: string): Promise<void>;
  abstract findManyByDeclarationId(id: string): Promise<Deduction[]>;
  abstract findById(id: string): Promise<Deduction | null>;
  abstract deleteMany(deductions: Deduction[]): Promise<void>;
}