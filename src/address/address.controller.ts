import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { Address } from './address.entity';
import { CreateAddressDto } from './dtos/create-address.dto';
import { JwtAccountGuard } from '../account/account-auth/account-guards/account.jwt.guard';
import { RolesGuard } from '../account/account-auth/account-guards/roles.guard';
import { Roles } from '../shared/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { AddressExampleDto } from './dtos/address.example.dto';
import { CompleteAddressExampleDto } from './dtos/complete-address.example.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAddressDto } from './dtos/update-address.dto';

@ApiTags('Direcciones')
@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @ApiOperation({ summary: 'Obtener todas las direcciones' })
  @ApiResponse({
    status: 200,
    description: 'Obtiene todas las direcciones',
    type: [AddressExampleDto],
  })
  //@UseGuards(ApiGuard)
  @Get('secure/get-all')
  async getAllAddressPublicApi(): Promise<Address[]> {
    return await this.addressService.getAll();
  }

  @ApiOperation({
    summary:
      'Obtener todas las direcciones completas, buscando por el nombre de la dirección',
  })
  @ApiResponse({
    status: 200,
    description:
      'Obtener todas las direcciones completas, buscando por el nombre de la dirección',
    type: [AddressExampleDto],
  })
  //@UseGuards(ApiGuard)
  @Get('secure/by-address-name')
  async getAllAddressByAddressNamePublicApi(
    @Query('addressName') addressName: string,
  ): Promise<Address[]> {
    return await this.addressService.getAllByAddressNameComplete(addressName);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get()
  async getAllAddress(): Promise<Address[]> {
    return await this.addressService.getAll();
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('by-zone')
  async getAllAddressByZone(
    @Query('zoneId') zoneId: string,
  ): Promise<Address[]> {
    return await this.addressService.getAllByZone(parseInt(zoneId));
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('by-address-name')
  async getAllAddressByAddressName(
    @Query('addressName') addressName: string,
  ): Promise<{ address: string }[]> {
    return await this.addressService.getAllByAddressName(addressName);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('by-address-name/complete')
  async getAllAddressCompleteByAddressName(
    @Query('addressName') addressName: string,
  ): Promise<Address[]> {
    return await this.addressService.getAllByAddressNameComplete(addressName);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('/:id')
  async getAddressById(@Param('id') addressId: string): Promise<Address> {
    return await this.addressService.getById(parseInt(addressId));
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Post('create-one')
  async createOneAddress(@Body() body: CreateAddressDto): Promise<Address> {
    return await this.addressService.createOne(body);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Put('/:id')
  async updateOneAddress(
    @Param('id') addressId: string,
    @Body() body: UpdateAddressDto,
  ): Promise<Address> {
    return await this.addressService.update(parseInt(addressId), body);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Post('upload-excel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const excel = await this.addressService.importAddressesFromExcel(file);
    return excel;
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Delete('/:id')
  async deleteOneAddress(@Param('id') addressId: string): Promise<Address> {
    return await this.addressService.delete(parseInt(addressId));
  }
}
