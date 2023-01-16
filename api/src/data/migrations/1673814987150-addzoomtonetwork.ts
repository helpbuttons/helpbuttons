import {MigrationInterface, QueryRunner} from "typeorm";

export class addzoomtonetwork1673814987150 implements MigrationInterface {
    name = 'addzoomtonetwork1673814987150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "zoom" integer NOT NULL DEFAULT '10'`);
        await queryRunner.query(`ALTER TABLE "network" ALTER COLUMN "location" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "button" ALTER COLUMN "location" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "location" TYPE geometry`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "button" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "network" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "zoom"`);
    }

}
