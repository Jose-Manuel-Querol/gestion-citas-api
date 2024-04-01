import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Zone } from './zone.entity';
import { Repository } from 'typeorm';
import { CreateZoneDto } from './dtos/create-zone.dto';

@Injectable()
export class ZoneService {
  constructor(@InjectRepository(Zone) private repo: Repository<Zone>) {}

  async getAll(): Promise<Zone[]> {
    return await this.repo.find();
  }

  async getById(zoneId: number): Promise<Zone> {
    const zone = await this.repo.findOne({
      where: { zoneId },
    });

    if (!zone) {
      throw new NotFoundException('La zona no fue encontrada');
    }

    return zone;
  }

  async create(createDto: CreateZoneDto): Promise<Zone> {
    const zone = this.repo.create({
      zoneName: createDto.zoneName,
    });
    return await this.repo.save(zone);
  }

  async update(zoneId: number, createDto: CreateZoneDto): Promise<Zone> {
    const zone = await this.getById(zoneId);
    zone.zoneName = createDto.zoneName;
    return await this.repo.save(zone);
  }

  async delete(zoneId: number): Promise<Zone> {
    const zone = await this.getById(zoneId);
    return await this.repo.remove(zone);
  }
}
