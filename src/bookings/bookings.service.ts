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
import {
  DataSource,
  type EntityManager,
  type FindOptionsRelations,
  In,
  MoreThan,
  Repository,
} from 'typeorm';
import { Booking } from './entities/booking.entity.js';
import { BookingStatusEnum } from './enums/booking-status.enum.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly repository: Repository<Booking>,
    private readonly slotService: SlotsService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  public async findAll(userId: number) {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  public async findById(id: number, relations?: FindOptionsRelations<Booking>) {
    const booking = await this.repository.findOne({
      where: { id },
      relations,
    });
    if (!booking) {
      throw new NotFoundException(`Booking #${id} does not exist`);
    }
    return booking;
  }

  public async create(dto: CreateBookingDto, userId: number) {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const slot = await manager.findOne(Slot, {
        where: { id: dto.slotId },
        relations: { resource: true },
        lock: { mode: 'pessimistic_write' },
      });
      if (!slot) {
        throw new NotFoundException(`Slot #${dto.slotId} does not exist`);
      }

      this.checkAvailableSlot(slot);
      await this.checkAvailableCreate(manager, slot, userId);

      slot.status = SlotStatusEnum.HELD;
      await manager.save(slot);

      const booking = manager.create(Booking, { ...dto, userId });
      return manager.save(booking);
    });
  }

  public async confirm(id: number, userId: number) {
    const booking = await this.findById(id);
    this.checkAvailableBookingConfirm(booking, userId);
    const slot = await this.slotService.findById(booking.slotId);

    slot.status = SlotStatusEnum.BOOKED;
    booking.status = BookingStatusEnum.CONFIRMED;

    await this.slotService.save(slot);
    await this.repository.save(booking);

    return booking;
  }

  public async cancel(id: number, userId: number) {
    const booking = await this.findById(id);
    const slot = await this.slotService.findById(booking.slotId);

    this.checkAvailableBookingCancel(booking, slot, userId);

    slot.status = SlotStatusEnum.AVAILABLE;
    booking.status = BookingStatusEnum.CANCELLED;
    booking.cancelledAt = new Date();

    await this.slotService.save(slot);
    await this.repository.save(booking);

    return booking;
  }

  private checkAvailableBookingConfirm(booking: Booking, userId: number) {
    if (booking.userId !== userId) {
      throw new ForbiddenException('You cant confirm this booking');
    }
    if (booking.status !== BookingStatusEnum.PENDING) {
      throw new ConflictException('Booking already confirmed or cancelled');
    }
  }

  private checkAvailableBookingCancel(
    booking: Booking,
    slot: Slot,
    userId: number,
  ) {
    if (booking.userId !== userId) {
      throw new ForbiddenException('You cant cancel this booking');
    }
    if (booking.status === BookingStatusEnum.CANCELLED) {
      throw new ConflictException('Booking already cancelled');
    }

    const minHours = this.configService.getOrThrow<number>(
      'BOOKING_CANCEL_MIN_HOURS',
    );
    const msLeft = slot.startAt.getTime() - Date.now();

    if (
      booking.status === BookingStatusEnum.CONFIRMED &&
      msLeft <= minHours * 60 * 60 * 1000
    ) {
      throw new ConflictException(
        `Booking can be cancelled only more than ${minHours} hours before the slot starts`,
      );
    }
  }

  private checkAvailableSlot(slot: Slot) {
    if (slot.status !== SlotStatusEnum.AVAILABLE) {
      throw new ConflictException('Slot is not available');
    }
    if (slot.startAt < new Date()) {
      throw new BadRequestException('Slot time spent');
    }
  }

  private async checkAvailableCreate(manager: EntityManager, slot: Slot, userId: number) {
    const activeBookingCount = await manager.count(Booking, {
      where: {
        userId,
        status: In([BookingStatusEnum.PENDING, BookingStatusEnum.CONFIRMED]),
        slot: {
          startAt: MoreThan(new Date()),
          resource: { type: slot.resource.type },
        },
      },
    });

    const maxActive = this.configService.getOrThrow<number>(
      'BOOKING_MAX_ACTIVE_PER_USER',
    );

    if (activeBookingCount >= maxActive) {
      throw new ConflictException(
        `You can have at most ${maxActive} active bookings for resource type "${slot.resource.type}"`,
      );
    }
  }
}
