import { MigrationInterface, QueryRunner } from "typeorm";

export class AddressNetwork1681472488652 implements MigrationInterface {
    name = 'AddressNetwork1681472488652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "address" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "address"`);    
    }

}
