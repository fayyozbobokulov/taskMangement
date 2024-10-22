import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string; // The name of the organization

  @IsNumber()
  @IsNotEmpty()
  requestedBy: number; // The user ID of the person requesting the creation (this will become `created_by`)
}
