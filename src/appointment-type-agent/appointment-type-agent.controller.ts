import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentTypeAgentService } from './appointment-type-agent.service';
import { AppointmentTypeAgent } from './appointment-type-agent.entity';
import { CreateManyAppointmentTypeAgent } from './dtos/create-many-appointment-type-agent.dto';
import { JwtAccountGuard } from '../account/account-auth/account-guards/account.jwt.guard';

@Controller('appointment-type-agent')
export class AppointmentTypeAgentController {
  constructor(
    private appointmentTypeAgentService: AppointmentTypeAgentService,
  ) {}

  @UseGuards(JwtAccountGuard)
  @Get()
  async getAllAppointmentTypeAgents(): Promise<AppointmentTypeAgent[]> {
    return await this.appointmentTypeAgentService.getAll();
  }

  @UseGuards(JwtAccountGuard)
  @Get('by-agent')
  async getAllAppointmentTypeAgentsByAgent(
    @Query('agentId') agentId: string,
  ): Promise<AppointmentTypeAgent[]> {
    return await this.appointmentTypeAgentService.getAllByAgent(
      parseInt(agentId),
    );
  }

  @UseGuards(JwtAccountGuard)
  @Get('by-appointment-type')
  async getAllAppointmentTypeAgentsByAppointmentType(
    @Query('appointmentTypeId') appointmentTypeId: string,
  ): Promise<AppointmentTypeAgent[]> {
    return await this.appointmentTypeAgentService.getAllByAppointmentType(
      parseInt(appointmentTypeId),
    );
  }

  @UseGuards(JwtAccountGuard)
  @Get('/:id')
  async getAppointmentTypeAgentById(
    @Param('id') appointmentTypeAgentId: string,
  ): Promise<AppointmentTypeAgent> {
    return await this.appointmentTypeAgentService.getById(
      parseInt(appointmentTypeAgentId),
    );
  }

  @UseGuards(JwtAccountGuard)
  @Post()
  async createAppointmentTypeAgent(
    @Body() body: CreateManyAppointmentTypeAgent,
  ): Promise<AppointmentTypeAgent[]> {
    return await this.appointmentTypeAgentService.createMany(body);
  }

  @UseGuards(JwtAccountGuard)
  @Delete('/:id')
  async deleteAppointmentTypeAgent(
    @Param('id') appointmentTypeAgentId: string,
  ): Promise<AppointmentTypeAgent> {
    return await this.appointmentTypeAgentService.delete(
      parseInt(appointmentTypeAgentId),
    );
  }
}
