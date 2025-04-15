import { MigrationInterface, QueryRunner } from "typeorm";

export class PinButton1733423397000 implements MigrationInterface {
  name = 'pinButton1733423397000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "button" ADD "pin" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "pin"`);
  }
}
