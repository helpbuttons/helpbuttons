import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationsUser1699887498367 implements MigrationInterface {
    name = 'NotificationsUser1699887498367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "tags" text array DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying NOT NULL default ''`);
        await queryRunner.query(`ALTER TABLE "user" ADD "center" geography`);
        await queryRunner.query(`ALTER TABLE "user" ADD "radius" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "outbox" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "radius"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "center"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "outbox"`);
    }

}
