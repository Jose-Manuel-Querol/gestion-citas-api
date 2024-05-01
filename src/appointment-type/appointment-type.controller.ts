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
import { AppointmentTypeService } from './appointment-type.service';
import { JwtAccountGuard } from '../account/account-auth/account-guards/account.jwt.guard';
import { AppointmentType } from './appointment-type.entity';
import { CreateAppointmentTypeDto } from './dtos/create-appointment-type.dto';
import { UpdateAppointmentTypeDto } from './dtos/update-appointment-type.dto';
import { RolesGuard } from '../account/account-auth/account-guards/roles.guard';
import { Roles } from '../shared/roles.decorator';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('appointment-type')
export class AppointmentTypeController {
  constructor(private appointmentTypeService: AppointmentTypeService) {}

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get()
  async getAllAppointmentTypes(): Promise<AppointmentType[]> {
    return await this.appointmentTypeService.getAll();
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('/:id')
  async getOneAppointmentType(
    @Param('id') appointmentTypeId: string,
  ): Promise<AppointmentType> {
    return await this.appointmentTypeService.getById(
      parseInt(appointmentTypeId),
    );
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Post()
  async createAppointmentType(
    @Body() body: CreateAppointmentTypeDto,
  ): Promise<AppointmentType> {
    return await this.appointmentTypeService.create(body);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Put('/:id')
  async updateAppointmentType(
    @Param('id') appointmentTypeId: string,
    @Body() body: UpdateAppointmentTypeDto,
  ): Promise<AppointmentType> {
    return await this.appointmentTypeService.update(
      parseInt(appointmentTypeId),
      body,
    );
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Delete('/:id')
  async deleteAppointmentType(@Param('id') appointmentTypeId: string) {
    return await this.appointmentTypeService.delete(
      parseInt(appointmentTypeId),
    );
  }
}
