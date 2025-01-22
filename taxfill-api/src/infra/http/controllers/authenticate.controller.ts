import { Public } from '@/infra/auth/public';
import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user';
import { WrongCredentialsError } from '@/domain/application/errors/wrong-credentials-error';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@ApiTags('Sessions')
@Controller('/sessions')
@Public()
export class AuthenticateController {

  constructor(
    private readonly authenticateUser: AuthenticateUserUseCase
  ) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'User authenticated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request, possibly due to validation errors' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateUser.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error: Error = result.value;
      if (error instanceof WrongCredentialsError) {
        throw new UnauthorizedException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}