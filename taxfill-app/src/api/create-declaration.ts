import { Deduction } from '@/interfaces/deduction';
import { DeclarationStatus } from '@/interfaces/enums/declaration-status';
import { Income } from '@/interfaces/income';
import { api } from '@/lib/axios';

export interface CreateDeclarationBody {
  year: number;
  status: DeclarationStatus;
  incomes: Income[];
  deductions: Deduction[];
  taxDue: number;
  taxRefund: number;
}

export async function createDeclaration({
  year,
  status,
  incomes,
  deductions,
  taxDue,
  taxRefund,
}: CreateDeclarationBody, token: string) {
  await api.post('/declarations', {
    year,
    status,
    incomes,
    deductions,
    taxDue,
    taxRefund,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}