import {MigrationInterface, QueryRunner} from "typeorm";

export class buttonAddress1677011468756 implements MigrationInterface {
    name = 'buttonAddress1677011468756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" ADD "address" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "address"`);
    }

}
