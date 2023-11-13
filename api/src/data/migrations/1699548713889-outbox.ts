import { MigrationInterface, QueryRunner } from "typeorm";

export class Outbox1699548713889 implements MigrationInterface {
    name = 'Outbox1699548713889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" ADD "outbox" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "outbox"`);
    }

}
