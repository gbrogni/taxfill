import { Deduction } from './deduction';
import { DeclarationStatus } from './enums/declaration-status';
import { Income } from './income';

export interface Declaration {
  id: string;
  year: number;
  description?: string;
  incomes: Income[];
  status: DeclarationStatus;
  deductions: Deduction[];
  taxDue: number;
  taxRefund: number;
  originalDeclarationId?: string;
}