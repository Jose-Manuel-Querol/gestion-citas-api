import { Module } from '@nestjs/common';
import { VacationDayController } from './vacation-day.controller';
import { VacationDayService } from './vacation-day.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationDay } from './vacation-day.entity';
import { AgentModule } from '../agent/agent.module';

@Module({
  imports: [TypeOrmModule.forFeature([VacationDay]), AgentModule],
  controllers: [VacationDayController],
  providers: [VacationDayService],
  exports: [VacationDayService],
})
export class VacationDayModule {}
