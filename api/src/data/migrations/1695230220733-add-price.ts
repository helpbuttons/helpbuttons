import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrice1695230220733 implements MigrationInterface {
    name = 'AddPrice1695230220733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" ADD "price" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "price"`);
    }

}
