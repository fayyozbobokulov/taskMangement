import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { CreateOrganizationUserDto } from './dto/create-organization-user';
import { OrganizationUserService } from './organization-user.service';

@Controller('organization-users')
export class OrganizationUserController {
  constructor(
    private readonly organizationUserService: OrganizationUserService,
  ) {}

  @Post()
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
  async getUserOrganizations(@Param('userId', ParseIntPipe) userId: number) {
    return this.organizationUserService.getUserOrganizations(userId);
  }

  @Get('organization/:orgId/users')
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
