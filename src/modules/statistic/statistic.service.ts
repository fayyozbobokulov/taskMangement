import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../organization/organization.repository';
import {
  CompleteStatistics,
  GeneralStatistics,
  OrganizationStatistics,
  ProjectStatistics,
} from './interface/statistic.interface';
import { ProjectRepository } from '../project/project.repository';
import { TaskRepository } from '../task/task.repository';
import { TaskStatuses } from '../task/interface/task-statuses.enum';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly taskRepository: TaskRepository,
  ) {}

  async getOrganizationStatistics(
    id?: number,
  ): Promise<OrganizationStatistics> {
    const result = await this.organizationRepository
      .query()
      .select([
        'organizations.id',
        'organizations.name',
        'organizations.created_at',
        'organizations.updated_at',
        this.organizationRepository.raw(
          'COUNT(DISTINCT projects.id) as "projectsCount"',
        ),
        this.organizationRepository.raw(
          'COUNT(DISTINCT tasks.id) as "totalTasksCount"',
        ),
      ])
      .leftJoin('projects', 'organizations.id', 'projects.organization_id')
      .leftJoin('tasks', 'projects.id', 'tasks.project_id')
      .where('organizations.id', '=', id)
      .groupBy('organizations.id')
      .first();

    return result;
  }

  async getProjectStatistics(): Promise<ProjectStatistics> {
    return this.projectRepository
      .query()
      .select([
        'organizations.id as organizationId',
        'organizations.name as organizationName',
        'projects.id as projectId',
        'projects.name as projectName',
        'projects.created_at',
        'projects.updated_at',
        this.projectRepository.raw('COUNT(DISTINCT tasks.id) as "tasksCount"'),
        this.projectRepository.raw(`
          COUNT(CASE 
            WHEN tasks.status = '${TaskStatuses.Done}' AND tasks.done_at IS NOT NULL 
            THEN 1 
          END) as "completedTasksCount"
        `),
        this.projectRepository.raw(`
          ROUND(
            COUNT(CASE 
              WHEN tasks.status = '${TaskStatuses.Done}' AND tasks.done_at IS NOT NULL 
              THEN 1 
            END)::numeric * 100 / 
            NULLIF(COUNT(tasks.id), 0)::numeric, 
            2
          ) as "completionRate"
        `),
        this.projectRepository.raw(`
          COUNT(CASE 
            WHEN tasks.due_date < NOW() AND tasks.status != '${TaskStatuses.Done}' 
            THEN 1 
          END) as "overdueTasks"
        `),
      ])
      .leftJoin('organizations', 'projects.org_id', 'organizations.id')
      .leftJoin('tasks', 'projects.id', 'tasks.project_id')
      .groupBy([
        'organizations.id',
        'organizations.name',
        'projects.id',
        'projects.name',
        'projects.created_at',
        'projects.updated_at',
      ])
      .orderBy(['organizations.name', 'projects.name'])
      .first();
  }

  async getGeneralStatistics(): Promise<GeneralStatistics> {
    const [orgsCount, projectsCount, tasksCount] = await Promise.all([
      // Get total organizations count
      this.organizationRepository
        .query()
        .count('id as count')
        .first()
        .then((result) => parseInt(result.count as string)),

      // Get total projects count
      this.projectRepository
        .query()
        .count('id as count')
        .first()
        .then((result) => parseInt(result.count as string)),

      // Get total tasks count
      this.taskRepository
        .query()
        .count('id as count')
        .first()
        .then((result) => parseInt(result.count as string)),

      // Get task status distribution
      this.taskRepository
        .query()
        .select('status')
        .count('id as count')
        .groupBy('status')
        .then((results) =>
          results.reduce(
            (acc, curr) => ({
              ...acc,
              [curr.status]: parseInt(curr.count as string),
            }),
            {},
          ),
        ),
    ]);

    return {
      totalOrganizations: orgsCount,
      totalProjects: projectsCount,
      totalTasks: tasksCount,
    };
  }

  async getAllStatistics(): Promise<CompleteStatistics> {
    const [organizationStats, projectStats, generalStats] = await Promise.all([
      this.getOrganizationStatistics(),
      this.getProjectStatistics(),
      this.getGeneralStatistics(),
    ]);

    return {
      organizationStats,
      projectStats,
      generalStats,
    };
  }
}
