import { MigrationInterface, QueryRunner } from "typeorm";

export class ButtonCustomAddr1743678905914 implements MigrationInterface {
    name = 'ButtonCustomAddr1743678905914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" ADD "isCustomAddress" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "isCustomAddress"`);
    }

}
