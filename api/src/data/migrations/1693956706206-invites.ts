import { MigrationInterface, QueryRunner } from "typeorm";

export class Invites1693956706206 implements MigrationInterface {
    name = 'Invites1693956706206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" ADD "inviteOnly" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE TABLE "invite" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "usage" integer NOT NULL, "maximumUsage" integer NOT NULL, "expiration" TIMESTAMP, "deleted" boolean NOT NULL DEFAULT false, "ownerId" character(36), CONSTRAINT "PK_fc9fa190e5a3c5d80604a4f63e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_5a1d04aae4cb54ee4ad13f64ea0" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "inviteOnly"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_5a1d04aae4cb54ee4ad13f64ea0"`);
        await queryRunner.query(`DROP TABLE "invite"`);
    }

}
