import { MigrationInterface, QueryRunner } from "typeorm";

export class ButtonHideAddress1694680457115 implements MigrationInterface {
    name = 'ButtonHideAddress1694680457115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" ADD "hideAddress" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "hideAddress"`);
    }

}
