import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @IsNumber()
  @IsNotEmpty()
  org_id: number;
}
