import { MigrationInterface, QueryRunner } from "typeorm";

export class Pushnotif1783442019277 implements MigrationInterface {
    name = 'Pushnotif1783442019277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "endpoint" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD "p256dh" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD "auth" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD "expirationTime" text`);


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "endpoint"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expirationTime"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "auth"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "p256dh"`);
    }

}
