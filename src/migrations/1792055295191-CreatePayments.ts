import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePayments1792055295191 implements MigrationInterface {
    name = 'CreatePayments1792055295191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payments_provider_enum" AS ENUM('stripe')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'completed', 'failed', 'refunded')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "provider" "public"."payments_provider_enum" NOT NULL DEFAULT 'stripe', "booking_id" integer NOT NULL, "user_id" integer NOT NULL, "payment_id" character varying(255), "checkout_id" character varying(255), "price" integer NOT NULL, "currency" character varying(3) NOT NULL DEFAULT 'UAH', "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending', "response" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_2c540326a039a91fa7e942caed7" UNIQUE ("uuid"), CONSTRAINT "UQ_8866a3cfff96b8e17c2b204aae0" UNIQUE ("payment_id"), CONSTRAINT "UQ_4cdcdfc34ae388c29a501c636a2" UNIQUE ("checkout_id"), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e86edf76dc2424f123b9023a2b" ON "payments"  ("booking_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_427785468fb7d2733f59e7d7d3" ON "payments"  ("user_id") `);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_e86edf76dc2424f123b9023a2b2" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_427785468fb7d2733f59e7d7d39" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_427785468fb7d2733f59e7d7d39"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_e86edf76dc2424f123b9023a2b2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_427785468fb7d2733f59e7d7d3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e86edf76dc2424f123b9023a2b"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_provider_enum"`);
    }

}
