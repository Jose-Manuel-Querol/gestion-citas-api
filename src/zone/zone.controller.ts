import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ZoneService } from './zone.service';
import { JwtAccountGuard } from '../account/account-auth/account-guards/account.jwt.guard';
import { Zone } from './zone.entity';
import { CreateZoneDto } from './dtos/create-zone.dto';
import { RolesGuard } from '../account/account-auth/account-guards/roles.guard';
import { Roles } from '../shared/roles.decorator';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('zone')
export class ZoneController {
  constructor(private zoneService: ZoneService) {}

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get()
  async getAllZones(): Promise<Zone[]> {
    return await this.zoneService.getAll();
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('/:id')
  async getOneZone(@Param('id') zoneId: string): Promise<Zone> {
    return await this.zoneService.getById(parseInt(zoneId));
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Post()
  async createZone(@Body() body: CreateZoneDto): Promise<Zone> {
    return await this.zoneService.create(body);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Put('/:id')
  async updateZone(
    @Param('id') zoneId: string,
    @Body() body: CreateZoneDto,
  ): Promise<Zone> {
    return await this.zoneService.update(parseInt(zoneId), body);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Delete('/:id')
  async deleteZone(@Param('id') zoneId: string) {
    return await this.zoneService.delete(parseInt(zoneId));
  }
}
