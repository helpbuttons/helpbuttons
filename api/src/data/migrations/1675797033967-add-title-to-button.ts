import {MigrationInterface, QueryRunner} from "typeorm";

export class addTitleToButton1675797033967 implements MigrationInterface {
    name = 'addTitleToButton1675797033967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "network" ALTER COLUMN "location" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "button" ALTER COLUMN "location" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."button_type_enum"`);
        await queryRunner.query(`ALTER TABLE "button" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "location" TYPE geometry`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."button_type_enum" AS ENUM('offer', 'need', 'exchange')`);
        await queryRunner.query(`ALTER TABLE "button" ADD "type" "public"."button_type_enum" NOT NULL DEFAULT 'need'`);
        await queryRunner.query(`ALTER TABLE "button" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "network" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "title"`);
    }

}
