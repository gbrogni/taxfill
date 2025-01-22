import { DeductionType } from '@/domain/enterprise/enums/deduction-type';
import { IncomeType } from '@/domain/enterprise/enums/income-type';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateDeclarationUseCase } from '@/domain/application/use-cases/create-declaration';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { DeclarationStatus } from '@/domain/enterprise/enums/declaration-status';
import { Income } from '@/domain/enterprise/entities/income';
import { Deduction } from '@/domain/enterprise/entities/deduction';

const incomeSchema = z.object({
  type: z.nativeEnum(IncomeType),
  description: z.string().optional(),
  amount: z.number(),
});

const deductionSchema = z.object({
  type: z.nativeEnum(DeductionType),
  description: z.string().optional(),
  amount: z.number(),
});

const createDeclarationBodySchema = z.object({
  year: z.number(),
  description: z.string().optional(),
  status: z.nativeEnum(DeclarationStatus),
  incomes: z.array(incomeSchema),
  deductions: z.array(deductionSchema),
  taxDue: z.number(),
  taxRefund: z.number()
});

const bodyValidationPipe = new ZodValidationPipe(createDeclarationBodySchema);

type CreateDeclarationBodySchema = z.infer<typeof createDeclarationBodySchema>;

@Controller('/declarations')
export class CreateDeclarationController {

  constructor(
    private readonly createDeclarationUseCase: CreateDeclarationUseCase
  ) { }

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateDeclarationBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const userId: string = user.sub;
    const { year, description, status, incomes, deductions, taxDue, taxRefund } = body;
    const incomeEntities: Income[] = incomes.map(income => Income.create({
      ...income,
      declarationId: ''
    }));
    const deductionEntities: Deduction[] = deductions.map(deduction => Deduction.create({
      ...deduction,
      declarationId: ''
    }));
    const result = await this.createDeclarationUseCase.execute(
      {
        userId,
        year,
        description,
        status,
        incomes: incomeEntities,
        deductions: deductionEntities,
        taxDue,
        taxRefund
      });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    return result.value;
  }

}