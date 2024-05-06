import { DBOptions } from './db.datasourceoptions';
import { DataSourceOptions, DataSource } from 'typeorm';

const dsOptions: DataSourceOptions = <DataSourceOptions>{};
Object.assign(dsOptions, DBOptions);

const _AppDataSource = new DataSource(dsOptions);

_AppDataSource
  .initialize()
  .then(() => {
    console.log('¡La fuente de datos ha sido inicializada!');
  })
  .catch((err) => {
    console.error('Error durante la inicialización de la fuente de datos', err);
  });

export const AppDataSource = _AppDataSource;
/*import { NestFactory } from '@nestjs/core';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AppModule } from './src/app.module';
import { DataSourceOptionsService } from './datasourceoptions.service';

async function initializeDataSource() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const dataSourceOptionsService = appContext.get(DataSourceOptionsService);
  const dbOptions = dataSourceOptionsService.getDBConfig();

  const dataSource = new DataSource(dbOptions as DataSourceOptions);
  dataSource
    .initialize()
    .then(() => {
      console.log('¡La fuente de datos ha sido inicializada!');
      process.exit(0); // Properly exit the application once done
    })
    .catch((err) => {
      console.error(
        'Error durante la inicialización de la fuente de datos',
        err,
      );
      process.exit(1); // Exit with error code
    });
}

initializeDataSource();*/
