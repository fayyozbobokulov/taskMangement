import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationModule } from './modules/organization/organization.module';

@Module({
  imports: [OrganizationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
