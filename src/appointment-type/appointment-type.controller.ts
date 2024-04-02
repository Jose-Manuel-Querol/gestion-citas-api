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

@Controller('appointment-type')
export class AppointmentTypeController {
  constructor(private appointmentTypeService: AppointmentTypeService) {}

  @UseGuards(JwtAccountGuard)
  @Get()
  async getAllAppointmentTypes(): Promise<AppointmentType[]> {
    return await this.appointmentTypeService.getAll();
  }

  @UseGuards(JwtAccountGuard)
  @Get('/:id')
  async getOneAppointmentType(
    @Param('id') appointmentTypeId: string,
  ): Promise<AppointmentType> {
    return await this.appointmentTypeService.getById(
      parseInt(appointmentTypeId),
    );
  }

  @UseGuards(JwtAccountGuard)
  @Post()
  async createAppointmentType(
    @Body() body: CreateAppointmentTypeDto,
  ): Promise<AppointmentType> {
    return await this.appointmentTypeService.create(body);
  }

  @UseGuards(JwtAccountGuard)
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

  @UseGuards(JwtAccountGuard)
  @Delete('/:id')
  async deleteAppointmentType(@Param('id') appointmentTypeId: string) {
    return await this.appointmentTypeService.delete(
      parseInt(appointmentTypeId),
    );
  }
}
