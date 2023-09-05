import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColor1689899168370 implements MigrationInterface {
    name = 'AddColor1689899168370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "backgroundColor" character varying NOT NULL DEFAULT '#FFDD02'`);
        await queryRunner.query(`ALTER TABLE "network" ADD "textColor" character varying NOT NULL DEFAULT '#0E0E0E'`);
        await queryRunner.query(`ALTER TABLE "network" ADD "nomeclature" character varying NOT NULL DEFAULT 'helpButton'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "nomeclature"`);
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "backgroundColor"`);
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "textColor"`);
    }

}
