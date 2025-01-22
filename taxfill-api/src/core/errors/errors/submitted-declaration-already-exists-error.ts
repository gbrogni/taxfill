import { UseCaseError } from '@/core/errors/use-case-error';

export class SubmittedDeclarationAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super('Submitted declaration already exists');
  }
}
