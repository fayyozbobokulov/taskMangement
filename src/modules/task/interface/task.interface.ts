import { TaskStatuses } from './task-statuses.enum';

export interface Task {
  id: number;
  created_by: number;
  project_id: number;
  worker_user_id?: number;
  status: TaskStatuses;
  due_date?: Date;
  done_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface TaskUpdatePermissions {
  canUpdateStatus: boolean;
  canUpdateWorker: boolean;
  canUpdateDueDate: boolean;
  canUpdateProject: boolean;
  allowedStatusTransitions: TaskStatuses[];
}
