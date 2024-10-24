import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './interface/task.interface';
import { TaskRepository } from './task.repository';
import { TaskStatuses } from './interface/task-statuses.enum';
import { UserRoles } from '../user/interface/user-role.enum';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  async getTaskById(currentUserId: number, taskId: number): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    await this.checkTaskAccess(currentUserId, task);
    return task;
  }

  async createTask(
    currentUserId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    // Verify project access
    await this.projectService.getProjectById(
      currentUserId,
      createTaskDto.project_id,
    );

    // Verify worker if specified
    if (createTaskDto.worker_user_id) {
      await this.userService.getUserById(createTaskDto.worker_user_id);
    }

    return this.taskRepository.create({
      ...createTaskDto,
      created_by: currentUserId,
      status: TaskStatuses.Created,
    });
  }

  async updateTask(
    currentUserId: number,
    taskId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.getTaskById(currentUserId, taskId);

    // Handle status change
    if (
      updateTaskDto.status === TaskStatuses.Done &&
      task.status !== TaskStatuses.Done
    ) {
      return this.taskRepository.updateStatus(
        taskId,
        TaskStatuses.Done,
        new Date(),
      );
    }

    return this.taskRepository.update(taskId, updateTaskDto);
  }

  async deleteTask(currentUserId: number, taskId: number): Promise<void> {
    // const task = await this.getTaskById(currentUserId, taskId);
    await this.taskRepository.delete(taskId);
  }

  async getProjectTasks(
    currentUserId: number,
    projectId: number,
  ): Promise<Task[]> {
    // Verify project access
    await this.projectService.getProjectById(currentUserId, projectId);
    return this.taskRepository.findByProject(projectId);
  }

  async getMyTasks(userId: number): Promise<Task[]> {
    return this.taskRepository.findByWorker(userId);
  }

  async getDueTasks(currentUserId: number): Promise<Task[]> {
    const user = await this.userService.getUserById(currentUserId);

    const query = this.taskRepository
      .query()
      .where('due_date', '<=', new Date())
      .whereNot('status', '=', TaskStatuses.Done);

    if (user.role !== UserRoles.Admin) {
      query.where('worker_user_id', '=', currentUserId);
    }

    return query.select('*');
  }

  private async checkTaskAccess(userId: number, task: Task): Promise<void> {
    const user = await this.userService.getUserById(userId);

    if (
      user.role !== UserRoles.Admin &&
      task.created_by !== userId &&
      task.worker_user_id !== userId
    ) {
      // Check project access
      await this.projectService.getProjectById(userId, task.project_id);
    }
  }
}
