/* eslint-disable no-undef */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './modules/organization/organization.module';
import { UsersModule } from './modules/user/user.module';
import { OrganizationUsersModule } from './modules/organization-user/organization-user.module';
import { TasksModule } from './modules/task/task.module';
import { ProjectsModule } from './modules/project/project.module';
import { KnexModule } from './modules/knex/knex.module';

@Module({
  imports: [
    KnexModule.forRoot({
      client: 'pg',
      connection: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'admin',
        password: process.env.DB_PASSWORD || 'admin_password',
        database: process.env.DB_NAME || 'project_management_db',
        port: Number(process.env.DB_PORT) || 5432,
      },
      pool: {
        min: 2,
        max: 10,
      },
      debug: process.env.NODE_ENV === 'development',
    }),
    OrganizationsModule,
    UsersModule,
    OrganizationUsersModule,
    TasksModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
