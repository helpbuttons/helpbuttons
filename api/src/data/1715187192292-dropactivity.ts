import { MigrationInterface, QueryRunner } from "typeorm";

export class Dropactivity1715187192292 implements MigrationInterface {
    name = 'Dropactivity1715187192292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`delete from activity`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
