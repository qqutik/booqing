import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSlots1791642989730 implements MigrationInterface {
  name = 'CreateSlots1791642989730';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."slots_status_enum" AS ENUM('available', 'held', 'booked')`,
    );
    await queryRunner.query(
      `CREATE TABLE "slots" ("id" SERIAL NOT NULL, "resource_id" integer NOT NULL, "status" "public"."slots_status_enum" NOT NULL DEFAULT 'available', "version" integer NOT NULL, "start_at" TIMESTAMP WITH TIME ZONE NOT NULL, "end_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_ee0101ad358b5e5b9d5349031c2" UNIQUE ("resource_id", "start_at"), CONSTRAINT "CHK_317a15452837cf9aa36a457f0a" CHECK (start_at < end_at), CONSTRAINT "PK_8b553bb1941663b63fd38405e42" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "slots" ADD CONSTRAINT "FK_77b6e7ebe14d4439453f0e195e3" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "slots" DROP CONSTRAINT "FK_77b6e7ebe14d4439453f0e195e3"`,
    );
    await queryRunner.query(`DROP TABLE "slots"`);
    await queryRunner.query(`DROP TYPE "public"."slots_status_enum"`);
  }
}
