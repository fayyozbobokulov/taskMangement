import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEnum(['admin', 'user'])
  role: 'admin' | 'user';

  @IsOptional()
  @IsNumber()
  created_by?: number;
}
