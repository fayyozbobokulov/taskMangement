import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { UserRoles } from '../interface/user-role.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEnum(UserRoles, {
    message: `Role must be one of: ${Object.values(UserRoles).join(', ')}`,
  })
  role: UserRoles;

  @IsOptional()
  @IsNumber()
  created_by?: number;
}
