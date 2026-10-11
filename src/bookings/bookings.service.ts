import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SlotsService } from '../slots/slots.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { SlotStatusEnum } from '../slots/enums/slot-status.enum.js';
import { Slot } from '../slots/entities/slot.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity.js';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly repository: Repository<Booking>,
    private readonly slotService: SlotsService,
  ) {}
  public async create(dto: CreateBookingDto, userId: number) {
    const slot = await this.slotService.findById(dto.slotId);
    this.checkAvailableSlot(slot);
    slot.status = SlotStatusEnum.HELD;
    await this.slotService.save(slot);
    const booking = this.repository.create({ ...dto, userId });
    await this.repository.save(booking);
    return booking;
  }

  private checkAvailableSlot(slot: Slot | null) {
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }
    if (slot.status !== SlotStatusEnum.AVAILABLE) {
      throw new ConflictException('Slot is not available');
    }
    if (slot.startAt < new Date()) {
      throw new BadRequestException('Slot time spent');
    }
  }
}
