import { MigrationInterface, QueryRunner } from "typeorm";

export class Signupconfig1779376802741 implements MigrationInterface {
    name = 'Signupconfig1779376802741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "privacyNetworkType" character varying NOT NULL DEFAULT 'anyoneCan'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "privacyNetworkType"`);
    }

}
