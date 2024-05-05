import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Roles } from '../shared/roles.decorator';
import { JwtAccountGuard } from '../account/account-auth/account-guards/account.jwt.guard';
import { RolesGuard } from '../account/account-auth/account-guards/roles.guard';
import { Holiday } from './holiday.entity';
import { CreateManyHoliday } from './dtos/create-many-holidays.dto';

@Controller('holiday')
export class HolidayController {
  constructor(private holidayService: HolidayService) {}

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get()
  async getAllHolidays(): Promise<Holiday[]> {
    return await this.holidayService.getAllHoliday();
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Post()
  async createManyHolidays(
    @Body() body: CreateManyHoliday,
  ): Promise<Holiday[]> {
    return await this.holidayService.createMany(body);
  }
}
