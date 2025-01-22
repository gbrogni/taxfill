import { DeductionType } from '@/domain/enterprise/enums/deduction-type';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateDeductionUseCase } from '@/domain/application/use-cases/create-deduction';

const createDeductionBodySchema = z.object({
  type: z.nativeEnum(DeductionType),
  description: z.string().optional(),
  amount: z.number(),
  declarationId: z.string()
});

const bodyValidationPipe = new ZodValidationPipe(createDeductionBodySchema);

type CreateDeductionBodySchema = z.infer<typeof createDeductionBodySchema>;

@Controller('/deductions')
export class CreateDeductionController {

  constructor(
    private readonly createDeductionUseCase: CreateDeductionUseCase
  ) { }

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateDeductionBodySchema
  ) {
    // const { type, description, amount, declarationId } = body;
    // const result = await this.createDeductionUseCase.execute({ type, description, amount, declarationId });

    // if (result.isLeft()) {
    //   throw new BadRequestException();
    // }

    // return result.value;
  }

}