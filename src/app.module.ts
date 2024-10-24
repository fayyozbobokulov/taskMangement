/* eslint-disable no-undef */
import { Module } from '@nestjs/common';
import { OrganizationsModule } from './modules/organization/organization.module';
import { UsersModule } from './modules/user/user.module';
import { OrganizationUsersModule } from './modules/organization-user/organization-user.module';
import { TasksModule } from './modules/task/task.module';
import { ProjectsModule } from './modules/project/project.module';
import { KnexModule } from './modules/knex/knex.module';

@Module({
  imports: [
    KnexModule.forRoot(),
    OrganizationsModule,
    UsersModule,
    OrganizationUsersModule,
    TasksModule,
    ProjectsModule,
  ],
})
export class AppModule {}
