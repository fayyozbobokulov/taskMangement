import { Module } from '@nestjs/common';
import { UserRepository } from './user.respository';
import { UserService } from './user.service';

@Module({
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UsersModule {}
