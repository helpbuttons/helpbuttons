import { MigrationInterface, QueryRunner } from "typeorm";

export class Customplaces1742468505256 implements MigrationInterface {
    name = 'Customplaces1742468505256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`create view custom_places as select latitude,longitude,address,location,hexagon from button;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP VIEW custom_places;`);
    }

}
