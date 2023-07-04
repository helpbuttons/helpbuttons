import { MigrationInterface, QueryRunner } from "typeorm"


export class Migration111111111111 implements MigrationInterface {
    name = '111111111111-migration'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`create view network_button_types AS select type,count(id) from button group by type;`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop view network_button_types`)
    }
}