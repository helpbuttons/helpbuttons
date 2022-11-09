import {MigrationInterface, QueryRunner} from "typeorm";

export class nameForUesr1663085150254 implements MigrationInterface {
    name = 'nameForUesr1663085150254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying(320) NOT NULL default 'unknown'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
   }

}
