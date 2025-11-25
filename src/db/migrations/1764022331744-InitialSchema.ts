import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1764022331744 implements MigrationInterface {
  name = 'InitialSchema1764022331744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "username" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "store" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_66df34da7fb037e24fc7fee642b" UNIQUE ("name"), CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_stores_store" ("productId" uuid NOT NULL, "storeId" uuid NOT NULL, CONSTRAINT "PK_75750aea71fb9b4613aa52370c3" PRIMARY KEY ("productId", "storeId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0942a4fd8412d70b5f1495aa9b" ON "product_stores_store" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f79579aab6801cb98985a809f" ON "product_stores_store" ("storeId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_stores_store" ADD CONSTRAINT "FK_0942a4fd8412d70b5f1495aa9bf" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_stores_store" ADD CONSTRAINT "FK_6f79579aab6801cb98985a809fa" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_stores_store" DROP CONSTRAINT "FK_6f79579aab6801cb98985a809fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_stores_store" DROP CONSTRAINT "FK_0942a4fd8412d70b5f1495aa9bf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6f79579aab6801cb98985a809f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0942a4fd8412d70b5f1495aa9b"`,
    );
    await queryRunner.query(`DROP TABLE "product_stores_store"`);
    await queryRunner.query(`DROP TABLE "store"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
