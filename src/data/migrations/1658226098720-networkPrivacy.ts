import {MigrationInterface, QueryRunner} from "typeorm";

export class networkPrivacy1658226098720 implements MigrationInterface {
    name = 'networkPrivacy1658226098720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."network_privacy_enum" AS ENUM('public', 'private')`);
        await queryRunner.query(`ALTER TABLE "network" ADD "privacy" "public"."network_privacy_enum" DEFAULT 'public'`);
        await queryRunner.query(`ALTER TABLE "network" ALTER COLUMN "location" TYPE geography`);
        await queryRunner.query(`ALTER TABLE "button" ALTER COLUMN "location" TYPE geography`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "location" TYPE geography`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "location" TYPE geography(Geometry,0)`);
        await queryRunner.query(`ALTER TABLE "button" ALTER COLUMN "location" TYPE geography(Geometry,0)`);
        await queryRunner.query(`ALTER TABLE "network" ALTER COLUMN "location" TYPE geography(Geometry,0)`);
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "privacy"`);
        await queryRunner.query(`DROP TYPE "public"."network_privacy_enum"`);
    }

}
