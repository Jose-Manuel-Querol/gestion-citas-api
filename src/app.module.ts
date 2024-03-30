import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DBOptions } from '../db.datasourceoptions';
import { APP_PIPE } from '@nestjs/core';
import { SendgridService } from './shared/sendgrid.service';

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
