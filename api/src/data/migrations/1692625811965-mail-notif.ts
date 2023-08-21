import { MigrationInterface, QueryRunner } from "typeorm";

export class MailNotif1692625811965 implements MigrationInterface {
    name = 'MailNotif1692625811965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "dontReceiveNotifications" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dontReceiveNotifications"`);
    }

}
