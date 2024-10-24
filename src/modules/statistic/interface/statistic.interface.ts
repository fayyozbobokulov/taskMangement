import { TaskStatuses } from 'src/modules/task/interface/task-statuses.enum';

export interface OrganizationStatistics {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  projectsCount: string; // Since we're using COUNT in raw SQL, it returns as string
  totalTasksCount: string;
}

export interface ProjectStatistics {
  organizationId: number;
  organizationName: string;
  projectId: number;
  projectName: string;
  created_at: Date;
  updated_at: Date;
  tasksCount: string;
  completedTasksCount: string;
  completionRate: string;
  overdueTasks: string;
}

export interface GeneralStatistics {
  // totalOrganizations: number;
  totalProjects: number;
  totalTasks: number;
  taskStatusDistribution?: Record<TaskStatuses, number>;
  avgTasksPerProject?: number;
  lastUpdated?: Date;
}

export interface CompleteStatistics {
  organizationStats: OrganizationStatistics[];
  projectStats: ProjectStatistics[];
  generalStats: GeneralStatistics[];
}
