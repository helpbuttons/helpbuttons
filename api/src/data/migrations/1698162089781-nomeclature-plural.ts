import { MigrationInterface, QueryRunner } from "typeorm";

export class NomeclaturePlural1698162089781 implements MigrationInterface {
    name = 'NomeclaturePlural1698162089781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "nomeclaturePlural" character varying NOT NULL DEFAULT 'helpButtons'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "nomeclaturePlural"`);
    }

}
