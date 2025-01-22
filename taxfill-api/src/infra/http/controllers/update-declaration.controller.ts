import { DeductionType } from '@/domain/enterprise/enums/deduction-type';
import { IncomeType } from '@/domain/enterprise/enums/income-type';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { UpdateDeclarationUseCase } from '@/domain/application/use-cases/update-declaration';
import { DeclarationStatus } from '@/domain/enterprise/enums/declaration-status';

const incomeSchema = z.object({
  id: z.string().optional(),
  type: z.nativeEnum(IncomeType),
  description: z.string().optional(),
  amount: z.number(),
});

const deductionSchema = z.object({
  id: z.string().optional(),
  type: z.nativeEnum(DeductionType),
  description: z.string().optional(),
  amount: z.number(),
});

const updateDeclarationBodySchema = z.object({
  year: z.number(),
  description: z.string().optional(),
  status: z.nativeEnum(DeclarationStatus),
  incomes: z.array(incomeSchema),
  deductions: z.array(deductionSchema),
  taxDue: z.number(),
  taxRefund: z.number()
});

const bodyValidationPipe = new ZodValidationPipe(updateDeclarationBodySchema);

type UpdateDeclarationBodySchema = z.infer<typeof updateDeclarationBodySchema>;

@Controller('/declarations/:id')
export class UpdateDeclarationController {

  constructor(
    private readonly updateDeclarationUseCase: UpdateDeclarationUseCase
  ) { }

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateDeclarationBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') declarationId: string
  ) {
    const { year, description, status, incomes, deductions, taxDue, taxRefund } = body;
    const userId: string = user.sub;

    const result = await this.updateDeclarationUseCase.execute(
      {
        declarationId,
        description,
        userId,
        year,
        status,
        incomes,
        deductions,
        taxDue,
        taxRefund
      }
    );

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }

}