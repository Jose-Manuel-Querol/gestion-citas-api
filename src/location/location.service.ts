import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './location.entity';
import { ZoneService } from '../zone/zone.service';
import { CreateLocationDto } from './dtos/create-location.dto';
import { UpdateLocationDto } from './dtos/update-location.dto';
import { Repository } from 'typeorm';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location) private repo: Repository<Location>,
    private zoneService: ZoneService,
  ) {}

  async getAll(): Promise<Location[]> {
    return await this.repo.find({
      relations: { zone: true },
    });
  }

  async getById(locationId: number): Promise<Location> {
    const location = await this.repo.findOne({
      where: { locationId },
      relations: { zone: true },
    });

    if (!location) {
      throw new NotFoundException('El centro de atención no fue encontrado');
    }

    return location;
  }

  async getByAddressName(addressName: string): Promise<Location> {
    return await this.repo.findOne({
      where: { zone: { addresses: { addressName } } },
      relations: { zone: true },
    });
  }

  async getByZone(zoneId: number): Promise<Location> {
    const locations = await this.repo.find({
      where: { zone: { zoneId } },
      relations: { zone: true },
    });

    if (locations.length === 0) {
      throw new NotFoundException(
        'No se encontró ningún centro relacionado con la zona indicada',
      );
    }

    const randomIndex = Math.floor(Math.random() * locations.length);
    return locations[randomIndex];
  }

  async create(createDto: CreateLocationDto): Promise<Location> {
    const zone = await this.zoneService.getById(createDto.zoneId);
    const location = this.repo.create({
      zone,
      address: createDto.address + ' ' + createDto.addressNro,
      locationName: createDto.locationName,
    });
    return await this.repo.save(location);
  }

  async update(
    locationId: number,
    updateDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.getById(locationId);
    if (updateDto.zoneId) {
      const zone = await this.zoneService.getById(updateDto.zoneId);
      location.zone = zone;
    }

    if (updateDto.address && updateDto.addressNro) {
      location.address = updateDto.address + ' ' + updateDto.addressNro;
    }

    if (updateDto.locationName) {
      location.locationName = updateDto.locationName;
    }

    return await this.repo.save(location);
  }

  async delete(locationId: number): Promise<Location> {
    const location = await this.getById(locationId);
    return await this.repo.remove(location);
  }
}
