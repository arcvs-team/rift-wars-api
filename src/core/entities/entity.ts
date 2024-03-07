export abstract class Entity<Attributes> {
  private _id?: number | undefined
  protected attributes: Attributes

  get id (): number | undefined {
    return this._id
  }

  set id (id: number) {
    this._id = id
  }

  protected constructor (attributes: Attributes, id?: number) {
    this.attributes = attributes
    this._id = id ?? undefined
  }

  public equals (entity: Entity<unknown>) {
    if (entity === this) {
      return true
    }

    if (entity.id === this._id) {
      return true
    }

    return false
  }
}
