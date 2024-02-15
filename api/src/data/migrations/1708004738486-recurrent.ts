import { MigrationInterface, QueryRunner } from "typeorm";

export class Recurrent1708004738486 implements MigrationInterface {
    name = 'Recurrent1708004738486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" ADD "eventData" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "eventData"`);
    }

}
