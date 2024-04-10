import { MigrationInterface, QueryRunner } from "typeorm";

export class BtnExpired1712157121597 implements MigrationInterface {
    name = 'BtnExpired1712157121597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" ADD "expired" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`UPDATE "button" SET expired = true, deleted = false where deleted = true`);
        await queryRunner.query(`drop view network_button_types; 
        create view network_button_types AS select type,count(id) from button WHERE deleted = false AND expired = false group by type`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "expired"`);
        await queryRunner.query(`drop view network_button_types; 
        create view network_button_types AS select type,count(id) from button group by type;`);
    }
}