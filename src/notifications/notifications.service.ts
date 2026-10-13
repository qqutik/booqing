import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { NOTIFICATIONS_QUEUE } from './notifications.constants.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue(NOTIFICATIONS_QUEUE) private readonly queue: Queue,
    private readonly configService: ConfigService,
  ) {}

  public async sendBookingCreated(bookingId: number) {
    await this.queue.add('booking-created', { bookingId });
  }

  public async scheduleBookingReminder(bookingId: number, startAt: Date) {
    const hours = this.configService.getOrThrow<number>(
      'BOOKING_REMINDER_HOURS',
    );

    const delay = startAt.getTime() - hours * 60 * 60 * 1000 - Date.now();
    if (delay <= 0) {
      return;
    }

    await this.queue.add(
      'booking-reminder',
      { bookingId },
      { delay, jobId: `reminder-${bookingId}` },
    );
  }

  public async cancelBookingReminder(bookingId: number) {
    await this.queue.remove(`reminder-${bookingId}`);
  }
}
