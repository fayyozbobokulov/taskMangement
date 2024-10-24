import { MiddlewareConsumer, Module } from '@nestjs/common';
import { OrganizationsModule } from './modules/organization/organization.module';
import { UsersModule } from './modules/user/user.module';
import { OrganizationUsersModule } from './modules/organization-user/organization-user.module';
import { TasksModule } from './modules/task/task.module';
import { ProjectsModule } from './modules/project/project.module';
import { KnexModule } from './modules/knex/knex.module';
import { StatisticsModule } from './modules/statistic/statistic.module';
import { APP_GUARD } from '@nestjs/core';
import { UserAuthGuard } from './guards/user-auth-guard';
import { UserHeaderMiddleware } from './middlewares/user-header.middleware';

@Module({
  imports: [
    KnexModule.forRoot(),
    OrganizationsModule,
    UsersModule,
    OrganizationUsersModule,
    TasksModule,
    ProjectsModule,
    StatisticsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: UserAuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserHeaderMiddleware).forRoutes('*');
  }
}
