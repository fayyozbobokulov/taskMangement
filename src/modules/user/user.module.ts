import { Module } from '@nestjs/common';
import { UserRepository } from './user.respository';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  providers: [UserService, UserRepository],
  exports: [UserService],
  controllers: [UserController],
})
export class UsersModule {}
