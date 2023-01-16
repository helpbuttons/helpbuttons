import {MigrationInterface, QueryRunner} from "typeorm";

export class addimagetobutton1673818376201 implements MigrationInterface {
    name = 'addimagetobutton1673818376201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" ADD "image" text`);
        await queryRunner.query(`ALTER TABLE "network" ALTER COLUMN "location" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "button" ALTER COLUMN "location" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "location" TYPE geometry`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "button" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "network" ALTER COLUMN "location" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "image"`);
    }

}
