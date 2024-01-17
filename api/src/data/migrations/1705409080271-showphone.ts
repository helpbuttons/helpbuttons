import { MigrationInterface, QueryRunner } from "typeorm";

export class Showphone1705409080271 implements MigrationInterface {
    name = 'Showphone1705409080271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "publishPhone" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "publishPhone"`);
    }

}
