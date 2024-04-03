import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { Like, Repository } from 'typeorm';
import { ZoneService } from '../zone/zone.service';
import { CreateAddressDto } from './dtos/create-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private repo: Repository<Address>,
    private zoneService: ZoneService,
  ) {}

  async getAll(): Promise<Address[]> {
    return await this.repo.find();
  }

  async getById(addressId: number): Promise<Address> {
    const address = await this.repo.findOne({ where: { addressId } });
    if (!address) {
      throw new NotFoundException('La dirección no fue encontrada');
    }
    return address;
  }

  async getAllByZone(zoneId: number): Promise<Address[]> {
    return await this.repo.find({ where: { zone: { zoneId } } });
  }

  async getAllByAddressName(
    addressName: string,
  ): Promise<{ address: string }[]> {
    const addresses = await this.repo.find({
      where: { addressName: Like(`%${addressName}%`) },
    });

    const foundAddresses: { address: string }[] = [];

    for (let i = 0; i < addresses.length; i++) {
      let address: string;
      if (addresses[i].addressType) {
        address = `${addresses[i].addressType}  ${addresses[i].addressName}`;
      } else {
        address = addresses[i].addressName;
      }

      foundAddresses.push({ address });
    }

    return foundAddresses;
  }

  async createOne(createDto: CreateAddressDto): Promise<Address> {
    const zone = await this.zoneService.getByZoneName(createDto.zoneName);
    const address = this.repo.create({
      addressName: createDto.addressName,
      zone,
    });
    if (createDto.addressType) {
      address.addressType = createDto.addressType;
    }
    if (createDto.code) {
      address.code = createDto.code;
    }

    return await this.repo.save(address);
  }

  async delete(addressId: number): Promise<Address> {
    const address = await this.getById(addressId);
    await this.repo.remove(address);
    address.addressId = addressId;
    return address;
  }
}
