import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { ReviewsController } from './reviews.controller.js';
import { Review } from './entities/review.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsModule } from '../bookings/bookings.module.js';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [BookingsModule,TypeOrmModule.forFeature([Review])],
  exports: [ReviewsService],
})
export class ReviewsModule {}
