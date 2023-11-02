import { MigrationInterface, QueryRunner } from "typeorm";

export class ButtonsProfile1698922012237 implements MigrationInterface {
    name = 'ButtonsProfile1698922012237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "showButtons" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "showButtons"`);
    }

}
