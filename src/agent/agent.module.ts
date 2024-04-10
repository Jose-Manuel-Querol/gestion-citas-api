import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from './agent.entity';
import { ZoneModule } from '../zone/zone.module';
import { AppointmentTypeAgentModule } from '../appointment-type-agent/appointment-type-agent.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agent]),
    ZoneModule,
    AppointmentTypeAgentModule,
  ],
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
