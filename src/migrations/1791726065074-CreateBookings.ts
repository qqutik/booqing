import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBookings1791726065074 implements MigrationInterface {
  name = 'CreateBookings1791726065074';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bookings_status_enum" AS ENUM('pending', 'confirmed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bookings" ("id" SERIAL NOT NULL, "slot_id" integer NOT NULL, "user_id" integer NOT NULL, "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'pending', "cancelled_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_409d5b76fb2b0501a8c72dd4ee" ON "bookings"  ("slot_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_64cd97487c5c42806458ab5520" ON "bookings"  ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_409d5b76fb2b0501a8c72dd4eeb" FOREIGN KEY ("slot_id") REFERENCES "slots"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_64cd97487c5c42806458ab5520c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_64cd97487c5c42806458ab5520c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_409d5b76fb2b0501a8c72dd4eeb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_64cd97487c5c42806458ab5520"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_409d5b76fb2b0501a8c72dd4ee"`,
    );
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
  }
}
