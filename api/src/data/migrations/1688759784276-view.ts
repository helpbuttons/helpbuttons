import { MigrationInterface, QueryRunner } from "typeorm";

export class View1688759784276 implements MigrationInterface {
    name = 'View1688759784276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`create view network_button_types AS select type,count(id) from button group by type;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop view network_button_types`);
    }

}
