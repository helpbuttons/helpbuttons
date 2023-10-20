import { MigrationInterface, QueryRunner } from "typeorm";

export class LocaleNetwork1697635582135 implements MigrationInterface {
    name = 'LocaleNetwork1697635582135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "locale" character varying NOT NULL DEFAULT 'en'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "locale"`);
    }

}
