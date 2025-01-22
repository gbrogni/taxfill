import { WatchedList } from '@/core/entities/watched-list';
import { Deduction } from './deduction';

export class DeductionList extends WatchedList<Deduction> {
  public compareItems(a: Deduction, b: Deduction): boolean {
    return a.id.equals(b.id);
  }
}