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
  QueryFailedError,
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
    try {
      return await this.dataSource.transaction(
        async (manager: EntityManager) => {
          const slot = await manager.findOne(Slot, {
            where: { id: dto.slotId },
            relations: { resource: true },
          });
          if (!slot) {
            throw new NotFoundException(`Slot #${dto.slotId} does not exist`);
          }

          this.checkAvailableSlot(slot);
          await this.checkAvailableCreate(manager, slot, userId);

          const result = await manager.update(
            Slot,
            {
              id: slot.id,
              version: slot.version,
              status: SlotStatusEnum.AVAILABLE,
            },
            { status: SlotStatusEnum.HELD },
          );

          if (result.affected === 0) {
            throw new ConflictException('Slot is not available');
          }

          const booking = manager.create(Booking, {
            ...dto,
            userId,
            price: slot.price,
            currency: slot.resource.currency,
          });
          return manager.save(booking);
        },
      );
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '23505' &&
        error.driverError.constraint === 'unique_bookings_active_slot'
      ) {
        throw new ConflictException('Slot is not available');
      }
      throw error;
    }
  }

  public async confirm(id: number, userId: number) {
    return await this.dataSource.transaction(
      async (manager: EntityManager) => {
        // Lock the booking row so concurrent confirm and cancel requests run one after another:
        // the second one waits, re-reads the updated status and fails the check instead of overwriting the first.
        const booking = await manager.findOne(Booking, {
          where: { id },
          lock: { mode: 'pessimistic_write' },
        });
        if (!booking) {
          throw new NotFoundException(`Booking #${id} does not exist`);
        }

        this.checkAvailableBookingConfirm(booking, userId);

        const slot = await manager.findOne(Slot, {
          where: { id: booking.slotId },
        });
        if (!slot) {
          throw new NotFoundException(`Slot #${booking.slotId} does not exist`);
        }

        slot.status = SlotStatusEnum.BOOKED;
        booking.status = BookingStatusEnum.CONFIRMED;

        await manager.save(Slot, slot);
        await manager.save(Booking, booking);

        return booking;
      }
    );

  }

  public async cancel(id: number, userId: number) {
    return await this.dataSource.transaction(
      async (manager: EntityManager) => {

        const booking = await manager.findOne(Booking, {
          where: { id },
          lock: { mode: 'pessimistic_write' },
        });
        if (!booking) {
          throw new NotFoundException(`Booking #${id} does not exist`);
        }

        const slot = await manager.findOne(Slot, {
          where: { id: booking.slotId },
        });
        if (!slot) {
          throw new NotFoundException(`Slot #${booking.slotId} does not exist`);
        }

        this.checkAvailableBookingCancel(booking, slot, userId);

        slot.status = SlotStatusEnum.AVAILABLE;
        booking.status = BookingStatusEnum.CANCELLED;
        booking.cancelledAt = new Date();

        await manager.save(Slot, slot);
        await manager.save(Booking, booking);

        return booking;
      }
    );
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
