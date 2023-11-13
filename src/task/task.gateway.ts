import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { CreateTaskDto } from '../task/dto/create-task.dto';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { TaskService } from 'src/task/task.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TaskGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly taskService: TaskService) {}

  @WebSocketServer() io: Server;

  afterInit() {
    Logger.log('Socket Initalised');
  }

  handleConnection(client: any) {
    Logger.log(`Client id: ${client.id} connected`);
  }

  handleDisconnect(client: any) {
    Logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('joinRoom')
  createRoom(@MessageBody() projectId, @ConnectedSocket() client: Socket) {
    client.join(projectId);
    Logger.log(`Client id: ${client.id} has joined the room ${projectId}`);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(@MessageBody() projectId, @ConnectedSocket() client: Socket) {
    client.leave(projectId);
    Logger.log(`Client id: ${client.id} has left the room ${projectId}`);
  }
  @SubscribeMessage('createTask')
  async createTask(@MessageBody() createTaskDto: CreateTaskDto) {
    const task = await this.taskService.createTask(createTaskDto);
    this.io.to(createTaskDto.projectId).emit('message', task);
    return task;
  }
}
