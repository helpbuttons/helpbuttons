import { MigrationInterface, QueryRunner } from "typeorm";

export class Event1696612189785 implements MigrationInterface {
    name = 'Event1696612189785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" ADD "eventStart" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "button" ADD "eventEnd" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "when"`);
        await queryRunner.query(`ALTER TABLE "button" ADD "eventType" character varying`);
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "button" ADD "price" double precision DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "eventEnd"`);
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "eventStart"`);
    }

}
