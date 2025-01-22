import { BadRequestException, Controller, Get, Query, UsePipes } from '@nestjs/common';
import { DeclarationPresenter } from '../presenters/declaration-presenter';
import { DeclarationStatus } from '@/domain/enterprise/enums/declaration-status';
import { FetchDeclarationsUseCase } from '@/domain/application/use-cases/fetch-declarations';
import { ApiBearerAuth, ApiHeader, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';

const fetchDeclarationsParamsSchema = z.object({
  year: z.preprocess((val) => (val ? parseInt(val as string, 10) : undefined), z.number().optional()),
  status: z.nativeEnum(DeclarationStatus).optional(),
});

type QueryParamsSchema = z.infer<typeof fetchDeclarationsParamsSchema>;

@ApiBearerAuth('access_token')
@ApiTags('Declarations')
@Controller('/declarations')
export class FetchDeclarationsController {

  constructor(
    private readonly fetchDeclarationsUseCase: FetchDeclarationsUseCase
  ) { }

  @Get()
  @UsePipes(new ZodValidationPipe(fetchDeclarationsParamsSchema))
  @ApiQuery({ name: 'year', required: false, type: Number, description: 'Year of the declarations' })
  @ApiQuery({ name: 'status', required: false, enum: DeclarationStatus, description: 'Status of the declarations' })
  @ApiHeader({ name: 'userId', required: true, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async handle(
    @CurrentUser() user: UserPayload,
    @Query() query: QueryParamsSchema,
  ) {
    const { year, status } = query;
    const userId: string = user.sub;
    const result = await this.fetchDeclarationsUseCase.execute({ userId, year, status });

    if (result.isLeft()) {
      throw new BadRequestException(result.value);
    }

    return result.value.map(DeclarationPresenter.toHttp);
  }
}