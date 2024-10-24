import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskUpdatePermissions } from './interface/task.interface';
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
    await this.validateTaskUpdate(currentUserId, task, updateTaskDto);
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
    await this.getTaskById(currentUserId, taskId);
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

  async getDueTasks(
    currentUserId: number,
    status: TaskStatuses,
  ): Promise<Task[]> {
    const user = await this.userService.getUserById(currentUserId);

    const query = this.taskRepository.query().where('status', '<=', status);

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

  async getTaskUpdatePermissions(
    userId: number,
    task: Task,
  ): Promise<TaskUpdatePermissions> {
    const user = await this.userService.getUserById(userId);
    // const isCreator = task.created_by === userId;
    const isAssignedWorker = task.worker_user_id === userId;

    switch (user.role) {
      case UserRoles.OrgAdminUser:
        return this.getOrgAdminPermissions();
      case UserRoles.OrgUser:
        return this.getOrgUserPermissions(task, isAssignedWorker);
      default:
        throw new ForbiddenException('Invalid user role');
    }
  }

  private getOrgAdminPermissions(): TaskUpdatePermissions {
    return {
      canUpdateStatus: true,
      canUpdateWorker: true,
      canUpdateDueDate: true,
      canUpdateProject: true,
      allowedStatusTransitions: Object.values(TaskStatuses),
    };
  }

  private getOrgUserPermissions(
    task: Task,
    isAssignedWorker: boolean,
  ): TaskUpdatePermissions {
    if (!isAssignedWorker) {
      return {
        canUpdateStatus: false,
        canUpdateWorker: false,
        canUpdateDueDate: false,
        canUpdateProject: false,
        allowedStatusTransitions: [],
      };
    }

    return {
      canUpdateStatus: true,
      canUpdateWorker: false,
      canUpdateDueDate: false,
      canUpdateProject: false,
      allowedStatusTransitions: this.getAllowedStatusTransitionsForOrgUser(
        task.status,
      ),
    };
  }

  private getAllowedStatusTransitionsForOrgUser(
    currentStatus: TaskStatuses,
  ): TaskStatuses[] {
    switch (currentStatus) {
      case TaskStatuses.Created:
        return [TaskStatuses.InProgress];
      case TaskStatuses.InProgress:
        return [TaskStatuses.Done, TaskStatuses.Created];
      case TaskStatuses.Done:
        return [];
      default:
        return [];
    }
  }

  async validateTaskUpdate(
    userId: number,
    task: Task,
    updates: Partial<Task>,
  ): Promise<void> {
    const permissions = await this.getTaskUpdatePermissions(userId, task);

    if (updates.status !== undefined) {
      await this.validateStatusUpdate(task, updates.status, permissions);
    }

    if (updates.worker_user_id !== undefined && !permissions.canUpdateWorker) {
      throw new ForbiddenException(
        'You do not have permission to update worker',
      );
    }

    if (updates.due_date !== undefined && !permissions.canUpdateDueDate) {
      throw new ForbiddenException(
        'You do not have permission to update due date',
      );
    }

    if (updates.project_id !== undefined && !permissions.canUpdateProject) {
      throw new ForbiddenException(
        'You do not have permission to update project',
      );
    }
  }

  private async validateStatusUpdate(
    task: Task,
    newStatus: TaskStatuses,
    permissions: TaskUpdatePermissions,
  ): Promise<void> {
    if (!permissions.canUpdateStatus) {
      throw new ForbiddenException(
        'You do not have permission to update status',
      );
    }

    if (!permissions.allowedStatusTransitions.includes(newStatus)) {
      throw new ForbiddenException(
        `Invalid status transition from ${task.status} to ${newStatus}`,
      );
    }

    // If transitioning to Done, set done_at
    if (newStatus === TaskStatuses.Done && !task.done_at) {
      task.done_at = new Date();
    }
  }
}
