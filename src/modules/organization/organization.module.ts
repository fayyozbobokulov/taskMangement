import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { OrganizationRepository } from './organization.repository';
import { KnexModule } from '../knex/knex.module';

@Module({
  imports: [KnexModule],
  providers: [OrganizationService, OrganizationRepository],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
