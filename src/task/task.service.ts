import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}
  async createTask(dto: CreateTaskDto) {
    console.log('received status', dto.status);
    const task = await this.prisma.task.create({
      data: {
        name: dto.name,
        projectId: parseInt(dto.projectId),
        status: dto.status,
      },
    });

    return { task: task };
  }
}
