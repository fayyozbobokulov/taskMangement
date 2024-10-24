import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRoles } from '../user/interface/user-role.enum';
import {
  OrganizationStatistics,
  ProjectStatistics,
  GeneralStatistics,
  CompleteStatistics,
} from './interface/statistic.interface';
import { StatisticsService } from './statistic.service';

@Controller('statistics')
@UseGuards(RolesGuard)
@Roles(UserRoles.Admin)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('organizations/:id')
  async getOrganizationStatistics(
    @Param('id') id?: number,
  ): Promise<OrganizationStatistics> {
    return this.statisticsService.getOrganizationStatistics(id);
  }

  @Get('projects')
  async getProjectStatistics(): Promise<ProjectStatistics[]> {
    return this.statisticsService.getProjectStatistics();
  }

  @Get('general')
  async getGeneralStatistics(): Promise<GeneralStatistics> {
    return this.statisticsService.getGeneralStatistics();
  }

  @Get()
  async getAllStatistics(): Promise<CompleteStatistics> {
    return this.statisticsService.getAllStatistics();
  }
}
