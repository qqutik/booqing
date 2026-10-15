import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { BookingsController } from './bookings.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity.js';
import { SlotsModule } from '../slots/slots.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { BookingsScheduler } from './bookings.scheduler.js';
import { LockModule } from '../lock/lock.module.js';
import { PaymentsModule } from '../payments/payments.module.js';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, BookingsScheduler],
  imports: [
    LockModule,
    SlotsModule,
    PaymentsModule,
    NotificationsModule,
    TypeOrmModule.forFeature([Booking]),
  ],
  exports: [BookingsService],
})
export class BookingsModule {}
