import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
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
import { BookingStatusEnum } from './enums/booking-status.enum.js';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly repository: Repository<Booking>,
    private readonly slotService: SlotsService,
  ) {}

  public async findAll(userId: number) {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  public async findById(id: number) {
    const booking = await this.repository.findOneBy({ id });
    if (!booking) {
      throw new NotFoundException('Booking does not exist');
    }
    return booking;
  }

  public async create(dto: CreateBookingDto, userId: number) {
    const slot = await this.slotService.findById(dto.slotId);
    this.checkAvailableSlot(slot);

    slot.status = SlotStatusEnum.HELD;
    await this.slotService.save(slot);

    const booking = this.repository.create({ ...dto, userId });
    await this.repository.save(booking);

    return booking;
  }

  public async confirm(id: number, userId: number) {
    const booking = await this.findById(id);
    if (booking.userId !== userId) {
      throw new ForbiddenException('You cant confirm this booking');
    }
    if (booking.status !== BookingStatusEnum.PENDING){
      throw new ConflictException('Booking already confirmed or cancelled')
    }
      const slot = await this.slotService.findById(booking.slotId);

    slot.status = SlotStatusEnum.BOOKED;
    booking.status = BookingStatusEnum.CONFIRMED;

    await this.slotService.save(slot);
    await this.repository.save(booking);

    return booking;
  }

  public async cancel(id: number, userId: number) {
    const booking = await this.findById(id);
    if (booking.userId !== userId) {
      throw new ForbiddenException('You cant cancel this booking');
    }
    if (booking.status === BookingStatusEnum.CANCELLED) {
      throw new ConflictException('Booking already cancelled');
    }
    const slot = await this.slotService.findById(booking.slotId);

    slot.status = SlotStatusEnum.AVAILABLE;
    booking.status = BookingStatusEnum.CANCELLED;
    booking.cancelledAt = new Date();

    await this.slotService.save(slot);
    await this.repository.save(booking);

    return booking;
  }

  private checkAvailableSlot(slot: Slot) {
    if (slot.status !== SlotStatusEnum.AVAILABLE) {
      throw new ConflictException('Slot is not available');
    }
    if (slot.startAt < new Date()) {
      throw new BadRequestException('Slot time spent');
    }
  }
}
