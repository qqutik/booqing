import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrices1791825214571 implements MigrationInterface {
    name = 'AddPrices1791825214571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "working_hours" ADD "price" integer`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "price" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "currency" character varying(3) NOT NULL DEFAULT 'UAH'`);
        await queryRunner.query(`ALTER TABLE "resources" ADD "currency" character varying(3) NOT NULL DEFAULT 'UAH'`);
        await queryRunner.query(`ALTER TABLE "resources" ADD "price" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "slots" ADD "price" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "working_hours" ADD CONSTRAINT "CHK_79feee94655cf0aa2404954943" CHECK (price >= 0)`);
        await queryRunner.query(`ALTER TABLE "resources" ADD CONSTRAINT "CHK_49bb2ddd8f1abd54d9fa76f157" CHECK (price >= 0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resources" DROP CONSTRAINT "CHK_49bb2ddd8f1abd54d9fa76f157"`);
        await queryRunner.query(`ALTER TABLE "working_hours" DROP CONSTRAINT "CHK_79feee94655cf0aa2404954943"`);
        await queryRunner.query(`ALTER TABLE "slots" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "resources" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "resources" DROP COLUMN "currency"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "currency"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "working_hours" DROP COLUMN "price"`);
    }

}
