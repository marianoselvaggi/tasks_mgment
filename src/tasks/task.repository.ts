import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { FilterTaskDto } from './dto/filter-task-dto';
import { User } from '../auth/user.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async getTasks(
    filterTaskDto: FilterTaskDto,
    user: User
  ): Promise<Task[]> {
    const { status, search } = filterTaskDto;

    const query = this.createQueryBuilder('task');

    query.andWhere('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status LIKE :status', { status });
    }

    if (search) {
      query.andWhere('task.title LIKE :search OR task.description LIKE :search', {
        search: `%${search}%`,
      });
    }

    try {
      const tasks = await query.getMany();

      return tasks;
    } catch(error) {
      this.logger.error(`Error to retrieve tasks for user ${user.username}. Filters: ${JSON.stringify(filterTaskDto)}.`,error.stack);
    }
  }

  async createTask(
    createTaskDTO: CreateTaskDTO,
    user: User
  ): Promise<Task> {
    const { title, description } = createTaskDTO;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    await task.save();

    delete task.user;
    return task;
  }
}
