import { Module } from '@nestjs/common';
import { OrganizationUsersModule } from '../organization-user/organization-user.module';
import { UsersModule } from '../user/user.module';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './project.repository';
import { ProjectService } from './project.service';
import { OrganizationsModule } from '../organization/organization.module';

@Module({
  imports: [UsersModule, OrganizationsModule, OrganizationUsersModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
  exports: [ProjectService],
})
export class ProjectsModule {}
