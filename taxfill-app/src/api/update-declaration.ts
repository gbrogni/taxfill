import { Deduction } from '@/interfaces/deduction';
import { DeclarationStatus } from '@/interfaces/enums/declaration-status';
import { Income } from '@/interfaces/income';
import { api } from '@/lib/axios';

export interface CreateDeclarationBody {
  id: string;
  year: number;
  description: string;
  status: DeclarationStatus;
  incomes: Income[];
  deductions: Deduction[];
  taxDue: number;
  taxRefund: number;
}

export async function updateDeclaration({
  id,
  year,
  description,
  status,
  incomes,
  deductions,
  taxDue,
  taxRefund,
}: CreateDeclarationBody, token: string) {
  await api.put(`/declarations/${id}`, {
    year,
    description,
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