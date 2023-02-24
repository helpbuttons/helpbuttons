import {MigrationInterface, QueryRunner} from "typeorm";

export class addDescriptionToUser1677203542867 implements MigrationInterface {
    name = 'addDescriptionToUser1677203542867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "description"`);
    }

}
