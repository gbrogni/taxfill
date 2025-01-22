import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { IncomeType } from '../enums/income-type';
import { Entity } from '@/core/entities/entity';

interface IncomeProps {
  type: IncomeType;
  description?: string;
  amount: number;
  declarationId: string;
}

export class Income extends Entity<IncomeProps> {

  get type(): IncomeType {
    return this.props.type;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get amount(): number {
    return this.props.amount;
  }

  get declarationId(): string {
    return this.props.declarationId;
  }

  static create(props: IncomeProps, id?: UniqueEntityID) {
    return new Income(props, id);
  }

}