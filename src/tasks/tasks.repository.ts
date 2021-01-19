import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TasksStatus } from './tasks-status-enum';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async index(filters: GetTasksFilterDto): Promise<Task[]> {
    const { search, status } = filters;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const status = TasksStatus.OPEN;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = status;
    await task.save();
    return task;
  }
}
