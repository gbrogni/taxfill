import { DeductionType } from './enums/deduction-type';

export interface Deduction {
  id: string;
  type: DeductionType;
  description?: string;
  amount: number;
}