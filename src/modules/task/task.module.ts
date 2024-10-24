import { Module } from '@nestjs/common';
import { ProjectsModule } from '../project/project.module';
import { UsersModule } from '../user/user.module';
import { TaskController } from './task.controller';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';

@Module({
  imports: [ProjectsModule, UsersModule],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
  exports: [TaskService],
})
export class TasksModule {}
