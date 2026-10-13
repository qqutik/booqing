import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { NOTIFICATIONS_QUEUE } from './notifications.constants.js';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsProcessor } from './notifications.processor.js';
import { MailService } from './mail.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../bookings/entities/booking.entity.js';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    BullBoardModule.forFeature({
      name: NOTIFICATIONS_QUEUE,
      adapter: BullMQAdapter,
    }),
    BullModule.registerQueue({
      name: NOTIFICATIONS_QUEUE,
      defaultJobOptions: {
        attempts: 5,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      },
    }),
  ],
  providers: [NotificationsService, MailService, NotificationsProcessor],
  exports: [NotificationsService],
})
export class NotificationsModule {}
