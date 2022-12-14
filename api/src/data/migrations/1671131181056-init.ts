import {MigrationInterface, QueryRunner} from "typeorm";

export class init1671131181056 implements MigrationInterface {
    name = 'init1671131181056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_credential" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "password" character varying NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_12ba5f444da355e51efd7a1ff4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character(36) NOT NULL, "realm" character varying, "username" character varying(320) NOT NULL, "email" character varying(320) NOT NULL, "name" character varying(320), "email_verified" boolean, "verification_token" character varying, "roles" character varying array NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_ec61bf398131704605f7963d837" UNIQUE ("verification_token"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "feed_button" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "message" character varying NOT NULL, "buttonId" character varying, "authorId" character(36), CONSTRAINT "PK_7a219f5f3c1196e3d41a259b7d4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."network_privacy_enum" AS ENUM('public', 'private')`);
        await queryRunner.query(`CREATE TABLE "network" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "name" character varying, "description" character varying NOT NULL, "url" character varying, "privacy" "public"."network_privacy_enum" DEFAULT 'public', "radius" double precision NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "location" geometry NOT NULL, "tags" text array DEFAULT '{}', "logo" text, "jumbo" text, CONSTRAINT "PK_8f8264c2d37cbbd8282ee9a3c97" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."button_type_enum" AS ENUM('offer', 'need', 'exchange')`);
        await queryRunner.query(`CREATE TABLE "button" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "description" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "location" geometry NOT NULL, "type" "public"."button_type_enum" NOT NULL DEFAULT 'need', "tags" text array DEFAULT '{}', "images" text array, "networkId" character varying, "ownerId" character(36), CONSTRAINT "PK_a4df4e4f7a5882bc94442d3f209" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image_file" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "name" character varying NOT NULL, "mimetype" character varying NOT NULL, "originalname" character varying NOT NULL, CONSTRAINT "PK_a63c149156c13fef954c6f56398" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "tag" character varying NOT NULL, "modelName" character varying, "modelId" character varying, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."template_button_type_enum" AS ENUM('need', 'exchange', 'offer')`);
        await queryRunner.query(`CREATE TABLE "template_button" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "type" "public"."template_button_type_enum" NOT NULL, "formFields" character varying NOT NULL, CONSTRAINT "PK_08b0afe6564754216b6c4847295" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(320) NOT NULL, "description" character varying NOT NULL, "languages" text array DEFAULT '{}', "defaultLanguage" character varying NOT NULL, "location" geometry NOT NULL, "receiveNotifications" boolean NOT NULL DEFAULT false, "phone" character varying NOT NULL, "telegram" character varying NOT NULL, "whatsapp" character varying NOT NULL, "interests" text array DEFAULT '{}', CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "feed_button" ADD CONSTRAINT "FK_b967706ecd589a3f1ee89184a72" FOREIGN KEY ("buttonId") REFERENCES "button"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feed_button" ADD CONSTRAINT "FK_7dbdc0b2af8bdbff04a47abbab4" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "button" ADD CONSTRAINT "FK_7db87c397024d9d6c665852f21e" FOREIGN KEY ("networkId") REFERENCES "network"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "button" ADD CONSTRAINT "FK_9204e111a49a16e2720b4d85b88" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "button" DROP CONSTRAINT "FK_9204e111a49a16e2720b4d85b88"`);
        await queryRunner.query(`ALTER TABLE "button" DROP CONSTRAINT "FK_7db87c397024d9d6c665852f21e"`);
        await queryRunner.query(`ALTER TABLE "feed_button" DROP CONSTRAINT "FK_7dbdc0b2af8bdbff04a47abbab4"`);
        await queryRunner.query(`ALTER TABLE "feed_button" DROP CONSTRAINT "FK_b967706ecd589a3f1ee89184a72"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "template_button"`);
        await queryRunner.query(`DROP TYPE "public"."template_button_type_enum"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "image_file"`);
        await queryRunner.query(`DROP TABLE "button"`);
        await queryRunner.query(`DROP TYPE "public"."button_type_enum"`);
        await queryRunner.query(`DROP TABLE "network"`);
        await queryRunner.query(`DROP TYPE "public"."network_privacy_enum"`);
        await queryRunner.query(`DROP TABLE "feed_button"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_credential"`);
    }

}
