import { MigrationInterface, QueryRunner } from "typeorm";

export class Keylocation1758725283739 implements MigrationInterface {
    name = 'Keylocation1758725283739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "key_location" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "address" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "location" geometry NOT NULL, "hexagon" text NOT NULL, CONSTRAINT "PK_e8a59f443ff3cbd205a29a2cf60" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "key_location"`);
    }

}
