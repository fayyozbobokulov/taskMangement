import { UserRoles } from 'src/modules/user/interface/user-role.enum';

export const RoleGroups = {
  ADMIN_GROUP: [UserRoles.Admin],
  ORG_GROUP: [UserRoles.OrgUser, UserRoles.OrgAdminUser],
  ALL_ADMIN: [UserRoles.Admin, UserRoles.OrgAdminUser],
} as const;
