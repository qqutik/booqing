import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoles1791361414642 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "roles" ("alias", "name")
        VALUES
          ('client',   'Client'),
          ('provider', 'Provider'),
          ('admin', 'Admin')
        ON CONFLICT ("alias") DO NOTHING
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "roles" WHERE "alias" IN ($1, $2, $3)`,
      ['client', 'provider', 'admin'],
    );
  }
}
