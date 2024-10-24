import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateOrganizationUserDto } from './dto/create-organization-user';
import { OrganizationUserService } from './organization-user.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from '../user/interface/user-role.enum';

@Controller('organization-users')
@UseGuards(RolesGuard)
export class OrganizationUserController {
  constructor(
    private readonly organizationUserService: OrganizationUserService,
  ) {}

  @Post()
  @Roles(UserRoles.Admin)
  async addUserToOrganization(
    @Request() req,
    @Body() createOrgUserDto: CreateOrganizationUserDto,
  ) {
    return this.organizationUserService.addUserToOrganization(
      req.user.id,
      createOrgUserDto,
    );
  }

  @Delete(':orgId/users/:userId')
  @Roles(UserRoles.Admin)
  async removeUserFromOrganization(
    @Request() req,
    @Param('orgId', ParseIntPipe) orgId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    await this.organizationUserService.removeUserFromOrganization(
      req.user.id,
      orgId,
      userId,
    );
  }

  @Get('user/:userId/organizations')
  @Roles(UserRoles.Admin)
  async getUserOrganizations(@Param('userId', ParseIntPipe) userId: number) {
    return this.organizationUserService.getUserOrganizations(userId);
  }

  @Get('organization/:orgId/users')
  @Roles(UserRoles.Admin)
  async getOrganizationUsers(
    @Request() req,
    @Param('orgId', ParseIntPipe) orgId: number,
  ) {
    return this.organizationUserService.getOrganizationUsers(
      req.user.id,
      orgId,
    );
  }
}
