import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  name?: string; // Optional update for the organization name

  @IsNumber()
  @IsOptional()
  updatedBy?: number; // Optional update for the user who last updated the organization
}
