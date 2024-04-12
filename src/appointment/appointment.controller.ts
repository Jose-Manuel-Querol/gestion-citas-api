import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { JwtAccountGuard } from '../account/account-auth/account-guards/account.jwt.guard';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { CancelManyAppointments } from './dtos/cancel-many-appointments.dto';
import { RolesGuard } from '../account/account-auth/account-guards/roles.guard';
import { Roles } from '../shared/roles.decorator';
import { GetAllAppointmentsByAgents } from './dtos/get-all-appointments-by-agents.dto';
import { GetAllAppointmentsByAppointmentType } from './dtos/get-all-appointments-by-appointment-type.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Get('available-dates')
  async getAllAvailableAppointments(
    @Query('appointmentTypeId') appointmentTypeId: string,
  ) {
    return await this.appointmentService.findAvailableAppointments(
      parseInt(appointmentTypeId),
    );
  }

  @Get('between-dates')
  async getAllWithinDates(
    @Query('startingDate') startingDate: string,
    @Query('endingDate') endingDate: string,
    @Query('typeName') typeName?: string,
    @Query('clientName') clientName?: string,
    @Query('firstName') firstName?: string,
    @Query('code') code?: string,
  ): Promise<Appointment[]> {
    return await this.appointmentService.getAllWithinDates(
      startingDate,
      endingDate,
      typeName,
      clientName,
      firstName,
      code,
    );
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get()
  async getAllAppointments(): Promise<Appointment[]> {
    return await this.appointmentService.getAll();
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('by-day-after-tomorrow')
  async getAllAppointmentsWithinDayAfterTomorrow(): Promise<Appointment[]> {
    return await this.appointmentService.getAllWithinDayAfterTomorrow();
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('all-active')
  async getAllAppointmentsActive(): Promise<Appointment[]> {
    return await this.appointmentService.getAllActive();
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('/:id')
  async getAppointmentById(
    @Param('id') appointmentId: string,
  ): Promise<Appointment> {
    return await this.appointmentService.getById(parseInt(appointmentId));
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Post()
  async createAppointment(
    @Body() body: CreateAppointmentDto,
  ): Promise<Appointment> {
    return await this.appointmentService.create(body);
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Post('cancelled-by-agents')
  async getAllCancelledAppointmentsWithinDatesByAgents(
    @Body() body: GetAllAppointmentsByAgents,
  ): Promise<Appointment[]> {
    return await this.appointmentService.getAllCancelledWithinDatesByAgents(
      body.startingDate,
      body.endingDate,
      body.agentsId,
    );
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Post('active-by-agents')
  async getAllActiveAppointmentsWithinDatesByAgents(
    @Body() body: GetAllAppointmentsByAgents,
  ): Promise<Appointment[]> {
    return await this.appointmentService.getAllWithinDatesByAgents(
      body.startingDate,
      body.endingDate,
      body.agentsId,
    );
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Post('active-by-types')
  async getAllActiveAppointmentsWithinDatesByAppointmentTypes(
    @Body() body: GetAllAppointmentsByAppointmentType,
  ): Promise<Appointment[]> {
    return await this.appointmentService.getAllWithinDatesByAppointmentTypes(
      body.startingDate,
      body.endingDate,
      body.appointmentTypeIds,
    );
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Put('cancel-many')
  async cancelAppointments(
    @Body() body: CancelManyAppointments,
  ): Promise<Appointment[]> {
    return await this.appointmentService.cancel(body);
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Put('update-one/:id')
  async updateAppointment(
    @Param('id') appointmentId: string,
    @Body() body: CreateAppointmentDto,
  ): Promise<Appointment> {
    return await this.appointmentService.update(parseInt(appointmentId), body);
  }
}
