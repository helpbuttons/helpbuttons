import { MigrationInterface, QueryRunner } from "typeorm";

export class CommentPrivacy1690410128710 implements MigrationInterface {
    name = 'CommentPrivacy1690410128710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."comment_privacy_enum" AS ENUM('private', 'public')`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "privacy" "public"."comment_privacy_enum" NOT NULL DEFAULT 'public'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "privacy"`);
        await queryRunner.query(`DROP TYPE "public"."comment_privacy_enum"`);
    }

}
