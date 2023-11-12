import { Body, Controller, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}
  @Post()
  createTask(@Body() dto: CreateTaskDto) {
    console.log(dto);
    return this.taskService.createTask(dto);
  }
}
