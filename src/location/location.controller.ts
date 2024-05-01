import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAccountGuard } from '../account/account-auth/account-guards/account.jwt.guard';
import { LocationService } from './location.service';
import { Location } from './location.entity';
import { CreateLocationDto } from './dtos/create-location.dto';
import { UpdateLocationDto } from './dtos/update-location.dto';
import { RolesGuard } from '../account/account-auth/account-guards/roles.guard';
import { Roles } from '../shared/roles.decorator';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get()
  async getAllLocations(): Promise<Location[]> {
    return await this.locationService.getAll();
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Get('/:id')
  async getOneLocation(@Param('id') locationId: string): Promise<Location> {
    return await this.locationService.getById(parseInt(locationId));
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Post()
  async createLocation(@Body() body: CreateLocationDto): Promise<Location> {
    return await this.locationService.create(body);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Put('/:id')
  async updateLocation(
    @Param('id') locationId: string,
    @Body() body: UpdateLocationDto,
  ): Promise<Location> {
    return await this.locationService.update(parseInt(locationId), body);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAccountGuard, RolesGuard)
  @Roles('Admin')
  @Delete('/:id')
  async deleteLocation(@Param('id') locationId: string) {
    return await this.locationService.delete(parseInt(locationId));
  }
}
