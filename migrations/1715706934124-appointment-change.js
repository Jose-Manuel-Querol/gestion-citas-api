const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AppointmentChange1715706934124 {
    name = 'AppointmentChange1715706934124'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD \`clientLastName\` varchar(255) NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP COLUMN \`clientLastName\``);
    }
}
