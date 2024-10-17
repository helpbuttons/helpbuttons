import { MigrationInterface, QueryRunner } from "typeorm";

export class Networksettings1727821532429 implements MigrationInterface {
    name = 'Networksettings1727821532429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE network ALTER "exploreSettings" TYPE JSONB USING "exploreSettings"::JSONB`);
        
        await queryRunner.query(`ALTER TABLE network ADD COLUMN temp character varying`);
        await queryRunner.query(`UPDATE network set temp = "buttonTemplates"`);
        await queryRunner.query(`ALTER TABLE network ALTER temp TYPE JSONB USING temp::JSONB`);

        await queryRunner.query(`ALTER TABLE network DROP COLUMN "buttonTemplates"`);
        await queryRunner.query(`ALTER TABLE network ADD COLUMN "buttonTemplates" character JSONB`);
        await queryRunner.query(`UPDATE network set "buttonTemplates" = temp`);
        await queryRunner.query(`UPDATE network DROP COLUMN temp`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}