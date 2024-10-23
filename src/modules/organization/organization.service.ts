import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './interface/organization.interface';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async getAllOrganizations(): Promise<Organization[]> {
    return this.organizationRepository.findAll();
  }

  async getOrganizationById(id: number): Promise<Organization> {
    return this.organizationRepository.findById(id);
  }

  async createOrganization(data: CreateOrganizationDto): Promise<Organization> {
    return this.organizationRepository.create(data);
  }

  async updateOrganization(
    id: number,
    data: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationRepository.update(id, data);
  }

  async deleteOrganization(id: number): Promise<void> {
    return this.organizationRepository.delete(id);
  }
}
