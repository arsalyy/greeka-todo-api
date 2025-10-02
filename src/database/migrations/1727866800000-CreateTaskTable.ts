import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateTaskTable1727866800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'due_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['Pending', 'Done', 'In Progress', 'Paused'],
            default: "'Pending'",
          },
          {
            name: 'priority',
            type: 'enum',
            enum: ['Red', 'Yellow', 'Blue'],
            default: "'Blue'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createIndex(
      'tasks',
      new TableIndex({
        name: 'idx_status_due_date',
        columnNames: ['status', 'due_date'],
      }),
    );

    await queryRunner.createIndex(
      'tasks',
      new TableIndex({
        name: 'idx_priority_created_at',
        columnNames: ['priority', 'created_at'],
      }),
    );

    await queryRunner.createIndex(
      'tasks',
      new TableIndex({
        name: 'idx_is_active',
        columnNames: ['is_active'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('tasks', 'idx_is_active');
    await queryRunner.dropIndex('tasks', 'idx_priority_created_at');
    await queryRunner.dropIndex('tasks', 'idx_status_due_date');
    await queryRunner.dropTable('tasks');
  }
}
