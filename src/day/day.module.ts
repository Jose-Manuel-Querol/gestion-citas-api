import { Module } from '@nestjs/common';
import { DayController } from './day.controller';
import { DayService } from './day.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Day } from '../day/day.entity';
import { FranjaModule } from '../franja/franja.module';

@Module({
  imports: [TypeOrmModule.forFeature([Day]), FranjaModule],
  controllers: [DayController],
  providers: [DayService],
  exports: [DayService],
})
export class DayModule {}
