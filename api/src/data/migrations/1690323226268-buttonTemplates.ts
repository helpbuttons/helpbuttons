import { MigrationInterface, QueryRunner } from "typeorm";

export class ButtonTemplates1690323226268 implements MigrationInterface {
    name = 'ButtonTemplates1690323226268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "buttonTemplates" text DEFAULT '[{"name":"offer","caption":"Offer","color":"custom","cssColor":"#FFDD02"},{"name":"need","caption":"Need","color":"custom","cssColor":"#19AF96"},{"caption":"Business","name":"business","cssColor":"#071315","customFields":[]},{"caption":"Event","name":"event","cssColor":"#c5d51b","customFields":[{"type":"event"}]},{"caption":"Selling","name":"selling","cssColor":"#d51bd1","customFields":[{"type":"price"}]}]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "buttonTemplates"`);
    }

}
