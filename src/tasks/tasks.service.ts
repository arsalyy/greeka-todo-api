import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ListTasksDto } from './dto/list-tasks.dto';
import { PaginatedResponseDto } from '../common/dto/api-response.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const taskData: Partial<Task> = {
      name: createTaskDto.name,
    };
    
    if (createTaskDto.status !== undefined) {
      taskData.status = createTaskDto.status;
    }
    
    if (createTaskDto.priority !== undefined) {
      taskData.priority = createTaskDto.priority;
    }
    
    if (createTaskDto.due_date) {
      taskData.due_date = new Date(createTaskDto.due_date);
    }
    
    const task = this.taskRepository.create(taskData);
    const savedTask = await this.taskRepository.save(task);
    return savedTask;
  }

  async findAll(listTasksDto: ListTasksDto): Promise<PaginatedResponseDto<Task>> {
    const { page = 1, limit = 10, search, status, priority, due_date_start, due_date_end, created_at_start, created_at_end } = listTasksDto;

    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    queryBuilder.where('task.is_active = :is_active', { is_active: true });

    if (search) {
      queryBuilder.andWhere('task.name ILIKE :search', { search: `%${search}%` });
    }

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('task.priority = :priority', { priority });
    }

    if (due_date_start) {
      queryBuilder.andWhere('task.due_date >= :due_date_start', { due_date_start: new Date(due_date_start) });
    }

    if (due_date_end) {
      queryBuilder.andWhere('task.due_date <= :due_date_end', { due_date_end: new Date(due_date_end) });
    }

    if (created_at_start) {
      queryBuilder.andWhere('task.created_at >= :created_at_start', { created_at_start: new Date(created_at_start) });
    }

    if (created_at_end) {
      queryBuilder.andWhere('task.created_at <= :created_at_end', { created_at_end: new Date(created_at_end) });
    }

    queryBuilder.orderBy('task.created_at', 'DESC');

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponseDto(items, total, page, limit);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, is_active: true },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    const updatedData: any = { ...updateTaskDto };
    if (updateTaskDto.due_date) {
      updatedData.due_date = new Date(updateTaskDto.due_date);
    }

    Object.assign(task, updatedData);
    return await this.taskRepository.save(task);
  }

  async remove(id: string): Promise<Task> {
    const task = await this.findOne(id);
    task.is_active = false;
    return await this.taskRepository.save(task);
  }
}
