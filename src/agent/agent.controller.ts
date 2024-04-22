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

@Controller('agent')
export class AgentController {
  constructor(private agentService: AgentService) {}

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get()
  async getAllAgents(): Promise<Agent[]> {
    return await this.agentService.getAll();
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('/:id')
  async getAgentById(@Param('id') agentId: string): Promise<Agent> {
    return await this.agentService.getById(parseInt(agentId));
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('by-slug/:slug')
  async getAgentBySlug(@Param('slug') slug: string): Promise<Agent> {
    return await this.agentService.getBySlug(slug);
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Post()
  async createAgent(@Body() body: CreateAgentDto): Promise<Agent> {
    return await this.agentService.create(body);
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Put('/:id')
  async updateAgent(
    @Param('id') agentId: string,
    @Body() body: UpdateAgentDto,
  ): Promise<Agent> {
    return await this.agentService.update(parseInt(agentId), body);
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Put('/deactivate/:id')
  async deactivateAgent(
    @Param('id') agentId: string,
    @Body() body: ScheduleActivationAgentDto,
  ): Promise<Agent> {
    return await this.agentService.deactivateAgent(parseInt(agentId), body);
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Delete('/:id')
  async deleteAgent(@Param('id') agentId: string): Promise<Agent> {
    return await this.agentService.delete(parseInt(agentId));
  }
}
