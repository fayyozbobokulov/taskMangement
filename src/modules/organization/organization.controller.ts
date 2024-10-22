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

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  async getAllOrganizations() {
    return this.organizationService.getAllOrganizations();
  }

  @Get(':id')
  async getOrganizationById(@Param('id') id: number) {
    return this.organizationService.getOrganizationById(id);
  }

  @Post()
  async createOrganization(@Body() data: any) {
    return this.organizationService.createOrganization(data);
  }

  @Put(':id')
  async updateOrganization(@Param('id') id: number, @Body() data: any) {
    return this.organizationService.updateOrganization(id, data);
  }

  @Delete(':id')
  async deleteOrganization(@Param('id') id: number) {
    return this.organizationService.deleteOrganization(id);
  }
}
