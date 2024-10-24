import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOrganizationUserDto {
  @IsNumber()
  @IsNotEmpty()
  org_id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
