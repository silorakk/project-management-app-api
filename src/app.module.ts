import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { TaskGateway } from './task/task.gateway';
import { TaskService } from './task/task.service';
import { ProjectService } from './project/project.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProjectModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService, TaskGateway, TaskService, ProjectService],
})
export class AppModule {}
