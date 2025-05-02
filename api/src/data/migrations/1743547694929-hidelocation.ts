import { MigrationInterface, QueryRunner } from "typeorm";

export class Hidelocation1743547694929 implements MigrationInterface {
    name = 'Hidelocation1743547694929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "hideLocationDefault" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "hideLocationDefault"`);
    }

}
