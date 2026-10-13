import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookingNotificationTimestamps1791881181054 implements MigrationInterface {
  name = 'AddBookingNotificationTimestamps1791881181054';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD "confirmation_sent_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD "reminder_sent_at" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP COLUMN "reminder_sent_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP COLUMN "confirmation_sent_at"`,
    );
  }
}
