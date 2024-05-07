import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VacationDayService } from './vacation-day.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { VacationDay } from './vacation-day.entity';
import { JwtAccountGuard } from '../account/account-auth/account-guards/account.jwt.guard';
import { RolesGuard } from '../account/account-auth/account-guards/roles.guard';
import { Roles } from '../shared/roles.decorator';
import { UpdateVacationDto } from './dtos/update-vacation.dto';
import { CreateManyVacationDaysWithAgent } from './dtos/create-many-vacation-days-with-agent.dto';

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
  async createManyVacationDays(
    @Body() body: CreateManyVacationDaysWithAgent,
  ): Promise<VacationDay[]> {
    return await this.vacationDayService.createNewMany(body);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Put('/:id')
  async updateVacationDay(
    @Param('id') vacationDayId: string,
    @Body() body: UpdateVacationDto,
  ): Promise<VacationDay> {
    return await this.vacationDayService.update(parseInt(vacationDayId), body);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Delete('/:id')
  async deleteVacationDay(
    @Param('id') vacationDayId: string,
  ): Promise<VacationDay> {
    return await this.vacationDayService.delete(parseInt(vacationDayId));
  }
}
