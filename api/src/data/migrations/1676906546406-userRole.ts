import {MigrationInterface, QueryRunner} from "typeorm";

export class userRole1676906546406 implements MigrationInterface {
    name = 'userRole1676906546406'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "user" ADD "role" text NOT NULL DEFAULT 'registered'`);
        
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    }

}
