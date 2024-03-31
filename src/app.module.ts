import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DBOptions } from '../db.datasourceoptions';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      //inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useFactory: (config: ConfigService) => {
        const dbOptions: TypeOrmModuleOptions = {};

        Object.assign(dbOptions, DBOptions);

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
  ],
})
export class AppModule {}
