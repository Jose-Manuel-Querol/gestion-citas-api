import { Module } from '@nestjs/common';
import { AppointmentTypeAgentController } from './appointment-type-agent.controller';
import { AppointmentTypeAgentService } from './appointment-type-agent.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentTypeAgent } from './appointment-type-agent.entity';
import { AppointmentTypeModule } from '../appointment-type/appointment-type.module';
import { DayModule } from '../day/day.module';
import { AgentModule } from '../agent/agent.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentTypeAgent]),
    AppointmentTypeModule,
    AgentModule,
    DayModule,
  ],
  controllers: [AppointmentTypeAgentController],
  providers: [AppointmentTypeAgentService],
  exports: [AppointmentTypeAgentService],
})
export class AppointmentTypeAgentModule {}
