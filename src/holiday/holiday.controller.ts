import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Roles } from '../shared/roles.decorator';
import { JwtAccountGuard } from '../account/account-auth/account-guards/account.jwt.guard';
import { RolesGuard } from '../account/account-auth/account-guards/roles.guard';
import { Holiday } from './holiday.entity';
import { CreateManyHoliday } from './dtos/create-many-holidays.dto';
import { HolidayDto } from './dtos/holiday.dto';

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

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Put('/:id')
  async updateHoliday(
    @Param('id') holidayId: string,
    @Body() body: HolidayDto,
  ): Promise<Holiday> {
    return await this.holidayService.update(parseInt(holidayId), body);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Delete('/:id')
  async deleteHoliday(@Param('id') holidayId: string): Promise<Holiday> {
    return await this.holidayService.delete(parseInt(holidayId));
  }
}
