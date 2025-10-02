import { IsString, IsEnum, IsOptional, IsDateString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: 'Task name', maxLength: 255, example: 'Updated task name' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ description: 'Due date for the task', example: '2025-10-20T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  @ApiPropertyOptional({ description: 'Task status', enum: TaskStatus, example: TaskStatus.IN_PROGRESS })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ description: 'Task priority', enum: TaskPriority, example: TaskPriority.RED })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
}
