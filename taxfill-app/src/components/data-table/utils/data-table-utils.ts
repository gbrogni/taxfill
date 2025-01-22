export interface DataTableColumn<TData> {
  id: keyof TData;
  headerText: string;
}

export class ColumnBuilder<TData> {
  private readonly column: DataTableColumn<TData>;

  constructor(id: keyof TData, headerText: string) {
    this.column = { id, headerText };
  }

  build(): DataTableColumn<TData> {
    return this.column;
  }
}

export function createColumn<TData>(id: keyof TData, headerText: string): ColumnBuilder<TData> {
  return new ColumnBuilder<TData>(id, headerText);
}

export function createCustomCellColumn<TData>(
  id: keyof TData,
  headerText: string,
): ColumnBuilder<TData> {
  return new ColumnBuilder<TData>(id, headerText);
}