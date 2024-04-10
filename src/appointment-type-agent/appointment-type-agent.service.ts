import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentTypeAgent } from './appointment-type-agent.entity';
import { Repository } from 'typeorm';
import { AppointmentTypeService } from '../appointment-type/appointment-type.service';
import { DayService } from '../day/day.service';
import { CreateManyAppointmentTypeAgent } from './dtos/create-many-appointment-type-agent.dto';
import { UpdateManyAppointmentTypeAgent } from './dtos/update-many-appointment-type-agent.dto';
import { Agent } from '../agent/agent.entity';
@Injectable()
export class AppointmentTypeAgentService {
  constructor(
    @InjectRepository(AppointmentTypeAgent)
    private repo: Repository<AppointmentTypeAgent>,
    private appointmentTypeService: AppointmentTypeService,
    private dayService: DayService,
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
    agent: Agent,
  ): Promise<AppointmentTypeAgent[]> {
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
            dayDate: createDto.createAppointmentTypeAgents[i].days[e].dayDate,
          },
          appointmentTypeAgent,
        );
      }
      appointmentTypeAgents.push(appointmentTypeAgent);
    }

    return appointmentTypeAgents;
  }

  async updateMany(
    updateDto: UpdateManyAppointmentTypeAgent,
  ): Promise<AppointmentTypeAgent[]> {
    const appointmentTypeAgents: AppointmentTypeAgent[] = [];
    for (let i = 0; i < updateDto.appointmentTypeAgents.length; i++) {
      const appointmentTypeAgent = await this.getById(
        updateDto.appointmentTypeAgents[i].appointmentTypeAgentId,
      );
      const appointmentType = await this.appointmentTypeService.getById(
        updateDto.appointmentTypeAgents[i].appointmentTypeId,
      );
      const days = appointmentTypeAgent.days;
      const currentDayIds = days.map((day) => day.dayId);
      const newDayIds = updateDto.appointmentTypeAgents[i].days.map(
        (day) => day.dayId,
      );
      const dayIdsToDelete = currentDayIds.filter(
        (dayId) => !newDayIds.includes(dayId),
      );
      if (dayIdsToDelete.length > 0) {
        for (let f = 0; f < dayIdsToDelete.length; f++) {
          await this.dayService.delete(dayIdsToDelete[f]);
        }
      }
      if (
        appointmentTypeAgent.appointmentType.appointmentTypeId !==
        appointmentType.appointmentTypeId
      ) {
        appointmentTypeAgent.appointmentType = appointmentType;
        await this.repo.save(appointmentTypeAgent);
      }
      for (let e = 0; e < updateDto.appointmentTypeAgents[i].days.length; e++) {
        if (updateDto.appointmentTypeAgents[i].days[e].dayId) {
          await this.dayService.update(
            updateDto.appointmentTypeAgents[i].days[e].dayId,
            updateDto.appointmentTypeAgents[i].days[e],
          );
        } else {
          await this.dayService.create(
            {
              active: updateDto.appointmentTypeAgents[i].days[e].active,
              dayName: updateDto.appointmentTypeAgents[i].days[e].dayName,
              endingHour: updateDto.appointmentTypeAgents[i].days[e].endingHour,
              startingHour:
                updateDto.appointmentTypeAgents[i].days[e].startingHour,
              dayDate: updateDto.appointmentTypeAgents[i].days[e].dayDate,
            },
            appointmentTypeAgent,
          );
        }
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
