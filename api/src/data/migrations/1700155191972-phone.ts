import { MigrationInterface, QueryRunner } from "typeorm";

export class Phone1700155191972 implements MigrationInterface {
    name = 'Phone1700155191972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" text`);
        await queryRunner.query(`ALTER TABLE "button" ADD "hasPhone" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "hasPhone"`);

    }

}
