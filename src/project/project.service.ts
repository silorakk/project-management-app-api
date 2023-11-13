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

  async inviteUserToProject(projectId: string, email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    await this.prisma.project.update({
      where: {
        id: parseInt(projectId),
      },
      data: {
        members: {
          connect: [{ id: user.id }],
        },
      },
    });
    return { msg: 'Successfully added user to project' };
  }

  async getAllProjectTasks(projectId: string) {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          projectId: parseInt(projectId),
        },
      });
      return { tasks: tasks };
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

  async getProjectById(id: string, user: User) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        members: true,
      },
    });
    const userCanAccessProject = project.members?.find(
      (member) => member.id === user.id,
    );

    // TODO: return appropriate error if user doesn't have permissionst to view this project
    if (userCanAccessProject) {
      return { project: project };
    }
  }
}
