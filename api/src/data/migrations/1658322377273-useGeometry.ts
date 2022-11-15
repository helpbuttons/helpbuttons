import {MigrationInterface, QueryRunner} from "typeorm";

export class useGeometry1658322377273 implements MigrationInterface {
    name = 'useGeometry1658322377273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "network" ADD "location" geometry NOT NULL`);
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "button" ADD "location" geometry NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "location" geometry NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "location" geography(Geometry,0) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "button" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "button" ADD "location" geography(Geometry,0) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "network" ADD "location" geography(Geometry,0) NOT NULL`);
    }

}
