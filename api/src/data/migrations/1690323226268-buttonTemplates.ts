import { MigrationInterface, QueryRunner } from "typeorm";

export class ButtonTemplates1690323226268 implements MigrationInterface {
    name = 'ButtonTemplates1690323226268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "buttonTemplates" text DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "buttonTemplates"`);
    }

}
