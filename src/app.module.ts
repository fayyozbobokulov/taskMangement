import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationModule } from './modules/organization/organization.module';
import { UsersModule } from './modules/user/user.module';
import { OrganizationUsersModule } from './modules/organization-user/organization-user.module';

@Module({
  imports: [OrganizationModule, UsersModule, OrganizationUsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
