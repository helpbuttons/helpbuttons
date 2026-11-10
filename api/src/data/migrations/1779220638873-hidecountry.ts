import { MigrationInterface, QueryRunner } from "typeorm";

export class Hidecountry1779220638873 implements MigrationInterface {
    name = 'Hidecountry1779220638873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "hideCountryOnAddresses" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "hideCountryOnAddresses"`);
    }

}
