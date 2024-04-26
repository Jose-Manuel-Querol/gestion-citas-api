import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { DayModule } from '../day/day.module';
import { AppointmentTypeAgentModule } from '../appointment-type-agent/appointment-type-agent.module';
import { LocationModule } from '../location/location.module';
import { AppointmentTypeModule } from '../appointment-type/appointment-type.module';
import { WhatsappService } from '../shared/whatsapp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    DayModule,
    AppointmentTypeAgentModule,
    LocationModule,
    AppointmentTypeModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService, WhatsappService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
