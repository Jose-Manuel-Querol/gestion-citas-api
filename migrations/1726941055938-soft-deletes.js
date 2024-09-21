const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class SoftDeletes1726941055938 {
    name = 'SoftDeletes1726941055938'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`day\` ADD \`deleted\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`agent\` ADD \`deleted\` tinyint NOT NULL DEFAULT 0`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`agent\` DROP COLUMN \`deleted\``);
        await queryRunner.query(`ALTER TABLE \`day\` DROP COLUMN \`deleted\``);
    }
}
