import { Module } from '@nestjs/common';
import { UsersModule } from '../user/user.module';
import { OrganizationUserController } from './organization-user.controller';
import { OrganizationUserRepository } from './organization-user.repository';
import { OrganizationUserService } from './organization-user.service';
import { OrganizationsModule } from '../organization/organization.module';

@Module({
  imports: [UsersModule, OrganizationsModule],
  controllers: [OrganizationUserController],
  providers: [OrganizationUserService, OrganizationUserRepository],
  exports: [OrganizationUserService],
})
export class OrganizationUsersModule {}
