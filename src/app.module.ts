import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationModule } from './modules/organization/organization.module';
import { UsersModule } from './modules/user/user.module';

@Module({
  imports: [OrganizationModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
