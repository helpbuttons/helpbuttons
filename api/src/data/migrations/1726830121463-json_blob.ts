import { MigrationInterface, QueryRunner } from "typeorm";

export class JsonBlob1726830121463 implements MigrationInterface {
    name = 'JsonBlob1726830121463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE activity ALTER data TYPE JSONB USING data::JSONB`);
        await queryRunner.query(`create view activity_object as select id,data->'button'->'id' as button_id, data->'post'->'id' as post_id  from activity ;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
