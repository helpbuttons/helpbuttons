import { MigrationInterface, QueryRunner } from "typeorm";

export class Activity1762379441006 implements MigrationInterface {
    name = 'Activity1762379441006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" ADD "buttonId" character varying`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "fromId" character(36)`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "toId" character(36)`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "lastActivityButtonConsumer" boolean default true`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "lastActivityButtonOwner" boolean default true`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "consumerId" character(36)`);

        await queryRunner.query(`ALTER TABLE "user" ADD "follows" text array NOT NULL DEFAULT '{}'`);

        await queryRunner.query(`DELETE from activity`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "buttonId"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "toId"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "fromId"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "lastActivityButtonConsumer"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "consumerId"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "lastActivityButtonOwner"`);

        await queryRunner.query(`ALTER TABLE "activity" ADD "ownerId" character(36)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "follows"`);

    }

}
