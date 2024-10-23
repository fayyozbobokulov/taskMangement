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
import { AdminGuard } from 'src/guards/admin.guards';
import { Admin } from 'src/decorators/admin.decorator';

@Controller('organizations')
@UseGuards(AdminGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @Admin()
  async getAllOrganizations(): Promise<Organization[]> {
    return this.organizationService.getAllOrganizations();
  }

  @Get(':id')
  @Admin()
  async getOrganizationById(@Param('id') id: number): Promise<Organization> {
    return this.organizationService.getOrganizationById(id);
  }

  @Post()
  @Admin()
  async createOrganization(
    @Body() data: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.createOrganization(data);
  }

  @Put(':id')
  @Admin()
  async updateOrganization(
    @Param('id') id: number,
    @Body() data: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.updateOrganization(id, data);
  }

  @Delete(':id')
  @Admin()
  async deleteOrganization(@Param('id') id: number): Promise<void> {
    return this.organizationService.deleteOrganization(id);
  }
}
