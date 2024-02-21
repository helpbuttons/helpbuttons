import { MigrationInterface, QueryRunner } from "typeorm";

export class Commentreply1708544034393 implements MigrationInterface {
    name = 'Commentreply1708544034393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "commentParentId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "commentParentId"`);
    }

}
