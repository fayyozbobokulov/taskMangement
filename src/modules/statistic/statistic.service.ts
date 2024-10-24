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
  ): Promise<OrganizationStatistics[]> {
    const query = this.organizationRepository
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
      .leftJoin('projects', 'organizations.id', 'projects.org_id')
      .leftJoin('tasks', 'projects.id', 'tasks.project_id')
      .groupBy('organizations.id');

    if (id) {
      query.where('organizations.id', '=', id);
    }

    return query; // Returns array of results
  }

  async getProjectStatistics(
    organizationId?: number,
    projectId?: number,
  ): Promise<ProjectStatistics[]> {
    const query = this.projectRepository
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
      .orderBy(['organizations.name', 'projects.name']);

    if (organizationId) {
      query.where('organizations.id', '=', organizationId);
    }

    if (projectId) {
      query.where('projects.id', '=', projectId);
    }

    return query; // Returns array of results
  }

  async getGeneralStatistics(
    organizationId?: number,
  ): Promise<GeneralStatistics[]> {
    const baseQuery = (query: any) => {
      if (organizationId) {
        query
          .join('projects', 'tasks.project_id', 'projects.id')
          .where('projects.org_id', '=', organizationId);
      }
      return query;
    };

    // Get task status distribution per organization/project
    const taskStatusDistribution = await baseQuery(this.taskRepository.query())
      .select([
        'projects.org_id as organizationId',
        'tasks.project_id as projectId',
        'tasks.status',
        this.taskRepository.raw('COUNT(*) as count'),
      ])
      .groupBy('projects.org_id', 'tasks.project_id', 'tasks.status');

    // Process the raw data into statistics
    const statsMap = new Map<string, any>();

    for (const row of taskStatusDistribution) {
      const key = `${row.organizationId}_${row.projectId}`;
      if (!statsMap.has(key)) {
        statsMap.set(key, {
          organizationId: row.organizationId,
          projectId: row.projectId,
          totalTasks: 0,
          taskStatusDistribution: {},
        });
      }

      const stats = statsMap.get(key);
      stats.totalTasks += parseInt(row.count);
      stats.taskStatusDistribution[row.status] = parseInt(row.count);
    }

    // Get projects count
    const projectCounts = await this.projectRepository
      .query()
      .select('org_id')
      .count('id as count')
      .modify((query) => {
        if (organizationId) {
          query.where('org_id', '=', organizationId);
        }
      })
      .groupBy('org_id');

    // Convert the map to array and add additional statistics
    const results = Array.from(statsMap.values()).map((stats) => {
      const projectCount =
        projectCounts.find((p) => p.org_id === stats.organizationId)?.count ||
        0;

      return {
        organizationId: stats.organizationId,
        projectId: stats.projectId,
        totalProjects: parseInt(projectCount),
        totalTasks: stats.totalTasks,
        taskStatusDistribution: stats.taskStatusDistribution,
        avgTasksPerProject:
          projectCount > 0 ? +(stats.totalTasks / projectCount).toFixed(2) : 0,
        lastUpdated: new Date(),
      };
    });

    return results;
  }

  async getAllStatistics(
    organizationId?: number,
    projectId?: number,
  ): Promise<CompleteStatistics> {
    const [organizationStats, projectStats, generalStats] = await Promise.all([
      this.getOrganizationStatistics(organizationId),
      this.getProjectStatistics(organizationId, projectId),
      this.getGeneralStatistics(organizationId),
    ]);

    return {
      organizationStats,
      projectStats,
      generalStats,
    };
  }
}
