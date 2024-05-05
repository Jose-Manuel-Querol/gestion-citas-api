import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { SendgridService } from './shared/sendgrid.service';
import { AccountModule } from './account/account.module';
import { AgentModule } from './agent/agent.module';
import { AppointmentTypeModule } from './appointment-type/appointment-type.module';
import { AppointmentTypeAgentModule } from './appointment-type-agent/appointment-type-agent.module';
import { DayModule } from './day/day.module';
import { LocationModule } from './location/location.module';
import { ZoneModule } from './zone/zone.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AddressModule } from './address/address.module';
import { FranjaModule } from './franja/franja.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WhatsappService } from './shared/whatsapp.service';
import { DataSourceOptionsService } from '../datasourceoptions.service';
import { DatabaseModule } from '../database.module';
import { VacationDayModule } from './vacation-day/vacation-day.module';
import { HolidayModule } from './holiday/holiday.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseModule],
      inject: [DataSourceOptionsService],
      useFactory: (dsOptionsService: DataSourceOptionsService) => {
        const dbOptions: TypeOrmModuleOptions = {};
        const newDbOptions = dsOptionsService.getDBConfig();
        Object.assign(dbOptions, newDbOptions);
        return dbOptions;
      },
    }),
    AccountModule,
    AgentModule,
    AppointmentTypeModule,
    AppointmentTypeAgentModule,
    DayModule,
    LocationModule,
    ZoneModule,
    AppointmentModule,
    AddressModule,
    FranjaModule,
    VacationDayModule,
    HolidayModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    SendgridService,
    WhatsappService,
  ],
})
export class AppModule {}
