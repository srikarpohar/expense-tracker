import { Module } from '@nestjs/common';
import { UserVerificationsService } from './user_verifications/user_verifications.service';
import { UsersService } from './users.service';
import { UserTransactionsService } from './user-transactions/user-transactions.service';

@Module({
  providers: [
    UsersService,
    UserVerificationsService,
    UserTransactionsService
  ],
  exports: [
    UsersService,
    UserVerificationsService,
    UserTransactionsService
  ]
})
export class UsersModule {}
