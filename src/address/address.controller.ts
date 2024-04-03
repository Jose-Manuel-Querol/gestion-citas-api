import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { Address } from './address.entity';
import { CreateAddressDto } from './dtos/create-address.dto';
import { JwtAccountGuard } from '../account/account-auth/account-guards/account.jwt.guard';

@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @UseGuards(JwtAccountGuard)
  @Get()
  async getAllAddress(): Promise<Address[]> {
    return await this.addressService.getAll();
  }

  @UseGuards(JwtAccountGuard)
  @Get('by-zone')
  async getAllAddressByZone(
    @Query('zoneId') zoneId: string,
  ): Promise<Address[]> {
    return await this.addressService.getAllByZone(parseInt(zoneId));
  }

  @UseGuards(JwtAccountGuard)
  @Get('by-address-name')
  async getAllAddressByAddressName(
    @Query('addressName') addressName: string,
  ): Promise<{ address: string }[]> {
    return await this.addressService.getAllByAddressName(addressName);
  }

  @UseGuards(JwtAccountGuard)
  @Get('/:id')
  async getAddressById(@Param('id') addressId: string): Promise<Address> {
    return await this.addressService.getById(parseInt(addressId));
  }

  @UseGuards(JwtAccountGuard)
  @Post('create-one')
  async createOneAddress(@Body() body: CreateAddressDto): Promise<Address> {
    return await this.addressService.createOne(body);
  }

  @UseGuards(JwtAccountGuard)
  @Delete('/:id')
  async deleteOneAddress(@Param('id') addressId: string): Promise<Address> {
    return await this.addressService.delete(parseInt(addressId));
  }
}
