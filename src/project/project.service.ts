import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async getAllUserProjects(user: User) {
    try {
      const projects = await this.prisma.project.findMany({
        where: {
          members: {
            some: {
              id: user.id,
            },
          },
        },
      });

      return { projects: projects.length > 0 ? projects : null };
    } catch (err) {
      console.log(err);
    }
  }

  createProject(createProjectDto: CreateProjectDto, owner: User) {
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        members: {
          connect: { id: owner.id },
        },
      },
      include: {
        members: true,
      },
    });
  }

  async deleteProjectById(id: string) {
    try {
      const project = await this.prisma.project.delete({
        where: {
          id: parseInt(id),
        },
      });
      return project;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException('Project not found');
        }
        throw err;
      }
    }
  }
}
