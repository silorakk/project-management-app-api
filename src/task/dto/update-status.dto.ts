import { TaskStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
