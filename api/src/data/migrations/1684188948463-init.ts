import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1684188948463 implements MigrationInterface {
    name = 'Init1684188948463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE extension h3`);
        await queryRunner.query(`CREATE TABLE "user_credential" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "password" character varying NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_12ba5f444da355e51efd7a1ff4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character(36) NOT NULL, "realm" character varying, "username" character varying(320) NOT NULL, "email" character varying(320) NOT NULL, "name" character varying(320), "email_verified" boolean, "verification_token" character varying, "role" text NOT NULL DEFAULT 'registered', "description" text NOT NULL, "avatar" text, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_ec61bf398131704605f7963d837" UNIQUE ("verification_token"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "data" character varying NOT NULL, "eventName" character varying NOT NULL, "ownerId" character(36), CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."network_privacy_enum" AS ENUM('public', 'private')`);
        await queryRunner.query(`CREATE TABLE "network" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "name" character varying, "description" character varying NOT NULL, "url" character varying, "privacy" "public"."network_privacy_enum" DEFAULT 'public', "tags" text array DEFAULT '{}', "logo" text, "jumbo" text, "address" character varying, "exploreSettings" character varying NOT NULL, CONSTRAINT "PK_8f8264c2d37cbbd8282ee9a3c97" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "message" character varying NOT NULL, "postId" character varying, "authorId" character(36), CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "message" character varying NOT NULL, "authorId" character(36), "buttonId" character varying, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "button" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "address" character varying, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "location" geometry NOT NULL, "type" character varying NOT NULL, "image" text, "tags" text array DEFAULT '{}', "images" text array, "when" text, "hexagon" text NOT NULL, "networkId" character varying, "ownerId" character(36), CONSTRAINT "PK_a4df4e4f7a5882bc94442d3f209" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image_file" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "name" character varying NOT NULL, "mimetype" character varying NOT NULL, "originalname" character varying NOT NULL, CONSTRAINT "PK_a63c149156c13fef954c6f56398" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "tag" character varying NOT NULL, "modelName" character varying, "modelId" character varying, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."template_button_type_enum" AS ENUM('need', 'exchange', 'offer')`);
        await queryRunner.query(`CREATE TABLE "template_button" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "type" "public"."template_button_type_enum" NOT NULL, "formFields" character varying NOT NULL, CONSTRAINT "PK_08b0afe6564754216b6c4847295" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(320) NOT NULL, "description" character varying NOT NULL, "languages" text array DEFAULT '{}', "defaultLanguage" character varying NOT NULL, "location" geometry NOT NULL, "receiveNotifications" boolean NOT NULL DEFAULT false, "phone" character varying NOT NULL, "telegram" character varying NOT NULL, "whatsapp" character varying NOT NULL, "interests" text array DEFAULT '{}', CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_2e32cff695a62ac42865ea087e2" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_949f58d0c692c7a10ec343a5663" FOREIGN KEY ("buttonId") REFERENCES "button"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "button" ADD CONSTRAINT "FK_7db87c397024d9d6c665852f21e" FOREIGN KEY ("networkId") REFERENCES "network"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "button" ADD CONSTRAINT "FK_9204e111a49a16e2720b4d85b88" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" DROP CONSTRAINT "FK_9204e111a49a16e2720b4d85b88"`);
        await queryRunner.query(`ALTER TABLE "button" DROP CONSTRAINT "FK_7db87c397024d9d6c665852f21e"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_949f58d0c692c7a10ec343a5663"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_2e32cff695a62ac42865ea087e2"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "template_button"`);
        await queryRunner.query(`DROP TYPE "public"."template_button_type_enum"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "image_file"`);
        await queryRunner.query(`DROP TABLE "button"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "network"`);
        await queryRunner.query(`DROP TYPE "public"."network_privacy_enum"`);
        await queryRunner.query(`DROP TABLE "activity"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_credential"`);
    }

}
