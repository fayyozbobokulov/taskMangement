import { Module } from '@nestjs/common';
import { ProjectsModule } from '../project/project.module';
import { UsersModule } from '../user/user.module';
import { StatisticsService } from './statistic.service';
import { OrganizationsModule } from '../organization/organization.module';
import { StatisticsController } from './statistic.controller';
import { TasksModule } from '../task/task.module';

@Module({
  imports: [ProjectsModule, UsersModule, OrganizationsModule, TasksModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
