import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('Tasks API (e2e)', () => {
  let app: INestApplication;
  let createdTaskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    
    app.useGlobalFilters(new HttpExceptionFilter());
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /tasks', () => {
    it('should create a new task with all fields', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          name: 'Test Task',
          due_date: '2025-10-15T10:00:00.000Z',
          status: 'In Progress',
          priority: 'Red',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.name).toBe('Test Task');
          expect(res.body.data.status).toBe('In Progress');
          expect(res.body.data.priority).toBe('Red');
          createdTaskId = res.body.data.id;
        });
    });

    it('should create a task with defaults when status and priority not provided', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          name: 'Task with defaults',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.status).toBe('Pending');
          expect(res.body.data.priority).toBe('Blue');
        });
    });

    it('should fail validation when name is missing', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({})
        .expect(400);
    });
  });

  describe('GET /tasks', () => {
    it('should return paginated tasks', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .query({ page: 1, limit: 10 })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('items');
          expect(res.body.data).toHaveProperty('total');
          expect(res.body.data).toHaveProperty('page');
          expect(res.body.data).toHaveProperty('limit');
          expect(Array.isArray(res.body.data.items)).toBe(true);
        });
    });

    it('should filter tasks by status', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .query({ status: 'In Progress' })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          const items = res.body.data.items;
          if (items.length > 0) {
            items.forEach((task: any) => {
              expect(task.status).toBe('In Progress');
            });
          }
        });
    });

    it('should search tasks by name', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .query({ search: 'Test' })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a single task', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${createdTaskId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBe(createdTaskId);
        });
    });

    it('should return 404 for non-existent task', () => {
      return request(app.getHttpServer())
        .get('/tasks/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update a task', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .send({
          status: 'Done',
          priority: 'Blue',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.status).toBe('Done');
          expect(res.body.data.priority).toBe('Blue');
        });
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should soft delete a task', () => {
      return request(app.getHttpServer())
        .delete(`/tasks/${createdTaskId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.is_active).toBe(false);
        });
    });

    it('should not return soft deleted task in list', async () => {
      const res = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);
      
      const deletedTask = res.body.data.items.find((task: any) => task.id === createdTaskId);
      expect(deletedTask).toBeUndefined();
    });
  });
});
