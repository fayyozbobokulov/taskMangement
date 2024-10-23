import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async getAllOrganizations() {
    return this.organizationRepository.findAll();
  }

  async getOrganizationById(id: number) {
    return this.organizationRepository.findById(id);
  }

  async createOrganization(data: CreateOrganizationDto) {
    return this.organizationRepository.create(data);
  }

  async updateOrganization(id: number, data: UpdateOrganizationDto) {
    return this.organizationRepository.update(id, data);
  }

  async deleteOrganization(id: number) {
    return this.organizationRepository.delete(id);
  }
}
