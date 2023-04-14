import { MigrationInterface, QueryRunner } from "typeorm";

export class Activity1681507012922 implements MigrationInterface {
    name = 'Activity1681507012922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "activity" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "data" character varying NOT NULL, "eventName" character varying NOT NULL, "ownerId" character(36), CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`);
        
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_2e32cff695a62ac42865ea087e2" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_2e32cff695a62ac42865ea087e2"`);
        
        await queryRunner.query(`DROP TABLE "activity"`);
    }

}
