import { MigrationInterface, QueryRunner } from "typeorm";

export class Changeres1770830297223 implements MigrationInterface {
    name = 'Changeres1770830297223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`update button set hexagon = h3_lat_lng_to_cell(POINT(button.longitude, button.latitude), 12)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`update button set hexagon = h3_lat_lng_to_cell(POINT(button.longitude, button.latitude), 8)`);
    }

}