import { MigrationInterface, QueryRunner } from "typeorm";

export class When1681339151360 implements MigrationInterface {
    name = 'When1681339151360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" ADD "when" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "when"`);
    }

}
