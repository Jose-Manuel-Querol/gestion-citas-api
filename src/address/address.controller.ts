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
import { RolesGuard } from '../account/account-auth/account-guards/roles.guard';
import { Roles } from '../shared/roles.decorator';

@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get()
  async getAllAddress(): Promise<Address[]> {
    return await this.addressService.getAll();
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('by-zone')
  async getAllAddressByZone(
    @Query('zoneId') zoneId: string,
  ): Promise<Address[]> {
    return await this.addressService.getAllByZone(parseInt(zoneId));
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('by-address-name')
  async getAllAddressByAddressName(
    @Query('addressName') addressName: string,
  ): Promise<{ address: string }[]> {
    return await this.addressService.getAllByAddressName(addressName);
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('/:id')
  async getAddressById(@Param('id') addressId: string): Promise<Address> {
    return await this.addressService.getById(parseInt(addressId));
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Post('create-one')
  async createOneAddress(@Body() body: CreateAddressDto): Promise<Address> {
    return await this.addressService.createOne(body);
  }

  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Delete('/:id')
  async deleteOneAddress(@Param('id') addressId: string): Promise<Address> {
    return await this.addressService.delete(parseInt(addressId));
  }
}
