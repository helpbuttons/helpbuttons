import { MigrationInterface, QueryRunner } from "typeorm";

export class Hexagon1682210126961 implements MigrationInterface {
    name = 'Hexagon1682210126961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "hexagons" text array DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "network" ADD "resolution" integer NOT NULL DEFAULT '10'`);
        await queryRunner.query(`ALTER TABLE "network" ADD "tiletype" text NOT NULL DEFAULT 'osm'`);
        await queryRunner.query(`ALTER TABLE "button" ADD "hexagons" text array DEFAULT '{}'`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "resolution"`);
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "hexagons"`);
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "tiletype"`);
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "hexagons"`);
    }

}
