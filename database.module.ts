import { Module } from '@nestjs/common';
import { DataSourceOptionsService } from './datasourceoptions.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // Ensure ConfigModule is imported if DataSourceOptionsService depends on it
  providers: [DataSourceOptionsService],
  exports: [DataSourceOptionsService], // Export the service so it can be used elsewhere
})
export class DatabaseModule {}
