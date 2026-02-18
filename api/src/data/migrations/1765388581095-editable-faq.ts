import { MigrationInterface, QueryRunner } from "typeorm";

export class EditableFaq1765388581095 implements MigrationInterface {
    name = 'EditableFaq1765388581095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "privacyPolicy" character varying NOT NULL DEFAULT 'Text to complete by administrators'`);
        await queryRunner.query(`ALTER TABLE "network" ADD "ethicsPolicy" character varying NOT NULL DEFAULT 'Text to complete by administrators'`);
        await queryRunner.query(`ALTER TABLE "network" ADD "contactEmail" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "contactEmail"`);
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "ethicsPolicy"`);
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "privacyPolicy"`);
    }

}
