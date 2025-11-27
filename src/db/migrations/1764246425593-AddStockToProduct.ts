import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStockToProduct1764246425593 implements MigrationInterface {
    name = 'AddStockToProduct1764246425593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "stock" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "stock"`);
    }

}
