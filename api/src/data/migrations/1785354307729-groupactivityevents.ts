import { MigrationInterface, QueryRunner } from "typeorm";

export class Groupactivityevents1785354307729 implements MigrationInterface {
    name = 'Groupactivityevents1785354307729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."group_message_eventname_enum" RENAME TO "group_message_eventname_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."group_message_eventname_enum" AS ENUM('awaitApproval.button', 'community.eventtomorrow', 'followers.eventtomorrow')`);
        await queryRunner.query(`ALTER TABLE "group_message" ALTER COLUMN "eventName" TYPE "public"."group_message_eventname_enum" USING "eventName"::"text"::"public"."group_message_eventname_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
