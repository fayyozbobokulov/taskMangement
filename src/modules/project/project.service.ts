import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { OrganizationUserService } from '../organization-user/organization-user.service';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './interface/project.interface';
import { ProjectRepository } from './project.repository';
import { UserRoles } from '../user/interface/user-role.enum';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly organizationUserService: OrganizationUserService,
  ) {}

  async getAllProjects(currentUserId: number): Promise<Project[]> {
    const currentUser = await this.userService.getUserById(currentUserId);

    if (currentUser.role === UserRoles.Admin) {
      return this.projectRepository.findAll();
    }

    return this.projectRepository.findByCreator(currentUserId);
  }

  async getProjectById(
    currentUserId: number,
    projectId: number,
  ): Promise<Project> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    await this.checkUserProjectAccess(currentUserId, project);
    return project;
  }

  async createProject(
    currentUserId: number,
    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    // Check if organization exists and user has access
    await this.organizationService.getOrganizationById(createProjectDto.org_id);
    await this.checkUserOrganizationAccess(
      currentUserId,
      createProjectDto.org_id,
    );

    return this.projectRepository.create({
      ...createProjectDto,
      created_by: currentUserId,
    });
  }

  async updateProject(
    currentUserId: number,
    projectId: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    // const project = await this.getProjectById(currentUserId, projectId);

    if (updateProjectDto.org_id) {
      await this.checkUserOrganizationAccess(
        currentUserId,
        updateProjectDto.org_id,
      );
    }

    return this.projectRepository.update(projectId, updateProjectDto);
  }

  async deleteProject(currentUserId: number, projectId: number): Promise<void> {
    // const project = await this.getProjectById(currentUserId, projectId);
    await this.projectRepository.delete(projectId);
  }

  async getOrganizationProjects(
    currentUserId: number,
    orgId: number,
  ): Promise<any[]> {
    await this.checkUserOrganizationAccess(currentUserId, orgId);
    return this.projectRepository.findByOrgWithDetails(orgId);
  }

  private async checkUserProjectAccess(
    userId: number,
    project: Project,
  ): Promise<void> {
    const user = await this.userService.getUserById(userId);

    if (user.role !== UserRoles.Admin && project.created_by !== userId) {
      // Check if user is member of the organization
      const orgMember = await this.organizationUserService.isUserInOrganization(
        userId,
        project.org_id,
      );

      if (!orgMember) {
        throw new ForbiddenException('No access to this project');
      }
    }
  }

  private async checkUserOrganizationAccess(
    userId: number,
    orgId: number,
  ): Promise<void> {
    const user = await this.userService.getUserById(userId);

    if (user.role === UserRoles.Admin) {
      return;
    }

    const orgMember = await this.organizationUserService.isUserInOrganization(
      userId,
      orgId,
    );

    if (!orgMember) {
      throw new ForbiddenException('No access to this organization');
    }
  }
}
