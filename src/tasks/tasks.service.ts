import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task-dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getFilterTasks(filterTaskDto: FilterTaskDto): Task[] {
    const { status, search } = filterTaskDto;
    
    let tasks = this.getAllTasks();
    if(status) {
        tasks = tasks.filter(task => task.status === status);
    }
    if(search) {
        tasks = tasks.filter(task => {
            return task.description.includes(search) ||
            task.title.includes(search)
        })
    }
    return tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find(task => task.id === id);
    
    if(!task) {
      throw new NotFoundException(`The task with id "${id}" does not exist.`);
    }
    
    return task;
  }

  createTask(createTaskDTO: CreateTaskDTO): Task {
    const { title, description } = createTaskDTO;
    const task: Task = {
      title,
      description,
      status: TaskStatus.OPEN,
      id: uuidv4(),
    };

    this.tasks.push(task);

    return task;
  }

  updateTaskStatus(id: string, updateTaskDTO: UpdateTaskDTO): Task {
    const { status } = updateTaskDTO;
    const task = this.getTaskById(id);
    task.status = status;

    return task;
  }

  deleteTask(id: string) {
    const found = this.getTaskById(id);
    this.tasks.filter(task => task.id !== found.id);
  }
}
