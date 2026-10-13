import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueActiveBookingPerSlot1791821771221 implements MigrationInterface {
  name = 'AddUniqueActiveBookingPerSlot1791821771221';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_409d5b76fb2b0501a8c72dd4ee"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "unique_bookings_active_slot" ON "bookings"  ("slot_id") WHERE "status" <> 'cancelled'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."unique_bookings_active_slot"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_409d5b76fb2b0501a8c72dd4ee" ON "bookings" USING btree ("slot_id") `,
    );
  }
}
