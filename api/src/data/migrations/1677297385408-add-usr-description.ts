import {MigrationInterface, QueryRunner} from "typeorm";

export class addUsrDescription1677297385408 implements MigrationInterface {
    name = 'addUsrDescription1677297385408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "description" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "description" DROP NOT NULL`);
    }

}
