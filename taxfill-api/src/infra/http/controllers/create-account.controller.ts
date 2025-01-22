import { Public } from '@/infra/auth/public';
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { UserAlreadyExistsError } from '@/domain/application/errors/user-already-exists-error';
import { CreateUserUseCase } from '@/domain/application/use-cases/create-user';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@ApiTags('Accounts')
@Controller('/accounts')
@Public()
export class CreateAccountController {

  constructor(
    private readonly createUser: CreateUserUseCase
  ) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
      required: ['name', 'email', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'User account created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request, possibly due to validation errors' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    const result = await this.createUser.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error: Error = result.value;
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }

  }

}