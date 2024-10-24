import {
  Controller,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  HttpStatus,
  Query,
} from '@nestjs/common';
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

  @Get('organizations/:id?')
  async getOrganizationStatistics(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        optional: true,
      }),
    )
    id?: number,
  ): Promise<OrganizationStatistics[]> {
    return this.statisticsService.getOrganizationStatistics(id);
  }

  @Get('projects')
  async getProjectStatistics(
    @Query(
      'organizationId',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        optional: true,
      }),
    )
    organizationId?: number,
    @Query(
      'projectId',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        optional: true,
      }),
    )
    projectId?: number,
  ): Promise<ProjectStatistics[]> {
    return this.statisticsService.getProjectStatistics(
      organizationId,
      projectId,
    );
  }

  @Get('general/:id')
  async getGeneralStatistics(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        optional: true,
      }),
    )
    id?: number,
  ): Promise<GeneralStatistics[]> {
    return this.statisticsService.getGeneralStatistics(id);
  }

  @Get()
  async getAllStatistics(
    @Query('organizationId', new ParseIntPipe({ optional: true }))
    organizationId?: number,
    @Query('projectId', new ParseIntPipe({ optional: true }))
    projectId?: number,
  ): Promise<CompleteStatistics> {
    return this.statisticsService.getAllStatistics(organizationId, projectId);
  }
}
