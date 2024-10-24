export interface OrganizationStatistics {
  organizationName: string;
  projectsCount: number;
  totalTasksCount: number;
}

export interface ProjectStatistics {
  organizationName: string;
  projectName: string;
  tasksCount: number;
}

export interface GeneralStatistics {
  totalOrganizations: number;
  totalProjects: number;
  totalTasks: number;
}

export interface CompleteStatistics {
  organizationStats: OrganizationStatistics;
  projectStats: ProjectStatistics;
  generalStats: GeneralStatistics;
}
