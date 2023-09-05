import { MigrationInterface, QueryRunner } from "typeorm";

export class ButtonTemplates1690323226268 implements MigrationInterface {
    name = 'ButtonTemplates1690323226268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "buttonTemplates" text DEFAULT '[{"name":"offer","caption":"Offer","color":"custom","cssColor":"#FFDD02"},{"name":"need","caption":"Need","color":"custom","cssColor":"#19AF96"},{"name":"service","caption":"Service","color":"custom","cssColor":"pink"}]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "buttonTemplates"`);
    }

}
