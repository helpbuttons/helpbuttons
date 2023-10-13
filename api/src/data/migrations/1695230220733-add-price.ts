import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrice1695230220733 implements MigrationInterface {
    name = 'AddPrice1695230220733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" ADD "price" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "network" ADD "currency" character varying NOT NULL DEFAULT 'EUR'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "currency"`);
    }

}
