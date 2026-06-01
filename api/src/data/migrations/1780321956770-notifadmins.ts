import { MigrationInterface, QueryRunner } from "typeorm";

export class Notifadmins1780321956770 implements MigrationInterface {
    name = 'Notifadmins1780321956770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."group_message_eventname_enum" AS ENUM('awaitApproval.button')`);
        await queryRunner.query(`ALTER TABLE "group_message" ADD "eventName" "public"."group_message_eventname_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "group_message" ADD "link" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_message" DROP COLUMN "link"`);
        await queryRunner.query(`ALTER TABLE "group_message" DROP COLUMN "eventName"`);
        await queryRunner.query(`DROP TYPE "public"."group_message_eventname_enum"`);
    }

}
