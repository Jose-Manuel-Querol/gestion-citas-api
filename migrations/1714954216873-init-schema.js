const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class InitSchema1714954216873 {
    name = 'InitSchema1714954216873'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`address\` (\`addressId\` int NOT NULL AUTO_INCREMENT, \`addressType\` varchar(255) NULL, \`code\` int NULL, \`addressName\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`zoneZoneId\` int NULL, PRIMARY KEY (\`addressId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`appointment_type\` (\`appointmentTypeId\` int NOT NULL AUTO_INCREMENT, \`typeName\` varchar(255) NOT NULL, \`duration\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`appointmentTypeId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`franja\` (\`franjaId\` int NOT NULL AUTO_INCREMENT, \`startingHour\` varchar(255) NOT NULL, \`endingHour\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dayDayId\` int NULL, PRIMARY KEY (\`franjaId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`day\` (\`dayId\` int NOT NULL AUTO_INCREMENT, \`dayName\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`appointmentTypeAgentAppointmentTypeAgentId\` int NULL, PRIMARY KEY (\`dayId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`location\` (\`locationId\` int NOT NULL AUTO_INCREMENT, \`locationName\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`addressNro\` varchar(255) NULL, \`fullAddress\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`zoneZoneId\` int NULL, PRIMARY KEY (\`locationId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`appointment\` (\`appointmentId\` int NOT NULL AUTO_INCREMENT, \`clientName\` varchar(255) NOT NULL, \`clientPhoneNumber\` varchar(255) NOT NULL, \`clientAddress\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`startingHour\` varchar(255) NOT NULL, \`endingHour\` varchar(255) NULL, \`cancelled\` tinyint NOT NULL DEFAULT 0, \`cancelledBy\` varchar(255) NULL, \`dayDate\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`appointmentTypeAgentAppointmentTypeAgentId\` int NULL, \`locationLocationId\` int NULL, \`dayDayId\` int NULL, PRIMARY KEY (\`appointmentId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`appointment_type_agent\` (\`appointmentTypeAgentId\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`appointmentTypeAppointmentTypeId\` int NULL, \`agentAgentId\` int NULL, PRIMARY KEY (\`appointmentTypeAgentId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role\` (\`roleId\` int NOT NULL AUTO_INCREMENT, \`roleName\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`roleId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`account\` (\`accountId\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`resetPasswordToken\` varchar(255) NULL, \`verificationTokenExpiration\` datetime NULL, \`apiToken\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`roleRoleId\` int NULL, \`agentAgentId\` int NULL, UNIQUE INDEX \`IDX_4c8f96ccf523e9a3faefd5bdd4\` (\`email\`), UNIQUE INDEX \`IDX_f268ef5c7b257ab1520f12895d\` (\`apiToken\`), UNIQUE INDEX \`REL_e080d3981ac769dab1bbd23284\` (\`agentAgentId\`), PRIMARY KEY (\`accountId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vacation_day\` (\`vacationDayId\` int NOT NULL AUTO_INCREMENT, \`vacationDayDate\` datetime NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`agentAgentId\` int NULL, PRIMARY KEY (\`vacationDayId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`agent\` (\`agentId\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`slug\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`city\` varchar(255) NULL, \`dni\` varchar(255) NULL, \`phoneNumber\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`addressNro\` varchar(255) NULL, \`fullAddress\` varchar(255) NULL, \`vacationStart\` datetime NULL, \`vacationEnd\` datetime NULL, \`vacation\` tinyint NOT NULL DEFAULT 0, \`active\` tinyint NOT NULL DEFAULT 1, \`activationStart\` datetime NULL, \`activationEnd\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`zoneZoneId\` int NULL, UNIQUE INDEX \`IDX_6afd1141ee4df210692f0d025f\` (\`slug\`), UNIQUE INDEX \`IDX_c8e51500f3876fa1bbd4483ecc\` (\`email\`), PRIMARY KEY (\`agentId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`zone\` (\`zoneId\` int NOT NULL AUTO_INCREMENT, \`zoneName\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`zoneId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`holiday\` (\`holidayId\` int NOT NULL AUTO_INCREMENT, \`holidayDate\` datetime NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`holidayId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`address\` ADD CONSTRAINT \`FK_502e759d79259ed74e60450474a\` FOREIGN KEY (\`zoneZoneId\`) REFERENCES \`zone\`(\`zoneId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`franja\` ADD CONSTRAINT \`FK_3f731c5ae161cdae2fbf6e1aca9\` FOREIGN KEY (\`dayDayId\`) REFERENCES \`day\`(\`dayId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`day\` ADD CONSTRAINT \`FK_cab08de912ff29cc2683cffe96f\` FOREIGN KEY (\`appointmentTypeAgentAppointmentTypeAgentId\`) REFERENCES \`appointment_type_agent\`(\`appointmentTypeAgentId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`location\` ADD CONSTRAINT \`FK_147727273601c71938b5e0f3b7d\` FOREIGN KEY (\`zoneZoneId\`) REFERENCES \`zone\`(\`zoneId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD CONSTRAINT \`FK_62f0bf768e6a7fbc6bb39e475c2\` FOREIGN KEY (\`appointmentTypeAgentAppointmentTypeAgentId\`) REFERENCES \`appointment_type_agent\`(\`appointmentTypeAgentId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD CONSTRAINT \`FK_4ab1c4922d2ab533e11cae30f7e\` FOREIGN KEY (\`locationLocationId\`) REFERENCES \`location\`(\`locationId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD CONSTRAINT \`FK_eedc185a064ae496f02de9faf27\` FOREIGN KEY (\`dayDayId\`) REFERENCES \`day\`(\`dayId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointment_type_agent\` ADD CONSTRAINT \`FK_6a42e149b904580fe445aebb37d\` FOREIGN KEY (\`appointmentTypeAppointmentTypeId\`) REFERENCES \`appointment_type\`(\`appointmentTypeId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointment_type_agent\` ADD CONSTRAINT \`FK_96eafd8b259cea93cc6b902d85d\` FOREIGN KEY (\`agentAgentId\`) REFERENCES \`agent\`(\`agentId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`account\` ADD CONSTRAINT \`FK_1016ebc7de6f10b7e92c065d275\` FOREIGN KEY (\`roleRoleId\`) REFERENCES \`role\`(\`roleId\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`account\` ADD CONSTRAINT \`FK_e080d3981ac769dab1bbd232849\` FOREIGN KEY (\`agentAgentId\`) REFERENCES \`agent\`(\`agentId\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vacation_day\` ADD CONSTRAINT \`FK_c7d7a2611530a07eb203ca8bc77\` FOREIGN KEY (\`agentAgentId\`) REFERENCES \`agent\`(\`agentId\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`agent\` ADD CONSTRAINT \`FK_2117c260fa04756aec798a8ee9c\` FOREIGN KEY (\`zoneZoneId\`) REFERENCES \`zone\`(\`zoneId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`agent\` DROP FOREIGN KEY \`FK_2117c260fa04756aec798a8ee9c\``);
        await queryRunner.query(`ALTER TABLE \`vacation_day\` DROP FOREIGN KEY \`FK_c7d7a2611530a07eb203ca8bc77\``);
        await queryRunner.query(`ALTER TABLE \`account\` DROP FOREIGN KEY \`FK_e080d3981ac769dab1bbd232849\``);
        await queryRunner.query(`ALTER TABLE \`account\` DROP FOREIGN KEY \`FK_1016ebc7de6f10b7e92c065d275\``);
        await queryRunner.query(`ALTER TABLE \`appointment_type_agent\` DROP FOREIGN KEY \`FK_96eafd8b259cea93cc6b902d85d\``);
        await queryRunner.query(`ALTER TABLE \`appointment_type_agent\` DROP FOREIGN KEY \`FK_6a42e149b904580fe445aebb37d\``);
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP FOREIGN KEY \`FK_eedc185a064ae496f02de9faf27\``);
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP FOREIGN KEY \`FK_4ab1c4922d2ab533e11cae30f7e\``);
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP FOREIGN KEY \`FK_62f0bf768e6a7fbc6bb39e475c2\``);
        await queryRunner.query(`ALTER TABLE \`location\` DROP FOREIGN KEY \`FK_147727273601c71938b5e0f3b7d\``);
        await queryRunner.query(`ALTER TABLE \`day\` DROP FOREIGN KEY \`FK_cab08de912ff29cc2683cffe96f\``);
        await queryRunner.query(`ALTER TABLE \`franja\` DROP FOREIGN KEY \`FK_3f731c5ae161cdae2fbf6e1aca9\``);
        await queryRunner.query(`ALTER TABLE \`address\` DROP FOREIGN KEY \`FK_502e759d79259ed74e60450474a\``);
        await queryRunner.query(`DROP TABLE \`holiday\``);
        await queryRunner.query(`DROP TABLE \`zone\``);
        await queryRunner.query(`DROP INDEX \`IDX_c8e51500f3876fa1bbd4483ecc\` ON \`agent\``);
        await queryRunner.query(`DROP INDEX \`IDX_6afd1141ee4df210692f0d025f\` ON \`agent\``);
        await queryRunner.query(`DROP TABLE \`agent\``);
        await queryRunner.query(`DROP TABLE \`vacation_day\``);
        await queryRunner.query(`DROP INDEX \`REL_e080d3981ac769dab1bbd23284\` ON \`account\``);
        await queryRunner.query(`DROP INDEX \`IDX_f268ef5c7b257ab1520f12895d\` ON \`account\``);
        await queryRunner.query(`DROP INDEX \`IDX_4c8f96ccf523e9a3faefd5bdd4\` ON \`account\``);
        await queryRunner.query(`DROP TABLE \`account\``);
        await queryRunner.query(`DROP TABLE \`role\``);
        await queryRunner.query(`DROP TABLE \`appointment_type_agent\``);
        await queryRunner.query(`DROP TABLE \`appointment\``);
        await queryRunner.query(`DROP TABLE \`location\``);
        await queryRunner.query(`DROP TABLE \`day\``);
        await queryRunner.query(`DROP TABLE \`franja\``);
        await queryRunner.query(`DROP TABLE \`appointment_type\``);
        await queryRunner.query(`DROP TABLE \`address\``);
    }
}
