import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateUserUseCase } from '@/domain/application/use-cases/create-user';
import { CreateDeclarationController } from './controllers/create-declaration.controller';
import { UpdateDeclarationController } from './controllers/update-declaration.controller';
import { CreateDeclarationUseCase } from '@/domain/application/use-cases/create-declaration';
import { UpdateDeclarationUseCase } from '@/domain/application/use-cases/update-declaration';
import { FetchDeclarationsController } from './controllers/fetch-declarations.controller';
import { FetchDeclarationsUseCase } from '@/domain/application/use-cases/fetch-declarations';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateDeclarationController,
    FetchDeclarationsController,
    UpdateDeclarationController
  ],
  providers: [
    AuthenticateUserUseCase,
    CreateDeclarationUseCase,
    CreateUserUseCase,
    FetchDeclarationsUseCase,
    UpdateDeclarationUseCase,
    {
      provide: 'VERSION',
      useValue: '01',
    },
  ],

})
export class HttpModule { }