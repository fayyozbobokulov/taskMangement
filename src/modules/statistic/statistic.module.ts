import { Module } from '@nestjs/common';
import { ProjectsModule } from '../project/project.module';
import { UsersModule } from '../user/user.module';
import { StatisticsService } from './statistic.service';
import { OrganizationsModule } from '../organization/organization.module';

@Module({
  imports: [ProjectsModule, UsersModule, OrganizationsModule],
  controllers: [StatisticsModule],
  providers: [StatisticsService],
})
export class StatisticsModule {}
