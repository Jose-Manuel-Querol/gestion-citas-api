import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { JwtAccountGuard } from '../account/account-auth/account-guards/account.jwt.guard';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { CancelManyAppointments } from './dtos/cancel-many-appointments.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @UseGuards(JwtAccountGuard)
  @Get()
  async getAllAppointments(): Promise<Appointment[]> {
    return await this.appointmentService.getAll();
  }

  @UseGuards(JwtAccountGuard)
  @Get('within-week')
  async getAllAppointmentsWithinWeek(): Promise<Appointment[]> {
    return await this.appointmentService.getAllWithinWeek();
  }

  @UseGuards(JwtAccountGuard)
  @Get('all-active')
  async getAllAppointmentsActive(): Promise<Appointment[]> {
    return await this.appointmentService.getAllActive();
  }

  @UseGuards(JwtAccountGuard)
  @Get('/:id')
  async getAppointmentById(
    @Param('id') appointmentId: string,
  ): Promise<Appointment> {
    return await this.appointmentService.getById(parseInt(appointmentId));
  }

  @UseGuards(JwtAccountGuard)
  @Post()
  async createAppointment(
    @Body() body: CreateAppointmentDto,
  ): Promise<Appointment> {
    return await this.appointmentService.create(body);
  }

  @UseGuards(JwtAccountGuard)
  @Put('cancel-many')
  async cancelAppointments(
    @Body() body: CancelManyAppointments,
  ): Promise<Appointment[]> {
    return await this.appointmentService.cancel(body);
  }

  @UseGuards(JwtAccountGuard)
  @Put('update-one/:id')
  async updateAppointment(
    @Param('id') appointmentId: string,
    @Body() body: CreateAppointmentDto,
  ): Promise<Appointment> {
    return await this.appointmentService.update(parseInt(appointmentId), body);
  }
}
