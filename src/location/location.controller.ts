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

@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @UseGuards(JwtAccountGuard)
  @Get()
  async getAllLocations(): Promise<Location[]> {
    return await this.locationService.getAll();
  }

  @UseGuards(JwtAccountGuard)
  @Get('/:id')
  async getOneLocation(@Param('id') locationId: string): Promise<Location> {
    return await this.locationService.getById(parseInt(locationId));
  }

  @UseGuards(JwtAccountGuard)
  @Post()
  async createLocation(@Body() body: CreateLocationDto): Promise<Location> {
    return await this.locationService.create(body);
  }

  @UseGuards(JwtAccountGuard)
  @Put('/:id')
  async updateLocation(
    @Param('id') locationId: string,
    @Body() body: UpdateLocationDto,
  ): Promise<Location> {
    return await this.locationService.update(parseInt(locationId), body);
  }

  @UseGuards(JwtAccountGuard)
  @Delete('/:id')
  async deleteLocation(@Param('id') locationId: string) {
    return await this.locationService.delete(parseInt(locationId));
  }
}
