import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DayService } from './day.service';
import { Day } from './day.entity';
import { JwtAccountGuard } from '../account/account-auth/account-guards/account.jwt.guard';

@Controller('day')
export class DayController {
  constructor(private dayService: DayService) {}

  @UseGuards(JwtAccountGuard)
  @Get('by-appointment-type-agent')
  async getAllDaysByAppointmentTypeAgent(
    @Query('appointmentTypeAgentId') appointmentTypeAgentId: string,
  ): Promise<Day[]> {
    return await this.dayService.getAllByAppointmentTypeAgent(
      parseInt(appointmentTypeAgentId),
    );
  }

  @UseGuards(JwtAccountGuard)
  @Get('/:id')
  async getDayById(@Param('id') dayId: string): Promise<Day> {
    return await this.dayService.getById(parseInt(dayId));
  }

  @UseGuards(JwtAccountGuard)
  @Delete('/:id')
  async deleteDay(@Param('id') dayId: string): Promise<Day> {
    return await this.dayService.delete(parseInt(dayId));
  }
}
