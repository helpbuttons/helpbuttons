import { MigrationInterface, QueryRunner } from "typeorm";

export class Qrcode1727295662057 implements MigrationInterface {
    name = 'Qrcode1727295662057'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "user" ADD "qrcode" text`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "qrcode"`);
    }

}
