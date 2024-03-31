import { Module } from '@nestjs/common';
import { AppointmentTypeController } from './appointment-type.controller';
import { AppointmentTypeService } from './appointment-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentType } from './appointment-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentType])],
  controllers: [AppointmentTypeController],
  providers: [AppointmentTypeService],
  exports: [AppointmentTypeService],
})
export class AppointmentTypeModule {}
