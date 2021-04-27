import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { FilterTaskDto } from './dto/filter-task-dto';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';

const mockUser: User = new User();
mockUser.username = 'Test User';
mockUser.id = 12;   

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
    save: jest.fn()
});

describe('TasksService', () => {
    let tasksService: TasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository}
            ]
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('get all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('some value');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filterDTO: FilterTaskDto = {
                status: TaskStatus.IN_PROGRESS,
                search: ''
            };
            const result = await tasksService.getTasks(filterDTO, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('some value');
        });
    })

    describe('getTaskById', () => {
        it('calls TasksRepository.findOne() and succesfully retrieve and return the task', async () => {
            const mockTask = {title: 'test task', description: 'something'};
            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(1,mockUser);
            expect(result).toEqual(mockTask);

            expect(taskRepository.findOne).toHaveBeenCalledWith({where: {
                id: 1,
                userId: mockUser.id
            }})
        });
        it('throw an error if tasks is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1,mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createTask', () => {
        it('createTask should create a new task and return its value without the user', async () => {
            const mockTaskDTO: CreateTaskDTO = {
                title: 'new task',
                description: 'new task created'
            };
            taskRepository.createTask.mockResolvedValue(mockTaskDTO);

            const result = await tasksService.createTask(mockTaskDTO,mockUser);
            expect(taskRepository.createTask).toHaveBeenCalled();
            expect(result).toEqual(mockTaskDTO);
        });
    });

    describe('deleteTask', () => {
        it('deleteTask should pass if the task was deleted', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });
            expect(taskRepository.delete).not.toHaveBeenCalled();
            await tasksService.deleteTask(1,mockUser);
            expect(taskRepository.delete).toHaveBeenCalled();            
        });
        it('deleteTaks should throw error if the task does not exist', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });            
            expect(tasksService.deleteTask(1,mockUser)).rejects.toThrow(NotFoundException);   
        });
    });

    describe.only('updateTaskStatus', () => {
        it('update a task status', async () => {
            const save = jest.fn().mockResolvedValue(true);
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save
            });
            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            const result = await tasksService.updateTaskStatus(1,TaskStatus.DONE, mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);
        });

    });
});