import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateDependentUseCase } from '@/domain/application/use-cases/create-dependent';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

const createDependentBodySchema = z.object({
  name: z.string(),
  birthDate: z.string(),
  relationship: z.string()
});

const bodyValidationPipe = new ZodValidationPipe(createDependentBodySchema);

type CreateDependentBodySchema = z.infer<typeof createDependentBodySchema>;

@Controller('/dependents')
export class CreateDependentController {

  constructor(
    private readonly createDependentUseCase: CreateDependentUseCase
  ) { }

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateDependentBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const userId: string = user.sub;
    const { name, birthDate: birthDateString, relationship } = body;
    const birthDate = new Date(birthDateString);
    const result = await this.createDependentUseCase.execute({ name, birthDate, relationship, userId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return result.value;

  }

}