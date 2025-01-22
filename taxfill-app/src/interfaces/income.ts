import { IncomeType } from './enums/income-type';

export interface Income {
  id: string;
  type: IncomeType;
  description?: string;
  amount: number;
}