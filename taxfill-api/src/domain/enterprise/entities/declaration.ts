import { Entity } from '@/core/entities/entity';
import { DeclarationStatus } from '../enums/declaration-status';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { IncomeList } from './income-list';
import { DeductionList } from './deduction-list';
import { Optional } from '@/core/types/optional';

interface DeclarationProps {
  userId: string;
  year: number;
  description?: string;
  status: DeclarationStatus;
  incomes: IncomeList;
  deductions: DeductionList;
  taxDue: number;
  taxRefund: number;
  originalDeclarationId?: string;
}

export class Declaration extends Entity<DeclarationProps> {

  get userId(): string {
    return this.props.userId;
  }

  get year(): number {
    return this.props.year;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get status(): DeclarationStatus {
    return this.props.status;
  }

  get incomes(): IncomeList {
    return this.props.incomes;
  }

  get deductions(): DeductionList {
    return this.props.deductions;
  }

  get taxDue(): number {
    return this.props.taxDue;
  }

  get taxRefund(): number {
    return this.props.taxRefund;
  }

  get originalDeclarationId(): string | undefined {
    return this.props.originalDeclarationId;
  }

  set incomes(incomes: IncomeList) {
    this.props.incomes = incomes;
  }

  set deductions(deductions: DeductionList) {
    this.props.deductions = deductions;
  }

  static create(props: Optional<DeclarationProps, 'incomes' | 'deductions'>, id?: UniqueEntityID): Declaration {
    return new Declaration(
      {
        ...props,
        incomes: props.incomes ?? new IncomeList(),
        deductions: props.deductions ?? new DeductionList(),
      }, id);
  }

}