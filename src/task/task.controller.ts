import { Body, Controller, Post, Put } from '@nestjs/common';
import { CreateTaskDto, UpdateStatusDto } from './dto';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}
  @Post()
  createTask(@Body() dto: CreateTaskDto) {
    return this.taskService.createTask(dto);
  }

  @Put(':id/status')
  updateTaskStatus(@Body() dto: UpdateStatusDto) {
    return this.taskService.updateStatus(dto);
  }
}
