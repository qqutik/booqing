import { Injectable, Logger } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LockService } from '../lock/lock.service.js';

@Injectable()
export class BookingsScheduler {
  private readonly logger = new Logger(BookingsScheduler.name);

  constructor(
    private readonly bookingsService: BookingsService,
    private readonly lockService: LockService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  public async expirePendingBookings() {
    await this.lockService.runExclusive(
      'expire-pending-bookings',
      50_000,
      async () => {
        const count = await this.bookingsService.expirePending();
        if (count > 0) {
          this.logger.log(`Expired ${count} pending bookings`);
        }
      },
    );
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  public async completePastBookings() {
    await this.lockService.runExclusive(
      'complete-past-bookings',
      540_000,
      async () => {
        const count = await this.bookingsService.completePast();
        if (count > 0) {
          this.logger.log(`Completed ${count} past bookings`);
        }
      },
    );
  }
}
