import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from './agent.entity';
import { Repository } from 'typeorm';
import { ZoneService } from '../zone/zone.service';
import { CreateAgentDto } from './dtos/create-agent.dto';
import { UpdateAgentDto } from './dtos/update-agent.dto';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent) private repo: Repository<Agent>,
    private zoneService: ZoneService,
  ) {}

  async getAll(): Promise<Agent[]> {
    return await this.repo.find({ relations: { zone: true } });
  }

  async getById(agentId: number): Promise<Agent> {
    const agent = await this.repo.findOne({
      where: { agentId },
      relations: { zone: true },
    });
    if (!agent) {
      throw new NotFoundException('El agente no fue encontrado');
    }

    return agent;
  }

  async create(createDto: CreateAgentDto): Promise<Agent> {
    const zone = await this.zoneService.getById(createDto.zoneId);
    const agent = this.repo.create({
      address: createDto.address + ' ' + createDto.addressNro,
      city: createDto.city,
      email: createDto.city,
      firstName: createDto.firstName,
      lastName: createDto.lastName,
      phoneNumber: createDto.phoneNumber,
      vacationEnd: createDto.vacationEnd,
      vacationStart: createDto.vacationStart,
      zone,
    });

    return await this.repo.save(agent);
  }

  async update(agentId: number, updateDto: UpdateAgentDto): Promise<Agent> {
    const agent = await this.getById(agentId);
    if (updateDto.address) {
      agent.address = updateDto.address + ' ' + updateDto.addressNro;
    }

    if (updateDto.city) {
      agent.city = updateDto.city;
    }

    if (updateDto.email) {
      agent.email = updateDto.email;
    }

    if (updateDto.firstName) {
      agent.firstName = updateDto.firstName;
    }

    if (updateDto.lastName) {
      agent.lastName = updateDto.lastName;
    }

    if (updateDto.phoneNumber) {
      agent.phoneNumber = updateDto.phoneNumber;
    }

    if (updateDto.vacationEnd) {
      agent.vacationEnd = updateDto.vacationEnd;
    }

    if (updateDto.vacationStart) {
      agent.vacationStart = updateDto.vacationStart;
    }

    if (updateDto.zoneId) {
      const zone = await this.zoneService.getById(updateDto.zoneId);
      agent.zone = zone;
    }

    return await this.repo.save(agent);
  }

  async delete(agentId: number): Promise<Agent> {
    const agent = await this.getById(agentId);
    await this.repo.remove(agent);
    agent.agentId = agentId;
    return agent;
  }
}
