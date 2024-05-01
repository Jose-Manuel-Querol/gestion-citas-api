import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentTypeAgentService } from './appointment-type-agent.service';
import { AppointmentTypeAgent } from './appointment-type-agent.entity';
import { JwtAccountGuard } from '../account/account-auth/account-guards/account.jwt.guard';
import { RolesGuard } from '../account/account-auth/account-guards/roles.guard';
import { Roles } from '../shared/roles.decorator';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('appointment-type-agent')
export class AppointmentTypeAgentController {
  constructor(
    private appointmentTypeAgentService: AppointmentTypeAgentService,
  ) {}

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get()
  async getAllAppointmentTypeAgents(): Promise<AppointmentTypeAgent[]> {
    return await this.appointmentTypeAgentService.getAll();
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard)
  @Get('by-agent')
  async getAllAppointmentTypeAgentsByAgent(
    @Query('agentId') agentId: string,
  ): Promise<AppointmentTypeAgent[]> {
    return await this.appointmentTypeAgentService.getAllByAgent(
      parseInt(agentId),
    );
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('by-appointment-type')
  async getAllAppointmentTypeAgentsByAppointmentType(
    @Query('appointmentTypeId') appointmentTypeId: string,
  ): Promise<AppointmentTypeAgent[]> {
    return await this.appointmentTypeAgentService.getAllByAppointmentType(
      parseInt(appointmentTypeId),
    );
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard)
  @Get('/:id')
  async getAppointmentTypeAgentById(
    @Param('id') appointmentTypeAgentId: string,
  ): Promise<AppointmentTypeAgent> {
    return await this.appointmentTypeAgentService.getById(
      parseInt(appointmentTypeAgentId),
    );
  }

  /*@UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Post()
  async createAppointmentTypeAgent(
    @Body() body: CreateManyAppointmentTypeAgent,
  ): Promise<AppointmentTypeAgent[]> {
    return await this.appointmentTypeAgentService.createMany(body);
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Put()
  async updateAppointmentTypeAgent(
    @Body() body: UpdateManyAppointmentTypeAgent,
  ): Promise<AppointmentTypeAgent[]> {
    return await this.appointmentTypeAgentService.updateMany(body);
  }*/

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Delete('/:id')
  async deleteAppointmentTypeAgent(
    @Param('id') appointmentTypeAgentId: string,
  ): Promise<AppointmentTypeAgent> {
    return await this.appointmentTypeAgentService.delete(
      parseInt(appointmentTypeAgentId),
    );
  }
}
