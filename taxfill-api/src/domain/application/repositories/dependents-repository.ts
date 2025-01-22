import { Dependent } from '@/domain/enterprise/entities/dependent';

export abstract class DependentsRepository {
  abstract create(dependent: Dependent): Promise<void>;
}