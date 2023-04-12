import { MigrationInterface, QueryRunner } from "typeorm";

export class When1681339151360 implements MigrationInterface {
    name = 'When1681339151360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "button" ADD "when" text`);
        await queryRunner.query(`ALTER TABLE "network" ALTER COLUMN "location" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "button" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "button" ALTER COLUMN "location" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "location" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_949f58d0c692c7a10ec343a5663" FOREIGN KEY ("buttonId") REFERENCES "button"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_949f58d0c692c7a10ec343a5663"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "button" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "button" ALTER COLUMN "address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "network" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "when"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
