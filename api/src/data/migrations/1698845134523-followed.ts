import { MigrationInterface, QueryRunner } from "typeorm";

export class Followed1698845134523 implements MigrationInterface {
    name = 'Followed1698845134523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" ADD "followedBy" text array DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "followedBy"`);
    }

}
