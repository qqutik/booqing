import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateWorkingHoursDto } from './dto/create-working-hours.dto.js';
import { ResourcesService } from '../resources/resources.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkingHours } from './entities/working-hours.entity.js';
import { ReplaceWorkingHoursDto } from './dto/replace-working-hours.dto.js';

@Injectable()
export class WorkingHoursService {
  constructor(
    @InjectRepository(WorkingHours)
    private readonly repository: Repository<WorkingHours>,
    private readonly resourceService: ResourcesService,
  ) {}

  public async create(
    dto: CreateWorkingHoursDto,
    resourceId: number,
    userId: number,
  ) {
    await this.checkAvailableResource(resourceId, userId);

    const intervals = await this.repository.find({
      where: { resourceId, weekday: dto.weekday },
    });

    this.checkAvailableHours(dto, intervals);

    const workingHours = this.repository.create({
      ...dto,
      resourceId,
    });
    return this.repository.save(workingHours);
  }

  public async sync(
    dto: ReplaceWorkingHoursDto,
    resourceId: number,
    userId: number,
  ) {
    await this.checkAvailableResource(resourceId, userId);
    this.checkIntervals(dto.intervals);

    return this.repository.manager.transaction(async (manager) => {
      await manager.delete(WorkingHours, { resourceId });
      const workingHours = dto.intervals.map((interval) =>
        manager.create(WorkingHours, { ...interval, resourceId }),
      );
      return manager.save(workingHours);
    });
  }

  public async findAll(resourceId: number){
    await this.resourceService.findById(resourceId);
    return this.repository.find({
      where: { resourceId: resourceId },
      order: { weekday: 'ASC', startTime: 'ASC' },
    });
  };

  private checkIntervals(intervals: CreateWorkingHoursDto[]) {
    const byWeekday = new Map<number, CreateWorkingHoursDto[]>();

    for (const interval of intervals) {
      if (interval.startTime >= interval.endTime) {
        throw new BadRequestException('Start time must be before end time');
      }
      const group = byWeekday.get(interval.weekday) ?? [];
      group.push(interval);
      byWeekday.set(interval.weekday, group);
    }

    for (const group of byWeekday.values()) {
      group.sort((a, b) => a.startTime.localeCompare(b.startTime));
      let previous: CreateWorkingHoursDto | undefined;
      for (const interval of group) {
        if (previous && interval.startTime < previous.endTime) {
          throw new BadRequestException(
            `Intervals overlap on weekday ${interval.weekday}`,
          );
        }
        previous = interval;
      }
    }
  }

  private async checkAvailableResource(resourceId: number, userId: number) {
    const resource = await this.resourceService.findById(resourceId);
    if (resource.userId !== userId) {
      throw new ForbiddenException(`Resource #${resourceId} cant be changed`);
    }
  }

  private checkAvailableHours(
    dto: CreateWorkingHoursDto,
    intervals: WorkingHours[],
  ) {
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('Start time must be before end time');
    }
    for (const interval of intervals) {
      const startTime = interval.startTime.slice(0, 5);
      const endTime = interval.endTime.slice(0, 5);
      if (dto.startTime < endTime && dto.endTime > startTime) {
        throw new ConflictException(
          `Interval overlaps with ${startTime}–${endTime}`,
        );
      }
    }
  }
}
