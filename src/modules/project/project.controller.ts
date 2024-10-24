import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './interface/project.interface';
import { ProjectService } from './project.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from '../user/interface/user-role.enum';
import { RequestWithUser } from 'src/types/request.interface';

@Controller('projects')
@UseGuards(RolesGuard)
@Roles(UserRoles.OrgAdminUser)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async getAllProjects(@Request() req: RequestWithUser): Promise<Project[]> {
    return this.projectService.getAllProjects(req.user.id);
  }

  @Get(':id')
  async getProjectById(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Project> {
    return this.projectService.getProjectById(req.user.id, id);
  }

  @Post()
  async createProject(
    @Request() req: RequestWithUser,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectService.createProject(req.user.id, createProjectDto);
  }

  @Put(':id')
  async updateProject(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.updateProject(req.user.id, id, updateProjectDto);
  }

  @Delete(':id')
  async deleteProject(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.projectService.deleteProject(req.user.id, id);
  }

  @Get('organization/:orgId')
  async getOrganizationProjects(
    @Request() req: RequestWithUser,
    @Param('orgId', ParseIntPipe) orgId: number,
  ): Promise<Project[]> {
    return this.projectService.getOrganizationProjects(req.user.id, orgId);
  }
}
