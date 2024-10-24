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
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './interface/task.interface';
import { TaskService } from './task.service';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRoles } from '../user/interface/user-role.enum';
import { RoleGroups } from 'src/guards/role-groups';
import { TaskStatuses } from './interface/task-statuses.enum';

@Controller('tasks')
@UseGuards(RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(':id')
  @Roles(...RoleGroups.ORG_GROUP)
  async getTaskById(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Task> {
    return this.taskService.getTaskById(req.user.id, id);
  }

  @Post()
  @Roles(UserRoles.OrgAdminUser)
  async createTask(
    @Request() req,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.taskService.createTask(req.user.id, createTaskDto);
  }

  @Put(':id')
  @Roles(...RoleGroups.ORG_GROUP)
  async updateTask(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.updateTask(req.user.id, id, updateTaskDto);
  }

  @Delete(':id')
  @Roles(UserRoles.OrgAdminUser)
  async deleteTask(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.taskService.deleteTask(req.user.id, id);
  }

  @Get('project/:projectId')
  @Roles(...RoleGroups.ORG_GROUP)
  async getProjectTasks(
    @Request() req,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<Task[]> {
    return this.taskService.getProjectTasks(req.user.id, projectId);
  }

  @Get('my/tasks')
  @Roles(UserRoles.OrgUser)
  async getMyTasks(@Request() req): Promise<Task[]> {
    return this.taskService.getMyTasks(req.user.id);
  }

  @Get('my/:status')
  @Roles(UserRoles.OrgUser)
  async getDueTasks(
    @Request() req,
    @Param('status') status: TaskStatuses,
  ): Promise<Task[]> {
    return this.taskService.getDueTasks(req.user.id, status);
  }
}
