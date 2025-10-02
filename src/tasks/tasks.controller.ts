import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ListTasksDto } from './dto/list-tasks.dto';
import { Task } from './entities/task.entity';
import { ApiResponseDto, PaginatedResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully', type: Task })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<ApiResponseDto<Task>> {
    const task = await this.tasksService.create(createTaskDto);
    return new ApiResponseDto(true, 'Task created successfully', task);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  async findAll(@Query() listTasksDto: ListTasksDto): Promise<ApiResponseDto<PaginatedResponseDto<Task>>> {
    const result = await this.tasksService.findAll(listTasksDto);
    return new ApiResponseDto(true, 'Tasks retrieved successfully', result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<Task>> {
    const task = await this.tasksService.findOne(id);
    return new ApiResponseDto(true, 'Task retrieved successfully', task);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task updated successfully', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<ApiResponseDto<Task>> {
    const task = await this.tasksService.update(id, updateTaskDto);
    return new ApiResponseDto(true, 'Task updated successfully', task);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a task (soft delete)' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@Param('id') id: string): Promise<ApiResponseDto<Task>> {
    const task = await this.tasksService.remove(id);
    return new ApiResponseDto(true, 'Task deleted successfully', task);
  }
}
