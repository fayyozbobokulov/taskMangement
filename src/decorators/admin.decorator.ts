import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/modules/user/interface/user-role.enum';

export const ADMIN_KEY = UserRoles.Admin;
export const Admin = () => SetMetadata(ADMIN_KEY, true);
