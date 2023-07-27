import { MigrationInterface, QueryRunner } from "typeorm";

export class Locale1690423599278 implements MigrationInterface {
    name = 'Locale1690423599278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "locale" text NOT NULL DEFAULT 'en'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "locale"`);
    }

}
