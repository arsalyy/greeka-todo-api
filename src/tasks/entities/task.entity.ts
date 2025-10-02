import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  PENDING = 'Pending',
  DONE = 'Done',
  IN_PROGRESS = 'In Progress',
  PAUSED = 'Paused',
}

export enum TaskPriority {
  RED = 'Red',
  YELLOW = 'Yellow',
  BLUE = 'Blue',
}

@Entity('tasks')
@Index('idx_status_due_date', ['status', 'due_date'])
@Index('idx_priority_created_at', ['priority', 'created_at'])
@Index('idx_is_active', ['is_active'])
export class Task {
  @ApiProperty({ description: 'Task ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Task name' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Due date for the task' })
  @Column({ type: 'timestamp', nullable: true })
  due_date: Date;

  @ApiProperty({ description: 'Task status', enum: TaskStatus })
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @ApiProperty({ description: 'Task priority', enum: TaskPriority })
  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.BLUE,
  })
  priority: TaskPriority;

  @ApiProperty({ description: 'Date of creation' })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Whether the task is active' })
  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
