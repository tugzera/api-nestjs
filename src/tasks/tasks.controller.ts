import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationsPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TasksStatus } from './tasks-status-enum';
import { TasksService } from './tasks.service';

@Controller('tasks') // route name
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  index(@Query(ValidationPipe) filters: GetTasksFilterDto): Promise<Task[]> {
    return this.taskService.index(filters);
  }

  @Get('/:id')
  show(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.show(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.taskService.delete(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationsPipe) status: TasksStatus,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, status);
  }
}
