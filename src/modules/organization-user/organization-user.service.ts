import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';
import { CreateOrganizationUserDto } from './dto/create-organization-user';
import { OrganizationUser } from './interface/orgazation-user.interface';
import { OrganizationUserRepository } from './organization-user.repository';
import { UserRoles } from '../user/interface/user-role.enum';

@Injectable()
export class OrganizationUserService {
  constructor(
    private readonly organizationUserRepository: OrganizationUserRepository,
    private readonly userService: UserService,
    @Inject(forwardRef(() => OrganizationService))
    private readonly organizationService: OrganizationService,
  ) {}

  async addUserToOrganization(
    currentUserId: number,
    createOrgUserDto: CreateOrganizationUserDto,
  ): Promise<OrganizationUser> {
    const organization = await this.organizationService.getOrganizationById(
      createOrgUserDto.org_id,
    );

    // const user = await this.userService.getUserById(createOrgUserDto.user_id);

    const currentUser = await this.userService.getUserById(currentUserId);
    if (
      currentUser.role !== UserRoles.Admin &&
      organization.created_by !== currentUserId
    ) {
      throw new ForbiddenException(
        'No permission to add users to this organization',
      );
    }

    const existing = await this.organizationUserRepository.findByOrgAndUser(
      createOrgUserDto.org_id,
      createOrgUserDto.user_id,
    );

    if (existing) {
      throw new ConflictException('User is already in this organization');
    }

    return this.organizationUserRepository.create(createOrgUserDto);
  }

  async removeUserFromOrganization(
    currentUserId: number,
    orgId: number,
    userId: number,
  ): Promise<void> {
    const organization =
      await this.organizationService.getOrganizationById(orgId);

    const currentUser = await this.userService.getUserById(currentUserId);
    if (
      currentUser.role !== UserRoles.Admin &&
      organization.created_by !== currentUserId &&
      currentUserId !== userId
    ) {
      throw new ForbiddenException(
        'No permission to remove users from this organization',
      );
    }

    const orgUser = await this.organizationUserRepository.findByOrgAndUser(
      orgId,
      userId,
    );
    if (!orgUser) {
      throw new NotFoundException('User is not in this organization');
    }

    await this.organizationUserRepository.deleteByOrgAndUser(orgId, userId);
  }

  async getUserOrganizations(userId: number): Promise<any[]> {
    const orgUsers = await this.organizationUserRepository.findByUser(userId);
    const organizations = await Promise.all(
      orgUsers.map(async (orgUser) => {
        const org = await this.organizationService.getOrganizationById(
          orgUser.org_id,
        );
        return {
          ...org,
          joined_at: orgUser.created_at,
        };
      }),
    );
    return organizations;
  }

  async getOrganizationUsers(
    currentUserId: number,
    orgId: number,
  ): Promise<any[]> {
    const organization =
      await this.organizationService.getOrganizationById(orgId);
    const currentUser = await this.userService.getUserById(currentUserId);

    if (
      currentUser.role !== UserRoles.Admin &&
      organization.created_by !== currentUserId
    ) {
      throw new ForbiddenException('No permission to view organization users');
    }

    return this.organizationUserRepository.getUsersWithDetails(orgId);
  }

  async isUserInOrganization(userId: number, orgId: number): Promise<boolean> {
    const user = await this.organizationUserRepository.findByOrgAndUser(
      orgId,
      userId,
    );
    return !!user;
  }
}
