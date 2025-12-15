import { MigrationInterface, QueryRunner } from "typeorm";

export class Hasphone1764948406194 implements MigrationInterface {
    name = 'Hasphone1764948406194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "hasPhone" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`update public.user set "hasPhone" = true where phone <> ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hasPhone"`);
    }

}
