import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateIncomeUseCase } from '@/domain/application/use-cases/create-income';
import { IncomeType } from '@/domain/enterprise/enums/income-type';

const createIncomeBodySchema = z.object({
  type: z.nativeEnum(IncomeType),
  description: z.string().optional(),
  amount: z.number(),
  declarationId: z.string()
});

const bodyValidationPipe = new ZodValidationPipe(createIncomeBodySchema);

type CreateIncomeBodySchema = z.infer<typeof createIncomeBodySchema>;

@Controller('/incomes')
export class CreateIncomeController {

  constructor(
    private readonly createIncomeUseCase: CreateIncomeUseCase
  ) { }

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateIncomeBodySchema
  ) {
    // const { type, description, amount, declarationId } = body;
    // const result = await this.createIncomeUseCase.execute({ type, description, amount, declarationId });

    // if (result.isLeft()) {
    //   throw new BadRequestException();
    // }

    // return result.value;
  }

}