import { MigrationInterface, QueryRunner } from "typeorm";

export class MultiImages1697717240440 implements MigrationInterface {
    name = 'MultiImages1697717240440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE button SET images = STRING_TO_ARRAY(image, ' ') WHERE image IS NOT NULL;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
