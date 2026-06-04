import { MigrationInterface, QueryRunner } from "typeorm";

export class Key1760367510371 implements MigrationInterface {
    name = 'Key1760367510371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "key_location" ADD "zoom" integer NOT NULL DEFAULT 7`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "key_location" DROP COLUMN "zoom"`);
    }

}
