import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface DependentProps {
  name: string;
  birthDate: Date;
  relationship: string;
  userId: string;
}

export class Dependent extends Entity<DependentProps> {

  get name() {
    return this.props.name;
  }

  get birthDate() {
    return this.props.birthDate;
  }

  get relationship() {
    return this.props.relationship;
  }

  get userId() {
    return this.props.userId;
  }

  static create(props: DependentProps, id?: UniqueEntityID): Dependent {
    return new Dependent(props, id);
  }

}