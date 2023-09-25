import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNetworkCurrency1695659116880 implements MigrationInterface {
    name = 'AddNetworkCurrency1695659116880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "currency" character varying NOT NULL DEFAULT 'EUR'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "currency"`);
    }

}
