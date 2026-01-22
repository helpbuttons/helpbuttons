import { MigrationInterface, QueryRunner } from "typeorm";

export class Groupmessage1768229330328 implements MigrationInterface {
    name = 'Groupmessage1768229330328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."group_message_to_enum" AS ENUM('community', 'admin')`);
        await queryRunner.query(`CREATE TABLE "group_message" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "to" "public"."group_message_to_enum" DEFAULT 'community', "message" character varying, "last" boolean NOT NULL DEFAULT false, "fromId" character(36), CONSTRAINT "PK_352d8ac0a05f84418d49b6fbffd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "readGroupMessages" jsonb NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {        
        await queryRunner.query(`DROP TABLE "group_message"`);
        await queryRunner.query(`DROP TYPE "public"."group_message_to_enum"`);
    }

}
