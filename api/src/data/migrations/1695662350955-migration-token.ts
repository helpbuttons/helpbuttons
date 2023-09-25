import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationToken1695662350955 implements MigrationInterface {
    name = 'MigrationToken1695662350955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE public.user DROP COLUMN "verification_token"`);
        await queryRunner.query(`ALTER TABLE public.user ADD COLUMN "verification_token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
