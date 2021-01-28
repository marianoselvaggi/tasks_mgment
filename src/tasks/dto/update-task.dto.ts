import { TaskStatus } from "../task.model";

export class UpdateTaskDTO {
    status: TaskStatus;
    id: string;
}