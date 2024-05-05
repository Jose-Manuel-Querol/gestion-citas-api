import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { VacationDayService } from './vacation-day.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { VacationDay } from './vacation-day.entity';
import { JwtAccountGuard } from '../account/account-auth/account-guards/account.jwt.guard';
import { RolesGuard } from '../account/account-auth/account-guards/roles.guard';
import { Roles } from '../shared/roles.decorator';
import { CreateManyVacationDays } from './dtos/create-many-vacation-days.dto';

@Controller('vacation-day')
export class VacationDayController {
  constructor(private vacationDayService: VacationDayService) {}

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('by-agent')
  async getAllVacationDaysByAgent(
    @Query('agentId') agentId: string,
  ): Promise<VacationDay[]> {
    return await this.vacationDayService.getAllVacationDayByAgent(
      parseInt(agentId),
    );
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Post()
  async createManyVacationDaysForAgent(
    @Body() body: CreateManyVacationDays,
  ): Promise<VacationDay[]> {
    return await this.vacationDayService.createMany(body);
  }
}
