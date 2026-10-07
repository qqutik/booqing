import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserType1791374775449 implements MigrationInterface {
  name = 'AddUserType1791374775449';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_type_enum" AS ENUM('client', 'provider')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "type" "public"."users_type_enum" NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."users_type_enum"`);
  }
}
