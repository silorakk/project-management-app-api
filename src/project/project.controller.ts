import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetUser } from 'src/get-user.decorator';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  getAllUserProjects(@GetUser() user: User) {
    return this.projectService.getAllUserProjects(user);
  }

  @Get(':id')
  getProjectById(@Param('id') id: string, @GetUser() user: User) {
    return this.projectService.getProjectById(id, user);
  }

  @Post(':id/invite')
  inviteUserToProject(@Param('id') id: string, @Body('email') email: string) {
    return this.projectService.inviteUserToProject(id, email);
  }

  @Get(':id/tasks')
  getAllProjectTasks(@Param('id') id: string) {
    return this.projectService.getAllProjectTasks(id);
  }

  @Post()
  createProject(@Body() body: CreateProjectDto, @GetUser() user: User) {
    return this.projectService.createProject(body, user);
  }

  @Delete('/:id')
  deleteProjectById(@Param('id') id: string) {
    return this.projectService.deleteProjectById(id);
  }
}
