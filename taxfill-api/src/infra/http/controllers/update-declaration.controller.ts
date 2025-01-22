import { DeductionType } from '@/domain/enterprise/enums/deduction-type';
import { IncomeType } from '@/domain/enterprise/enums/income-type';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { UpdateDeclarationUseCase } from '@/domain/application/use-cases/update-declaration';
import { DeclarationStatus } from '@/domain/enterprise/enums/declaration-status';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';

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

@ApiBearerAuth('access_token')
@ApiTags('Declarations')
@Controller('/declarations/:id')
export class UpdateDeclarationController {

  constructor(
    private readonly updateDeclarationUseCase: UpdateDeclarationUseCase
  ) { }

  @Put()
  @HttpCode(204)
  @ApiParam({ name: 'id', required: true, description: 'Declaration ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        year: { type: 'number' },
        description: { type: 'string', nullable: true },
        status: { type: 'string', enum: Object.values(DeclarationStatus) },
        incomes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', nullable: true },
              type: { type: 'string', enum: Object.values(IncomeType) },
              description: { type: 'string', nullable: true },
              amount: { type: 'number' }
            }
          }
        },
        deductions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', nullable: true },
              type: { type: 'string', enum: Object.values(DeductionType) },
              description: { type: 'string', nullable: true },
              amount: { type: 'number' }
            }
          }
        },
        taxDue: { type: 'number' },
        taxRefund: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 204, description: 'Declaration updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
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