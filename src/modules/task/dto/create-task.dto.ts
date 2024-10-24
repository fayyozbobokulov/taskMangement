import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateTaskDto {
  @IsNumber()
  @IsNotEmpty()
  project_id: number;

  @IsOptional()
  @IsNumber()
  worker_user_id?: number;

  @IsOptional()
  @IsDateString()
  due_date?: Date;
}
