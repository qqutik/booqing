import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExpiredAndCompletedBookingStatuses1791914378795 implements MigrationInterface {
  name = 'AddExpiredAndCompletedBookingStatuses1791914378795';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."bookings_status_enum" ADD VALUE 'expired'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."bookings_status_enum" ADD VALUE 'completed'`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."unique_bookings_active_slot"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "unique_bookings_active_slot" ON "bookings" ("slot_id") WHERE "status" IN ('pending', 'confirmed')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."unique_bookings_active_slot"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."bookings_status_enum_old" AS ENUM('pending', 'confirmed', 'cancelled')`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ALTER COLUMN "status" TYPE "public"."bookings_status_enum_old" USING "status"::"text"::"public"."bookings_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );
    await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."bookings_status_enum_old" RENAME TO "bookings_status_enum"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "unique_bookings_active_slot" ON "bookings" ("slot_id") WHERE "status" <> 'cancelled'`,
    );
  }
}
