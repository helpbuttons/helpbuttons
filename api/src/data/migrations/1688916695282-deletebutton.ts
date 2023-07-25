import { MigrationInterface, QueryRunner } from "typeorm";

export class Deletebutton1688916695282 implements MigrationInterface {
    name = 'Deletebutton1688916695282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" ADD "deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "post" ADD "deleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "deleted"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "deleted"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "deleted"`);
    }

}
