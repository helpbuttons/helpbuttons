import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActivityRead1689723953087 implements MigrationInterface {
    name = 'AddActivityRead1689723953087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" ADD "read" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "read"`);
    }

}
