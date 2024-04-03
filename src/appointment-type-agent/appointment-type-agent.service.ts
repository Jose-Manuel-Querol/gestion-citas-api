import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentTypeAgent } from './appointment-type-agent.entity';
import { Repository } from 'typeorm';
import { AppointmentTypeService } from '../appointment-type/appointment-type.service';
import { DayService } from '../day/day.service';
import { AgentService } from '../agent/agent.service';
import { CreateManyAppointmentTypeAgent } from './dtos/create-many-appointment-type-agent.dto';

@Injectable()
export class AppointmentTypeAgentService {
  constructor(
    @InjectRepository(AppointmentTypeAgent)
    private repo: Repository<AppointmentTypeAgent>,
    private appointmentTypeService: AppointmentTypeService,
    private dayService: DayService,
    private agentService: AgentService,
  ) {}

  async getAll(): Promise<AppointmentTypeAgent[]> {
    return this.repo.find({
      relations: { agent: true, appointmentType: true, days: true },
    });
  }

  async getAllByAppointmentType(
    appointmentTypeId: number,
  ): Promise<AppointmentTypeAgent[]> {
    return this.repo.find({
      relations: { agent: true, appointmentType: true, days: true },
      where: { appointmentType: { appointmentTypeId } },
    });
  }

  async getAllByAgent(agentId: number): Promise<AppointmentTypeAgent[]> {
    return this.repo.find({
      relations: { agent: true, appointmentType: true, days: true },
      where: { agent: { agentId } },
    });
  }

  async getById(appointmentTypeAgentId: number): Promise<AppointmentTypeAgent> {
    const appointmentTypeAgent = await this.repo.findOne({
      where: { appointmentTypeAgentId },
      relations: { agent: true, appointmentType: true, days: true },
    });

    if (!appointmentTypeAgent) {
      throw new NotFoundException('La cita no existe');
    }

    return appointmentTypeAgent;
  }

  async createMany(
    createDto: CreateManyAppointmentTypeAgent,
  ): Promise<AppointmentTypeAgent[]> {
    const agent = await this.agentService.getById(createDto.agentId);
    const appointmentTypeAgents: AppointmentTypeAgent[] = [];
    for (let i = 0; i < createDto.createAppointmentTypeAgents.length; i++) {
      const appointmentType = await this.appointmentTypeService.getById(
        createDto.createAppointmentTypeAgents[i].appointmentTypeId,
      );
      const appointmentTypeAgent = this.repo.create({
        agent,
        appointmentType,
      });
      await this.repo.save(appointmentTypeAgent);
      for (
        let e = 0;
        e < createDto.createAppointmentTypeAgents[i].days.length;
        e++
      ) {
        await this.dayService.create(
          {
            active: createDto.createAppointmentTypeAgents[i].days[e].active,
            dayName: createDto.createAppointmentTypeAgents[i].days[e].dayName,
            endingHour:
              createDto.createAppointmentTypeAgents[i].days[e].endingHour,
            startingHour:
              createDto.createAppointmentTypeAgents[i].days[e].startingHour,
          },
          appointmentTypeAgent,
        );
      }
      appointmentTypeAgents.push(appointmentTypeAgent);
    }

    return appointmentTypeAgents;
  }

  async delete(appointmentTypeAgentId: number): Promise<AppointmentTypeAgent> {
    const appointmentTypeAgent = await this.getById(appointmentTypeAgentId);
    await this.repo.remove(appointmentTypeAgent);
    appointmentTypeAgent.appointmentTypeAgentId = appointmentTypeAgentId;
    return appointmentTypeAgent;
  }
}
