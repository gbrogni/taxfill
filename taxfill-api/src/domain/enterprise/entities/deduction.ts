import { Entity } from '@/core/entities/entity';
import { DeductionType } from '../enums/deduction-type';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface DeductionProps {
  type: DeductionType;
  description?: string;
  amount: number;
  declarationId: string;
}

export class Deduction extends Entity<DeductionProps> {

  get type(): DeductionType {
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

  static create(props: DeductionProps, id?: UniqueEntityID): Deduction {
    return new Deduction(props, id);
  }
  
  update(props: Partial<DeductionProps>): void {
    if (props.type !== undefined) {
      this.props.type = props.type;
    }
    if (props.description !== undefined) {
      this.props.description = props.description;
    }
    if (props.amount !== undefined) {
      this.props.amount = props.amount;
    }
    if (props.declarationId !== undefined) {
      this.props.declarationId = props.declarationId;
    }
  }

}