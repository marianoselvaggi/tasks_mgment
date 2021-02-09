import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task-dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) {}

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getFilterTasks(filterTaskDto: FilterTaskDto): Task[] {
  //   const { status, search } = filterTaskDto;
    
  //   let tasks = this.getAllTasks();
  //   if(status) {
  //       tasks = tasks.filter(task => task.status === status);
  //   }
  //   if(search) {
  //       tasks = tasks.filter(task => {
  //           return task.description.includes(search) ||
  //           task.title.includes(search)
  //       })
  //   }
  //   return tasks;
  // }

  async getTaskById(id:number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);

    if(!task) {
      throw new NotFoundException(`The task with id "${id}" does not exist.`);
    }

    return task;
  }

  async createTask(createTaskDTO: CreateTaskDTO) {
    return this.taskRepository.createTask(createTaskDTO);{}
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;

    await task.save();
    return task;
  }

  async deleteTask(id:number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`The task with id "${id}" does not exist.`); 
    }
  }
}
