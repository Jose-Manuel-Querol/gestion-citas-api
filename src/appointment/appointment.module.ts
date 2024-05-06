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
import { AccountModule } from '../account/account.module';
import { HolidayModule } from '../holiday/holiday.module';
import { VacationDayModule } from '../vacation-day/vacation-day.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    DayModule,
    AppointmentTypeAgentModule,
    LocationModule,
    AppointmentTypeModule,
    AccountModule,
    HolidayModule,
    VacationDayModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService, WhatsappService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
