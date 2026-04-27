import { MigrationInterface, QueryRunner } from "typeorm";

export class Emailnull1777325440487 implements MigrationInterface {
    name = 'Emailnull1777325440487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "address" DROP DEFAULT`);
    }

}
