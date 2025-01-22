import { BadRequestException, Controller, Get, Query, UsePipes } from '@nestjs/common';
import { DeclarationPresenter } from '../presenters/declaration-presenter';
import { DeclarationStatus } from '@/domain/enterprise/enums/declaration-status';
import { FetchDeclarationsUseCase } from '@/domain/application/use-cases/fetch-declarations';
import { ApiBearerAuth } from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const fetchDeclarationsParamsSchema = z.object({
  year: z.preprocess((val) => (val ? parseInt(val as string, 10) : undefined), z.number().optional()),
  status: z.nativeEnum(DeclarationStatus).optional(),
});

type QueryParamsSchema = z.infer<typeof fetchDeclarationsParamsSchema>;

@ApiBearerAuth('access_token')
@Controller('/declarations')
export class FetchDeclarationsController {

  constructor(
    private readonly fetchDeclarationsUseCase: FetchDeclarationsUseCase
  ) { }

  @Get()
  @UsePipes(new ZodValidationPipe(fetchDeclarationsParamsSchema))
  async handle(
    @Query() query: QueryParamsSchema) {
    const { year, status } = query;
    const result = await this.fetchDeclarationsUseCase.execute({ year, status });

    if (result.isLeft()) {
      throw new BadRequestException(result.value);
    }

    return result.value.map(DeclarationPresenter.toHttp);
  }
}