import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly validStatuses = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];

  transform(value: any) {
    const status = value.toUpperCase();
    if (!this.isStatusValid(status)) {
      throw new BadRequestException(`${status} is not a valid status.`);
    }
    return value;
  }

  private isStatusValid(status: any) {
    return this.validStatuses.indexOf(status) !== -1;
  }
}
