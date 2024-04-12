import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from './agent.entity';
import { Repository } from 'typeorm';
import { ZoneService } from '../zone/zone.service';
import { CreateAgentDto } from './dtos/create-agent.dto';
import { UpdateAgentDto } from './dtos/update-agent.dto';
import { generateSlug } from '../shared/shared-functions';
import { AppointmentTypeAgentService } from '../appointment-type-agent/appointment-type-agent.service';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent) private repo: Repository<Agent>,
    private zoneService: ZoneService,
    private appointmentTypeAgentService: AppointmentTypeAgentService,
  ) {}

  async getAll(): Promise<Agent[]> {
    return await this.repo.find({
      relations: {
        zone: true,
        appointmentTypeAgents: { appointmentType: true, days: true },
      },
    });
  }

  async getAllBySlug(slug: string): Promise<Agent[]> {
    return await this.repo.find({
      where: { slug },
      relations: {
        zone: true,
        appointmentTypeAgents: { appointmentType: true, days: true },
      },
    });
  }

  async getById(agentId: number): Promise<Agent> {
    const agent = await this.repo.findOne({
      where: { agentId },
      relations: {
        zone: true,
        appointmentTypeAgents: { appointmentType: true, days: true },
      },
    });
    if (!agent) {
      throw new NotFoundException('El agente no fue encontrado');
    }

    return agent;
  }

  async getByEmail(email: string): Promise<Agent> {
    const agent = await this.repo.findOne({
      where: { email },
      relations: {
        zone: true,
        appointmentTypeAgents: { appointmentType: true, days: true },
      },
    });
    if (!agent) {
      throw new NotFoundException(
        'No se encontro ningún agente con ese correo electrónico',
      );
    }

    return agent;
  }

  async getBySlug(slug: string): Promise<Agent> {
    const agent = await this.repo.findOne({
      where: { slug },
      relations: {
        zone: true,
        appointmentTypeAgents: { appointmentType: true, days: true },
      },
    });
    if (!agent) {
      throw new NotFoundException('El agente no fue encontrado');
    }

    return agent;
  }

  async create(createDto: CreateAgentDto): Promise<Agent> {
    const zone = await this.zoneService.getById(createDto.zoneId);
    const agent = this.repo.create({
      fullAddress: createDto.address + ' ' + createDto.addressNro,
      address: createDto.address,
      addressNro: createDto.addressNro,
      city: createDto.city,
      email: createDto.city,
      firstName: createDto.firstName,
      lastName: createDto.lastName,
      phoneNumber: createDto.phoneNumber,
      vacationEnd: createDto.vacationEnd,
      vacationStart: createDto.vacationStart,
      zone,
      dni: createDto.dni,
    });

    let baseSlug = generateSlug(createDto.firstName + ' ' + createDto.lastName);
    let agents = await this.getAllBySlug(baseSlug);
    while (agents.length > 0) {
      const randomDigit = Math.floor(Math.random() * 100);
      baseSlug = `${baseSlug}${randomDigit}`;
      agents = await this.getAllBySlug(baseSlug);
    }
    agent.slug = baseSlug;

    const createdAgent = await this.repo.save(agent);
    await this.appointmentTypeAgentService.createMany(
      createDto.appointmentTypeAgents,
      createdAgent,
    );
    return await this.getById(createdAgent.agentId);
  }

  async update(agentId: number, updateDto: UpdateAgentDto): Promise<Agent> {
    const agent = await this.getById(agentId);
    if (updateDto.address) {
      agent.fullAddress = updateDto.address + ' ' + updateDto.addressNro;
      agent.address = updateDto.address;
      agent.addressNro = updateDto.addressNro;
    }

    if (updateDto.city) {
      agent.city = updateDto.city;
    }

    if (updateDto.email !== agent.email) {
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

    if (updateDto.vacationStart) {
      agent.vacationStart = updateDto.vacationStart;
    }

    if (updateDto.dni) {
      agent.dni = updateDto.dni;
    }

    if (updateDto.zoneId) {
      const zone = await this.zoneService.getById(updateDto.zoneId);
      agent.zone = zone;
    }

    await this.repo.save(agent);
    await this.appointmentTypeAgentService.updateMany(
      updateDto.appointmentTypeAgents,
    );
    return await this.getById(agentId);
  }

  async delete(agentId: number): Promise<Agent> {
    const agent = await this.getById(agentId);
    await this.repo.remove(agent);
    agent.agentId = agentId;
    return agent;
  }
}
