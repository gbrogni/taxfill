import { Declaration } from '@/domain/enterprise/entities/declaration';

export class DeclarationPresenter {

  static toHttp(declaration: Declaration) {
    return {
      id: declaration.id.toString(),
      year: declaration.year,
      description: declaration.description,
      status: declaration.status,
      incomes: declaration.incomes.getItems().map(income => ({
        id: income.id.toString(),
        type: income.type,
        description: income.description,
        amount: income.amount,
      })),
      deductions: declaration.deductions.getItems().map(deduction => ({
        id: deduction.id.toString(),
        type: deduction.type,
        description: deduction.description,
        amount: deduction.amount,
      })),
      taxDue: declaration.taxDue,
      taxRefund: declaration.taxRefund,
      originalDeclarationId: declaration.originalDeclarationId,
    };
  }

}