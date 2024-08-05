import { MigrationInterface, QueryRunner } from "typeorm";

export class ImagesComments1722853754108 implements MigrationInterface {
    name = 'ImagesComments1722853754108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "images" text array`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "images" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "images"`);
    }

}
