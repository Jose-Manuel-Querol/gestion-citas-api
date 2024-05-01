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
import { RolesGuard } from '../account/account-auth/account-guards/roles.guard';
import { Roles } from '../shared/roles.decorator';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('day')
export class DayController {
  constructor(private dayService: DayService) {}

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('by-appointment-type-agent')
  async getAllDaysByAppointmentTypeAgent(
    @Query('appointmentTypeAgentId') appointmentTypeAgentId: string,
  ): Promise<Day[]> {
    return await this.dayService.getAllByAppointmentTypeAgent(
      parseInt(appointmentTypeAgentId),
    );
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('/:id')
  async getDayById(@Param('id') dayId: string): Promise<Day> {
    return await this.dayService.getById(parseInt(dayId));
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Delete('/:id')
  async deleteDay(@Param('id') dayId: string): Promise<Day> {
    return await this.dayService.delete(parseInt(dayId));
  }
}
