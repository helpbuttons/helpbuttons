import { MigrationInterface, QueryRunner } from "typeorm";

export class NetworkLocale1694099793866 implements MigrationInterface {
    name = 'NetworkLocale1694099793866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "locale" character varying NOT NULL DEFAULT 'en'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "locale"`);
    }

}
