import { MigrationInterface, QueryRunner } from "typeorm";

export class Updateview1688990809985 implements MigrationInterface {
    name = 'Updateview1688990809985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop view network_button_types`);
        await queryRunner.query(`create view network_button_types AS select type,count(id) from button where deleted = false group by type;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop view network_button_types`);
        await queryRunner.query(`create view network_button_types AS select type,count(id) from button group by type;`);
    }

}
