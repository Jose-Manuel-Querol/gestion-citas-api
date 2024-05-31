import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
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
import { Response } from 'express';
import { ApiGuard } from '../account/account-auth/account-guards/api.guard';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AvailableDatesExampleDto } from './dtos/available-date.example.dto';
import { AppointmentExampleDto } from './dtos/appointment.example.dto';
import { CreateAppointmentExampleDto } from './dtos/create-appointment.example.dto';

@ApiTags('Citas')
@Controller('appointment')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @ApiOperation({ summary: 'Obtener todas las citas disponibles' })
  @ApiResponse({
    status: 200,
    description: 'Obtener todas las citas disponibles',
    type: [AvailableDatesExampleDto],
  })
  //@UseGuards(ApiGuard)
  @Get('secure/available-dates')
  async getAllAvailableAppointmentsPublicApi(
    @Query('appointmentTypeId') appointmentTypeId: string,
    //@Query('zoneId') zoneId: string,
  ) {
    return await this.appointmentService.findAvailableAppointments(
      parseInt(appointmentTypeId),
      //parseInt(zoneId),
    );
  }

  @ApiOperation({ summary: 'Crear una cita' })
  @ApiBody({ type: CreateAppointmentExampleDto })
  @ApiResponse({
    status: 200,
    description: 'Crear una Cita',
    type: AppointmentExampleDto,
  })
  //@UseGuards(ApiGuard)
  @Post('secure/create')
  async createAppointmentPublicApi(
    @Body() body: CreateAppointmentDto,
  ): Promise<Appointment> {
    return await this.appointmentService.create(body);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('available-dates')
  async getAllAvailableAppointments(
    @Query('appointmentTypeId') appointmentTypeId: string,
    //@Query('zoneId') zoneId: string,
  ) {
    return await this.appointmentService.findAvailableAppointments(
      parseInt(appointmentTypeId),
      //parseInt(zoneId),
    );
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard)
  @Get('between-dates')
  async getAllWithinDates(
    @Query('startingDate') startingDate: string,
    @Query('endingDate') endingDate: string,
    @Query('typeName') typeName?: string,
    @Query('clientName') clientName?: string,
    @Query('clientLastName') clientLastName?: string,
    @Query('firstName') firstName?: string,
    @Query('code') code?: string,
  ): Promise<Appointment[]> {
    return await this.appointmentService.getAllWithinDates(
      startingDate,
      endingDate,
      typeName,
      clientName,
      clientLastName,
      firstName,
      code,
    );
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard)
  @Get('generate-report')
  async generateAppointmentsReport(
    @Res() res: Response,
    @Query('startingDate') startingDate?: string,
    @Query('endingDate') endingDate?: string,
    @Query('typeName') typeName?: string,
    @Query('clientName') clientName?: string,
    @Query('clientLastName') clientLastName?: string,
    @Query('firstName') firstName?: string,
    @Query('agentId') agentId?: string,
    @Query('code') code?: string,
  ) {
    const appointments = await this.appointmentService.getForReport(
      startingDate,
      endingDate,
      typeName,
      clientName,
      clientLastName,
      firstName,
      agentId,
      code,
    );
    const buffer = await this.appointmentService.createPdf(appointments);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="appointments-report-${startingDate}-to-${endingDate}.pdf"`,
    );
    res.end(buffer);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get()
  async getAllAppointments(): Promise<Appointment[]> {
    return await this.appointmentService.getAll();
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('by-day-after-tomorrow')
  async getAllAppointmentsWithinDayAfterTomorrow(): Promise<Appointment[]> {
    return await this.appointmentService.getAllWithinDayAfterTomorrow();
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('all-active')
  async getAllAppointmentsActive(): Promise<Appointment[]> {
    return await this.appointmentService.getAllActive();
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('/:id')
  async getAppointmentById(
    @Param('id') appointmentId: string,
  ): Promise<Appointment> {
    return await this.appointmentService.getById(parseInt(appointmentId));
  }

  @ApiOperation({ summary: 'Obtener una cita por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Obtener una cita por su ID',
    type: AppointmentExampleDto,
  })
  //@UseGuards(ApiGuard)
  @Get('/secure/:id')
  async getAppointmentByIdPublicApi(
    @Param('id') appointmentId: string,
  ): Promise<Appointment> {
    return await this.appointmentService.getById(parseInt(appointmentId));
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Post()
  async createAppointment(
    @Body() body: CreateAppointmentDto,
  ): Promise<Appointment> {
    return await this.appointmentService.create(body);
  }

  @ApiExcludeEndpoint()
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

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard)
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

  @ApiExcludeEndpoint()
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

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Put('cancel-many')
  async cancelAppointments(
    @Body() body: CancelManyAppointments,
  ): Promise<Appointment[]> {
    return await this.appointmentService.cancel(body);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Put('update-one/:id')
  async updateAppointment(
    @Param('id') appointmentId: string,
    @Body() body: CreateAppointmentDto,
  ): Promise<Appointment> {
    return await this.appointmentService.update(parseInt(appointmentId), body);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('cancel-one/:id')
  async cancelOneAppointment(
    @Param('id') appointmentId: string,
  ): Promise<Appointment> {
    return await this.appointmentService.cancelOne(parseInt(appointmentId));
  }

  @ApiOperation({ summary: 'Cancelar una cita' })
  @ApiResponse({
    status: 200,
    description: 'Cancelar una cita',
    type: AppointmentExampleDto,
  })
  //@UseGuards(ApiGuard)
  @Get('secure/cancel-one/:id')
  async cancelOneAppointmentPublicApi(
    @Param('id') appointmentId: string,
  ): Promise<Appointment> {
    return await this.appointmentService.cancelOne(parseInt(appointmentId));
  }
}
