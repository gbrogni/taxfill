import { WatchedList } from '@/core/entities/watched-list';
import { Income } from './income';

export class IncomeList extends WatchedList<Income> {
  public compareItems(a: Income, b: Income): boolean {
    return a.id.equals(b.id);
  }
}