import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DataSourceOptionsService {
  constructor(private readonly configService: ConfigService) {}

  getDBConfig() {
    const _DBOptions = {
      type: 'sqlite',
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      synchronize: false,
      migrations: [__dirname + '/migrations/*.js'],
    };
    if (process.env.NODE_ENV === 'development') {
      Object.assign(_DBOptions, {
        type: 'sqlite',
        database: 'dev.sqlite',
        synchronize: true,
      });
    } else if (process.env.NODE_ENV === 'production') {
      Object.assign(_DBOptions, {
        type: 'mysql',
        database: this.configService.get<string>('DB_DATABASE'),
        host: this.configService.get<string>('DB_HOST'),
        port: this.configService.get<string>('DB_PORT'),
        username: this.configService.get<string>('DB_USERNAME'),
        password: this.configService.get<string>('DB_PASSWORD'),
        migrationsRun: true,
      });
    }

    return _DBOptions;
  }
}
