import { forwardRef, Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { OrganizationRepository } from './organization.repository';
import { OrganizationUsersModule } from '../organization-user/organization-user.module';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [UsersModule, forwardRef(() => OrganizationUsersModule)],
  providers: [OrganizationService, OrganizationRepository],
  controllers: [OrganizationController],
  exports: [OrganizationService, OrganizationRepository],
})
export class OrganizationsModule {}
