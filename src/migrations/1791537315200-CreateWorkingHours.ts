import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkingHours1791537315200 implements MigrationInterface {
    name = 'CreateWorkingHours1791537315200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "working_hours" ("id" SERIAL NOT NULL, "resource_id" integer NOT NULL, "weekday" smallint NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_90e65f69b15d7bc2b8d151f7ffd" UNIQUE ("resource_id", "weekday", "start_time"), CONSTRAINT "CHK_10c85dc91e37f4152cd544e855" CHECK (weekday BETWEEN 1 AND 7), CONSTRAINT "CHK_7d53eb7b716c30c3981c31c859" CHECK (start_time < end_time), CONSTRAINT "PK_5f84d2fa3953367fe9d704d8df6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "working_hours" ADD CONSTRAINT "FK_ba4ea8ce328c90315d7a1070054" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "working_hours" DROP CONSTRAINT "FK_ba4ea8ce328c90315d7a1070054"`);
        await queryRunner.query(`DROP TABLE "working_hours"`);
    }

}
