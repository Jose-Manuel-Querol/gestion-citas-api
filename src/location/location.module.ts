import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './location.entity';
import { ZoneModule } from '../zone/zone.module';

@Module({
  imports: [TypeOrmModule.forFeature([Location]), ZoneModule],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
