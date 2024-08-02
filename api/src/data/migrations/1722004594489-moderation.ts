import { MigrationInterface, QueryRunner } from "typeorm";

export class Moderation1722004594489 implements MigrationInterface {
    name = 'Moderation1722004594489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" ADD "awaitingApproval" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "network" ADD "requireApproval" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "homeinfo" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`drop view network_button_types`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "awaitingApproval"`);
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "requireApproval"`);
        await queryRunner.query(`create view network_button_types AS select type,count(id) from button group by type;`);
        
    }

}
