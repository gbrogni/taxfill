import { UniqueEntityID } from './unique-entity-id';

export abstract class Entity<Props> {

  private readonly _id: UniqueEntityID;
  protected props: Props;

  get id(): UniqueEntityID {
    return this._id;
  }

  protected constructor(props: any, id?: UniqueEntityID) {
    this.props = props;
    this._id = id ?? new UniqueEntityID(id);
  }

  public equals(entity?: Entity<any>): boolean {
    if (!entity || !(entity instanceof Entity)) {
      return false;
    }

    return entity.id.equals(this._id);
  }
}