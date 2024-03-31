import { Module } from '@nestjs/common';
import { AppointmentTypeAgentController } from './appointment-type-agent.controller';
import { AppointmentTypeAgentService } from './appointment-type-agent.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentTypeAgent } from './appointment-type-agent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentTypeAgent])],
  controllers: [AppointmentTypeAgentController],
  providers: [AppointmentTypeAgentService],
  exports: [AppointmentTypeAgentService],
})
export class AppointmentTypeAgentModule {}
