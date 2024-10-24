import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '../base';
import { Knex } from 'knex';
import { Task } from './interface/task.interface';
import { TaskStatuses } from './interface/task-statuses.enum';
import { KNEX_CONNECTION } from '../knex/constants';

@Injectable()
export class TaskRepository extends BaseRepository<Task> {
  constructor(@Inject(KNEX_CONNECTION) knex: Knex) {
    super(knex, 'tasks');
  }

  async findByProject(projectId: number): Promise<Task[]> {
    return this.query()
      .where('project_id', '=', projectId)
      .orderBy('due_date', 'asc')
      .select('*') as Promise<Task[]>;
  }

  async findByWorker(userId: number): Promise<Task[]> {
    return this.query()
      .where('worker_user_id', '=', userId)
      .orderBy('due_date', 'asc')
      .select('*') as Promise<Task[]>;
  }

  async findByStatus(status: TaskStatuses): Promise<Task[]> {
    return this.query()
      .where('status', '=', status)
      .orderBy('due_date', 'asc')
      .select('*') as Promise<Task[]>;
  }

  async updateStatus(
    taskId: number,
    status: TaskStatuses,
    doneAt?: Date,
  ): Promise<Task> {
    const updateData: any = { status };
    if (status === TaskStatuses.Done) {
      updateData.done_at = doneAt || new Date();
    }

    const [updated] = await this.query()
      .where('id', '=', taskId)
      .update(updateData)
      .returning('*');

    return updated;
  }

  async getDueTasksCount(): Promise<number> {
    const result = await this.query()
      .where('due_date', '<=', new Date())
      .whereNot('status', '=', TaskStatuses.Done)
      .count('* as count')
      .first();

    return Number(result?.count || 0);
  }
}
