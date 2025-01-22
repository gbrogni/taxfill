import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from '@/domain/application/repositories/users-repository';
import { PrismaUsersRepository } from './repositories/prisma-users-repository';
import { DeclarationsRepository } from '@/domain/application/repositories/declarations-repository';
import { PrismaDeclarationsRepository } from './repositories/prisma-declarations-repository';
import { IncomesRepository } from '@/domain/application/repositories/incomes-repository';
import { PrismaIncomesRepository } from './repositories/prisma-incomes-repository';
import { DeductionsRepository } from '@/domain/application/repositories/deductions-repository';
import { PrismaDeductionsRepository } from './repositories/prisma-deductions-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository
    },
    {
      provide: DeclarationsRepository,
      useClass: PrismaDeclarationsRepository
    },
    {
      provide: IncomesRepository,
      useClass: PrismaIncomesRepository
    },
    {
      provide: DeductionsRepository,
      useClass: PrismaDeductionsRepository
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    DeclarationsRepository,
    IncomesRepository,
    DeductionsRepository
  ]
})
export class DatabaseModule { }