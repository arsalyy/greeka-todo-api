import { IsOptional, IsEnum, IsDateString, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class ListTasksDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filter by status', enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ description: 'Filter by priority', enum: TaskPriority })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({ description: 'Due date start range', example: '2025-10-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  due_date_start?: string;

  @ApiPropertyOptional({ description: 'Due date end range', example: '2025-10-31T23:59:59.999Z' })
  @IsOptional()
  @IsDateString()
  due_date_end?: string;

  @ApiPropertyOptional({ description: 'Creation date start range', example: '2025-10-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  created_at_start?: string;

  @ApiPropertyOptional({ description: 'Creation date end range', example: '2025-10-31T23:59:59.999Z' })
  @IsOptional()
  @IsDateString()
  created_at_end?: string;

  @ApiPropertyOptional({ description: 'Search by task name', example: 'project' })
  @IsOptional()
  @IsString()
  search?: string;
}
