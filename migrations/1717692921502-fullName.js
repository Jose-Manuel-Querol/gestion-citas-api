const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class FullName1717692921502 {
    name = 'FullName1717692921502'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`agent\` ADD \`fullName\` varchar(255) NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`agent\` DROP COLUMN \`fullName\``);
    }
}
