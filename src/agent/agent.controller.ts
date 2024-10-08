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
import { AgentService } from './agent.service';
import { Agent } from './agent.entity';
import { CreateAgentDto } from './dtos/create-agent.dto';
import { UpdateAgentDto } from './dtos/update-agent.dto';
import { JwtAccountGuard } from '../account/account-auth/account-guards/account.jwt.guard';
import { RolesGuard } from '../account/account-auth/account-guards/roles.guard';
import { Roles } from '../shared/roles.decorator';
import { ScheduleActivationAgentDto } from './dtos/scheadule-activation-agent.dto';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('agent')
export class AgentController {
  constructor(private agentService: AgentService) {}

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get()
  async getAllAgents(): Promise<Agent[]> {
    return await this.agentService.getAll();
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('/:id')
  async getAgentById(@Param('id') agentId: string): Promise<Agent> {
    return await this.agentService.getById(parseInt(agentId));
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('/activate-now/:id')
  async activateAgentById(@Param('id') agentId: string): Promise<Agent> {
    return await this.agentService.activate(parseInt(agentId));
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('/deactivate-now/:id')
  async deactivateAgentById(@Param('id') agentId: string): Promise<Agent> {
    return await this.agentService.deactivate(parseInt(agentId));
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('by-slug/:slug')
  async getAgentBySlug(@Param('slug') slug: string): Promise<Agent> {
    return await this.agentService.getBySlug(slug);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Post()
  async createAgent(@Body() body: CreateAgentDto): Promise<Agent> {
    return await this.agentService.create(body);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Put('/:id')
  async updateAgent(
    @Param('id') agentId: string,
    @Body() body: UpdateAgentDto,
  ): Promise<Agent> {
    return await this.agentService.update(parseInt(agentId), body);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Put('/deactivate/:id')
  async deactivateAgent(
    @Param('id') agentId: string,
    @Body() body: ScheduleActivationAgentDto,
  ): Promise<Agent> {
    return await this.agentService.deactivateAgent(parseInt(agentId), body);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Delete('/:id')
  async deleteAgent(@Param('id') agentId: string): Promise<Agent> {
    return await this.agentService.delete(parseInt(agentId));
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('/soft-delete/:id')
  async softDeleteAgent(@Param('id') agentId: string): Promise<Agent> {
    return await this.agentService.softDelete(parseInt(agentId));
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('/soft-recover/:id')
  async softRecoverAgent(@Param('id') agentId: string): Promise<Agent> {
    return await this.agentService.softRecover(parseInt(agentId));
  }
}
