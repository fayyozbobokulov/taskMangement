import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';

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

  async createOrganization(data: any) {
    return this.organizationRepository.createOrganization(data);
  }

  async updateOrganization(id: number, data: any) {
    return this.organizationRepository.updateOrganization(id, data);
  }

  async deleteOrganization(id: number) {
    return this.organizationRepository.deleteOrganization(id);
  }
}
