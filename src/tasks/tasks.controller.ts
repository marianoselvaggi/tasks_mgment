import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // @Get()
  // getTasks(@Query(ValidationPipe) filterTaskDto: FilterTaskDto): Task[] {
  //   if(Object.keys(filterTaskDto).length) {
  //       return this.tasksService.getFilterTasks(filterTaskDto);
  //   } else {
  //       return this.tasksService.getAllTasks();
  //   }
  // }

  @Get('/:id')
  getTaskById(@Param('id',ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksService.createTask(createTaskDTO);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id',ParseIntPipe) id: number,
    @Body('status',TaskStatusValidationPipe) status: TaskStatus
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id,status);
  }

  @Delete('/:id')
  deleteTask(@Param('id',ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.deleteTask(id);
  }
}
