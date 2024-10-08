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
    const appointmentTypeAgents = await this.repo.find({
      relations: {
        agent: true,
        appointmentType: true,
        days: { franjas: true },
      },
    });

    return appointmentTypeAgents.map((appointmentTypeAgent) => {
      appointmentTypeAgent.days = appointmentTypeAgent.days.filter(
        (day) => !day.deleted,
      );
      return appointmentTypeAgent;
    });
  }

  async getAllByAppointmentType(
    appointmentTypeId: number,
  ): Promise<AppointmentTypeAgent[]> {
    const appointmentTypeAgents = await this.repo.find({
      relations: {
        agent: true,
        appointmentType: true,
        days: { franjas: true },
      },
      where: { appointmentType: { appointmentTypeId } },
    });

    return appointmentTypeAgents.map((appointmentTypeAgent) => {
      appointmentTypeAgent.days = appointmentTypeAgent.days.filter(
        (day) => !day.deleted,
      );
      return appointmentTypeAgent;
    });
  }

  async getAllByAgent(agentId: number): Promise<AppointmentTypeAgent[]> {
    const appointmentTypeAgents = await this.repo.find({
      relations: {
        agent: true,
        appointmentType: true,
        days: { franjas: true },
      },
      where: { agent: { agentId } },
    });

    return appointmentTypeAgents.map((appointmentTypeAgent) => {
      appointmentTypeAgent.days = appointmentTypeAgent.days.filter(
        (day) => !day.deleted,
      );
      return appointmentTypeAgent;
    });
  }

  async getById(appointmentTypeAgentId: number): Promise<AppointmentTypeAgent> {
    const appointmentTypeAgent = await this.repo.findOne({
      where: { appointmentTypeAgentId },
      relations: {
        agent: true,
        appointmentType: true,
        days: { franjas: true },
      },
    });

    if (!appointmentTypeAgent) {
      throw new NotFoundException('La cita no existe');
    }
    appointmentTypeAgent.days = appointmentTypeAgent.days.filter(
      (day) => !day.deleted,
    );

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
            franjas: createDto.createAppointmentTypeAgents[i].days[e].franjas,
          },
          appointmentTypeAgent,
        );
      }
      const createdAppointment = await this.getById(
        appointmentTypeAgent.appointmentTypeAgentId,
      );
      appointmentTypeAgents.push(createdAppointment);
    }

    return appointmentTypeAgents.map((appointmentTypeAgent) => {
      appointmentTypeAgent.days = appointmentTypeAgent.days.filter(
        (day) => !day.deleted,
      );
      return appointmentTypeAgent;
    });
  }

  async updateMany(
    updateDto: UpdateManyAppointmentTypeAgent,
    agent: Agent,
  ): Promise<AppointmentTypeAgent[]> {
    //Borramos cualquier appointmentTypeAgent que ya no existe
    const appointmentTypeAgents: AppointmentTypeAgent[] = [];
    const appointmentTypeAgentsByAgent = await this.getAllByAgent(
      agent.agentId,
    );
    const currentAppointmentTypeAgentIds = appointmentTypeAgentsByAgent.map(
      (appointment) => appointment.appointmentTypeAgentId,
    );
    const newAppointmentTypeAgentIds = updateDto.appointmentTypeAgents.map(
      (appointment) => appointment.appointmentTypeAgentId,
    );
    const appointmentTypeAgentsToDelete = currentAppointmentTypeAgentIds.filter(
      (appointmentTypeAgentId) =>
        !newAppointmentTypeAgentIds.includes(appointmentTypeAgentId),
    );
    if (appointmentTypeAgentsToDelete.length > 0) {
      for (let i = 0; i < appointmentTypeAgentsToDelete.length; i++) {
        await this.delete(appointmentTypeAgentsToDelete[i]);
      }
    }

    //Modificamos los appointmentTypeAgent
    for (let i = 0; i < updateDto.appointmentTypeAgents.length; i++) {
      const appointmentType = await this.appointmentTypeService.getById(
        updateDto.appointmentTypeAgents[i].appointmentTypeId,
      );
      if (updateDto.appointmentTypeAgents[i].appointmentTypeAgentId) {
        const appointmentTypeAgent = await this.getById(
          updateDto.appointmentTypeAgents[i].appointmentTypeAgentId,
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
            await this.dayService.softDelete(dayIdsToDelete[f]);
          }
        }

        if (
          appointmentTypeAgent.appointmentType.appointmentTypeId !==
          appointmentType.appointmentTypeId
        ) {
          appointmentTypeAgent.appointmentType = appointmentType;
          await this.repo.save(appointmentTypeAgent);
        }

        for (
          let e = 0;
          e < updateDto.appointmentTypeAgents[i].days.length;
          e++
        ) {
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
                franjas: updateDto.appointmentTypeAgents[i].days[e].franjas,
              },
              appointmentTypeAgent,
            );
          }
        }
        const updatedAppointment = await this.getById(
          appointmentTypeAgent.appointmentTypeAgentId,
        );
        appointmentTypeAgents.push(updatedAppointment);
      } else {
        const createAppointmentTypeAgent = this.repo.create({
          agent,
          appointmentType,
        });
        const appointmentTypeAgent = await this.repo.save(
          createAppointmentTypeAgent,
        );
        for (
          let e = 0;
          e < updateDto.appointmentTypeAgents[i].days.length;
          e++
        ) {
          await this.dayService.create(
            {
              active: updateDto.appointmentTypeAgents[i].days[e].active,
              dayName: updateDto.appointmentTypeAgents[i].days[e].dayName,
              franjas: updateDto.appointmentTypeAgents[i].days[e].franjas,
            },
            appointmentTypeAgent,
          );
        }
        const updatedAppointment = await this.getById(
          appointmentTypeAgent.appointmentTypeAgentId,
        );
        appointmentTypeAgents.push(updatedAppointment);
      }
    }
    return appointmentTypeAgents.map((appointmentTypeAgent) => {
      appointmentTypeAgent.days = appointmentTypeAgent.days.filter(
        (day) => !day.deleted,
      );
      return appointmentTypeAgent;
    });
  }

  async delete(appointmentTypeAgentId: number): Promise<AppointmentTypeAgent> {
    const appointmentTypeAgent = await this.getById(appointmentTypeAgentId);
    await this.repo.remove(appointmentTypeAgent);
    appointmentTypeAgent.appointmentTypeAgentId = appointmentTypeAgentId;
    return appointmentTypeAgent;
  }
}
