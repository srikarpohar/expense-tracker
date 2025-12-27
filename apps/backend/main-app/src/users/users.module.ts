import { Module } from '@nestjs/common';
import { UserVerificationsService } from './user_verifications/user_verifications.service';
import { UsersService } from './users.service';

@Module({
  providers: [
    UsersService,
    UserVerificationsService
  ],
  exports: [
    UsersService,
    UserVerificationsService
  ]
})
export class UsersModule {}
