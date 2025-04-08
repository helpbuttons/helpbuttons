import { MigrationInterface, QueryRunner } from "typeorm";

export class ButtonCustomAddr1743678905914 implements MigrationInterface {
    name = 'ButtonCustomAddr1743678905914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" ADD "isCustomAddress" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`drop view custom_places`);
        await queryRunner.query(`create view custom_places as select latitude,longitude,address,location,hexagon from button where "isCustomAddress" = true;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "isCustomAddress"`);
        await queryRunner.query(`drop view custom_places`);
        await queryRunner.query(`create view custom_places as select latitude,longitude,address,location,hexagon from button`);
    }

}
