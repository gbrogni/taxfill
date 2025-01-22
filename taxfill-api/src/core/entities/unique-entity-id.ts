import { randomUUID } from 'crypto';

export class UniqueEntityID {

  private readonly value: string;

  toString(): string {
    return this.value;
  }

  toValue(): string {
    return this.value;
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }

  public equals(id: UniqueEntityID): boolean {
    return id.toValue() === this.value;
  }
}