import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { Repository } from 'typeorm';
import { ZoneService } from '../zone/zone.service';
import { CreateAddressDto } from './dtos/create-address.dto';
import * as XLSX from 'xlsx';
import { UpdateAddressDto } from './dtos/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private repo: Repository<Address>,
    private zoneService: ZoneService,
  ) {}

  async getAll(): Promise<Address[]> {
    return await this.repo.find({ relations: { zone: true } });
  }

  async getById(addressId: number): Promise<Address> {
    const address = await this.repo.findOne({
      where: { addressId },
      relations: { zone: true },
    });
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
    const addresses = await this.repo
      .createQueryBuilder('address')
      .where(
        "CONCAT(address.addressType, ' ', address.addressName) LIKE :name",
        { name: `%${addressName}%` },
      )
      .getMany();

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

  async importAddressesFromExcel(file: Express.Multer.File): Promise<void> {
    // Load the workbook from the buffer
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Process each row in the excel
    for (const row of data) {
      //console.log('row', row);
      const code = row['CODIGO'];
      const addressType = row['TIPO'];
      const addressName = row['NOMBRE VIA'];
      const zoneName = row['ZONA BASICA'];

      // Find the zone by name
      const zone = await this.zoneService.getByZoneName(zoneName);
      const address = this.repo.create({
        addressName,
        zone,
      });
      if (code) {
        address.code = code;
      }

      if (addressType) {
        address.addressType = addressType;
      }

      await this.repo.save(address);
    }
  }

  async update(
    addressId: number,
    updateDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.getById(addressId);
    const zone = await this.zoneService.getByZoneName(updateDto.zoneName);
    address.zone = zone;
    address.addressName = updateDto.addressName;
    address.addressType = updateDto.addressType;
    address.code = updateDto.code;
    return await this.repo.save(address);
  }

  async delete(addressId: number): Promise<Address> {
    const address = await this.getById(addressId);
    await this.repo.remove(address);
    address.addressId = addressId;
    return address;
  }
}
