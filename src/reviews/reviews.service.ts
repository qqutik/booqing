import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { BookingsService } from '../bookings/bookings.service.js';
import {
  type FindOptionsRelations,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { Review } from './entities/review.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingStatusEnum } from '../bookings/enums/booking-status.enum.js';
import type { Booking } from '../bookings/entities/booking.entity.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly repository: Repository<Review>,
    private readonly bookingsService: BookingsService,
  ) {}

  public async findAll(resourceId: number, { page, limit }: PaginationDto) {
    const [items, total] = await this.repository.findAndCount({
      where: { resourceId },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { id: true, name: true },
      },
      relations: { user: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  public async findById(id: number, relations?: FindOptionsRelations<Review>) {
    const review = await this.repository.findOne({
      where: { id },
      relations,
    });
    if (!review) {
      throw new NotFoundException(`Review #${id} does not exist`);
    }
    return review;
  }

  public async create(bookingId: number, dto: CreateReviewDto, userId: number) {
    const booking = await this.bookingsService.findById(bookingId, {
      slot: true,
    });
    this.checkAvailableBooking(booking, userId);
    const resourceId = booking.slot.resourceId;
    const review = this.repository.create({
      ...dto,
      bookingId,
      resourceId,
      userId,
    });

    try {
      return await this.repository.save(review);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '23505'
      ) {
        throw new ConflictException('Review is not available');
      }
      throw error;
    }
  }

  public async delete(id: number, userId: number) {
    const review = await this.findById(id);
    if (review.userId !== userId) {
      throw new ForbiddenException('Invalid user review');
    }
    return await this.repository.delete({ id, userId });
  }

  public async getRating(resourceId: number) {
    const { average, count } = await this.repository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .addSelect('COUNT(*)', 'count')
      .where('review.resourceId = :resourceId', { resourceId })
      .getRawOne();
    return {
      average: average === null ? null : Number(Number(average).toFixed(1)),
      count: Number(count),
    };
  }

  private checkAvailableBooking(booking: Booking, userId: number) {
    if (booking.userId !== userId) {
      throw new ForbiddenException('Invalid booking');
    }
    if (booking.status !== BookingStatusEnum.COMPLETED) {
      throw new ConflictException('Booking not completed');
    }
  }
}
