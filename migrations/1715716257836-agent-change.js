const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AgentChange1715716257836 {
    name = 'AgentChange1715716257836'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP COLUMN \`clientLastName\``);
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD \`clientLastName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`agent\` CHANGE \`phoneNumber\` \`phoneNumber\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`agent\` CHANGE \`address\` \`address\` varchar(255) NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`agent\` CHANGE \`address\` \`address\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`agent\` CHANGE \`phoneNumber\` \`phoneNumber\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP COLUMN \`clientLastName\``);
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD \`clientLastName\` varchar(255) NULL`);
    }
}
