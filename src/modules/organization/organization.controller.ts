import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './interface/organization.interface';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from '../user/interface/user-role.enum';

@Controller('organizations')
@UseGuards(RolesGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @Roles(UserRoles.Admin)
  async getAllOrganizations(): Promise<Organization[]> {
    return this.organizationService.getAllOrganizations();
  }

  @Get(':id')
  @Roles(UserRoles.Admin)
  async getOrganizationById(@Param('id') id: number): Promise<Organization> {
    return this.organizationService.getOrganizationById(id);
  }

  @Post()
  @Roles(UserRoles.Admin)
  async createOrganization(
    @Body() data: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.createOrganization(data);
  }

  @Put(':id')
  @Roles(UserRoles.Admin)
  async updateOrganization(
    @Param('id') id: number,
    @Body() data: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.updateOrganization(id, data);
  }

  @Delete(':id')
  @Roles(UserRoles.Admin)
  async deleteOrganization(@Param('id') id: number): Promise<void> {
    return this.organizationService.deleteOrganization(id);
  }
}
