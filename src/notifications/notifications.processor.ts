import { NOTIFICATIONS_QUEUE } from './notifications.constants.js';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { MailService } from './mail.service.js';
import { Job } from 'bullmq';
import { DateTime } from 'luxon';
import { Booking } from '../bookings/entities/booking.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingStatusEnum } from '../bookings/enums/booking-status.enum.js';

@Processor(NOTIFICATIONS_QUEUE)
export class NotificationsProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Booking)
    private readonly bookings: Repository<Booking>,
    private readonly mailService: MailService,
  ) {
    super();
  }

  public async process(job: Job<{ bookingId: number }>) {
    const booking = await this.bookings.findOne({
      where: { id: job.data.bookingId },
      relations: { user: true, slot: { resource: true } },
    });

    if (!booking) {
      return;
    }

    const startAt = DateTime.fromJSDate(booking.slot.startAt)
      .setZone(booking.user.timezone)
      .toFormat('dd.MM.yyyy HH:mm');

    if (job.name === 'booking-created') {
      return this.confirmationMail(booking, startAt);
    }

    if (job.name === 'booking-reminder') {
      return this.reminderMail(booking, startAt);
    }

  }

  private async confirmationMail(booking: Booking, startAt: string) {
    if (booking.confirmationSentAt) {
      return;
    }
    const price = (booking.price / 100).toFixed(2);

    await this.mailService.send(
      booking.user.email,
      'Booking created',
      `${booking.slot.resource.name}, ${startAt}, ${price} ${booking.currency}`,
    );
    await this.bookings.update(booking.id, { confirmationSentAt: new Date() });
    return;
  }

  private async reminderMail(booking: Booking, startAt: string) {
    if (
      booking.status !== BookingStatusEnum.CONFIRMED ||
      booking.reminderSentAt
    ) {
      return;
    }
    await this.mailService.send(
      booking.user.email,
      'Booking reminder',
      `${booking.slot.resource.name}, ${startAt}`,
    );
    await this.bookings.update(booking.id, { reminderSentAt: new Date() });
    return;
  }
}
