import { MigrationInterface, QueryRunner } from "typeorm";

export class Wassap1733740087156 implements MigrationInterface {
    name = 'Wassap1733740087156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "showWassap" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "showWassap"`);
    }

}
