import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string; // The name of the organization

  @IsNumber()
  @IsNotEmpty()
  created_by: number; // The user ID of the person requesting the creation (this will become `created_by`)
}
