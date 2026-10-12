import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, type FindOptionsRelations, Repository } from 'typeorm';
import { Slot } from './entities/slot.entity.js';
import { ResourcesService } from '../resources/resources.service.js';
import { WorkingHoursService } from '../working-hours/working-hours.service.js';
import { DateTime } from 'luxon';
import type { WorkingHoursInterface } from '../working-hours/interfaces/working-hours.interface.js';
import type { SlotsInterface } from './interfaces/slots.interface.js';
import { GetSlotsDto } from './dto/get-slots.dto.js';
import { SlotStatusEnum } from './enums/slot-status.enum.js';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slot)
    private readonly repository: Repository<Slot>,
    private readonly resourceService: ResourcesService,
    private readonly workingHoursService: WorkingHoursService,
  ) {}

  public async findById(id: number, relations?: FindOptionsRelations<Slot>) {
    const slot = await this.repository.findOne({
      where: { id },
      relations,
    });
    if (!slot) {
      throw new NotFoundException(`Slot #${id} does not exist`);
    }
    return slot;
  }

  public async save(slot: Slot) {
    return await this.repository.save(slot);
  }

  public async findAll(resourceId: number, dto: GetSlotsDto) {
    const resource = await this.resourceService.findById(resourceId);
    if (!resource) {
      throw new BadRequestException('Resource not found');
    }
    const timezone = dto.timezone ?? resource.timezone;

    const fromDate = DateTime.fromISO(dto.from, { zone: timezone })
      .startOf('day')
      .toJSDate();
    const toDate = DateTime.fromISO(dto.to, { zone: timezone })
      .endOf('day')
      .toJSDate();
    if (fromDate > toDate) {
      throw new BadRequestException('Date interval incorrect');
    }

    const slots = await this.repository.find({
      where: {
        resourceId,
        ...(dto.status ? { status: dto.status } : {}),
        startAt: Between(fromDate, toDate),
      },
      order: { startAt: 'ASC' },
    });

    return slots.map((slot) => {
      return {
        id: slot.id,
        resourceId: slot.resourceId,
        status: slot.status,
        startAt: DateTime.fromJSDate(slot.startAt).setZone(timezone).toISO(),
        endAt: DateTime.fromJSDate(slot.endAt).setZone(timezone).toISO(),
      };
    });
  }

  public async generate(resourceId: number, userId: number) {
    const resource = await this.resourceService.findById(resourceId);
    if (resource.userId !== userId) {
      throw new ForbiddenException('Resource not found');
    }
    const workingHours = await this.workingHoursService.findAll(resourceId);
    const slots = this.syncSlots(
      resource.slotDurationMinutes,
      workingHours,
      14,
      DateTime.now().setZone(resource.timezone),
    );
    if (slots.length === 0) {
      throw new BadRequestException('No working hours found');
    }
    const slotsData = slots.map((slot) => {
      return { ...slot, resourceId };
    });
    await this.repository
      .createQueryBuilder()
      .insert()
      .values(slotsData)
      .orIgnore()
      .execute();
    return slotsData;
  }

  public syncSlots(
    duration: number,
    intervals: WorkingHoursInterface[],
    days: number,
    startDate: DateTime,
  ): SlotsInterface[] {
    const result: SlotsInterface[] = [];

    for (let i = 0; i < days; i++) {
      //поточна дата початок дня
      const day = startDate.plus({ days: i }).startOf('day');
      //дістаються тільки години поточного дня
      const workingHours = intervals.filter((interval) => {
        return interval.weekday === day.weekday;
      });

      for (const workingHour of workingHours) {
        const startTime = workingHour.startTime.split(':');
        const endTime = workingHour.endTime.split(':');
        //перетворення строки в дату start & end
        const start = day.set({
          hour: parseInt(startTime[0]),
          minute: parseInt(startTime[1]),
        });
        const end = day.set({
          hour: parseInt(endTime[0]),
          minute: parseInt(endTime[1]),
        });

        let cursor = start;

        while (cursor.plus({ minutes: duration }) <= end) {
          result.push({
            startAt: cursor.toJSDate(),
            endAt: cursor.plus({ minutes: duration }).toJSDate(),
          });
          cursor = cursor.plus({ minutes: duration });
        }
      }
    }
    return result;
  }
}
