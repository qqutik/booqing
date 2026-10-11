import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { BookingsController } from './bookings.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity.js';
import { SlotsModule } from '../slots/slots.module.js';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
  imports: [SlotsModule,TypeOrmModule.forFeature([Booking])],
})
export class BookingsModule {}
