import {MigrationInterface, QueryRunner} from "typeorm";

export class avatarUser1673488994735 implements MigrationInterface {
    name = 'avatarUser1673488994735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" text`);
        await queryRunner.query(`ALTER TABLE "network" ALTER COLUMN "location" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "button" ALTER COLUMN "location" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "location" TYPE geometry`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "button" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "network" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    }

}
