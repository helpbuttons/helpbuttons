import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSlogantoNetwork1734636501563 implements MigrationInterface {
    name = 'AddSlogantoNetwork1734636501563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "slogan" character varying(200) NOT NULL DEFAULT ''`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "slogan"`);
    }

}
