import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { TasksStatus } from '../tasks-status-enum';

export class TaskStatusValidationsPipe implements PipeTransform {
  readonly allowedStatus = [
    TasksStatus.OPEN,
    TasksStatus.IN_PROGRESS,
    TasksStatus.DONE,
  ];

  transform(value: any, metadata: ArgumentMetadata) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is not valid`);
    }
    return value;
  }

  private isStatusValid(status: any) {
    const index = this.allowedStatus.indexOf(status);
    return index !== -1;
  }
}
