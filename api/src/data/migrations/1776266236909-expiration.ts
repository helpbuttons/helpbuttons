import { MigrationInterface, QueryRunner } from "typeorm";

export class Expiration1776266236909 implements MigrationInterface {
    name = 'Expiration1776266236909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" ADD "expirationDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "expirationDate"`);
    }

}
