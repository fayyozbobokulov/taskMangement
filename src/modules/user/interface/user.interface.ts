import { UserRoles } from './user-role.enum';

export interface User {
  id: number;
  name: string;
  role: UserRoles;
  created_by: number | null;
  created_at?: Date;
  updated_at?: Date;
}
