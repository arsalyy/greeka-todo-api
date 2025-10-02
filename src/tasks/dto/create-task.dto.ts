import { IsString, IsEnum, IsOptional, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ description: 'Task name', maxLength: 255, example: 'Complete project documentation' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Due date for the task', example: '2025-10-15T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  @ApiPropertyOptional({ description: 'Task status', enum: TaskStatus, example: TaskStatus.PENDING })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ description: 'Task priority', enum: TaskPriority, example: TaskPriority.BLUE })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
}
