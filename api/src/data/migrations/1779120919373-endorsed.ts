import { MigrationInterface, QueryRunner } from "typeorm";

export class Endorsed1779120919373 implements MigrationInterface {
    name = 'Endorsed1779120919373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."group_message_to_enum" ADD VALUE 'endorsed';`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
