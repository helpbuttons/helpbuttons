import { MigrationInterface, QueryRunner } from "typeorm";

export class Endorse1747390622155 implements MigrationInterface {
    name = 'Endorse1747390622155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "endorsed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "endorsed"`);
    }

}
