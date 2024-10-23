import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './interface/organization.interface';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  async getAllOrganizations(): Promise<Organization[]> {
    return this.organizationService.getAllOrganizations();
  }

  @Get(':id')
  async getOrganizationById(@Param('id') id: number): Promise<Organization> {
    return this.organizationService.getOrganizationById(id);
  }

  @Post()
  async createOrganization(
    @Body() data: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.createOrganization(data);
  }

  @Put(':id')
  async updateOrganization(
    @Param('id') id: number,
    @Body() data: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.updateOrganization(id, data);
  }

  @Delete(':id')
  async deleteOrganization(@Param('id') id: number): Promise<void> {
    return this.organizationService.deleteOrganization(id);
  }
}
