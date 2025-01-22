import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface UserProps {
  name: string;
  email: string;
  password: string;
}

export class User extends Entity<UserProps> {

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  static create(props: UserProps, id?: UniqueEntityID): User {
    return new User(props, id);
  }

}