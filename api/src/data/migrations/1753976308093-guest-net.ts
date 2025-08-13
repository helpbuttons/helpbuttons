import { MigrationInterface, QueryRunner } from "typeorm";

export class GuestNet1753976308093 implements MigrationInterface {
    name = 'GuestNet1753976308093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "allowGuestCreation" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "allowGuestCreation"`);
    }

}
