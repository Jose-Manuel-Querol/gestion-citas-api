import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentType } from './appointment-type.entity';
import { Repository } from 'typeorm';
import { CreateAppointmentTypeDto } from './dtos/create-appointment-type.dto';

@Injectable()
export class AppointmentTypeService {
  constructor(
    @InjectRepository(AppointmentType)
    private repo: Repository<AppointmentType>,
  ) {}

  async getAll(): Promise<AppointmentType[]> {
    return await this.repo.find();
  }

  async getById(appointmentTypeId: number): Promise<AppointmentType> {
    const appointmentType = await this.repo.findOne({
      where: { appointmentTypeId },
    });

    if (!appointmentType) {
      throw new NotFoundException('El tipo de cita no fue encontrado');
    }

    return appointmentType;
  }

  async create(createDto: CreateAppointmentTypeDto): Promise<AppointmentType> {
    const appointmentType = this.repo.create({
      duration: createDto.duration,
      typeName: createDto.typeName,
    });
    return await this.repo.save(appointmentType);
  }

  async update(
    appointmentTypeId: number,
    attrs: Partial<AppointmentType>,
  ): Promise<AppointmentType> {
    const appointmentType = await this.getById(appointmentTypeId);
    Object.assign(appointmentType, attrs);
    return await this.repo.save(appointmentType);
  }

  async delete(appointmentTypeId: number): Promise<AppointmentType> {
    const appointmentType = await this.getById(appointmentTypeId);
    return await this.repo.remove(appointmentType);
  }
}
