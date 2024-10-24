import { IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { TaskStatuses } from '../interface/task-statuses.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsNumber()
  worker_user_id?: number;

  @IsOptional()
  @IsEnum(TaskStatuses)
  status?: TaskStatuses;

  @IsOptional()
  @IsDateString()
  due_date?: Date;
}
