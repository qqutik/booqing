import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateResources1791529858984 implements MigrationInterface {
    name = 'CreateResources1791529858984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."resources_type_enum" AS ENUM('room', 'table', 'consultation', 'apartment')`);
        await queryRunner.query(`CREATE TABLE "resources" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "type" "public"."resources_type_enum" NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "slot_duration_minutes" integer NOT NULL, "name" character varying(255) NOT NULL, "description" text, "image" character varying(255), "timezone" character varying(255) NOT NULL DEFAULT 'UTC', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_632484ab9dff41bba94f9b7c85e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_78844f2d9f8da7d87d8dbff479" ON "resources"  ("user_id") `);
        await queryRunner.query(`ALTER TABLE "resources" ADD CONSTRAINT "FK_78844f2d9f8da7d87d8dbff4794" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resources" DROP CONSTRAINT "FK_78844f2d9f8da7d87d8dbff4794"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78844f2d9f8da7d87d8dbff479"`);
        await queryRunner.query(`DROP TABLE "resources"`);
        await queryRunner.query(`DROP TYPE "public"."resources_type_enum"`);
    }

}
