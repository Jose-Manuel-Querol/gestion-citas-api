import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Holiday } from './holiday.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateManyHoliday } from './dtos/create-many-holidays.dto';
import { HolidayDto } from './dtos/holiday.dto';

@Injectable()
export class HolidayService {
  constructor(@InjectRepository(Holiday) private repo: Repository<Holiday>) {}

  async getAllHoliday(): Promise<Holiday[]> {
    return await this.repo.find();
  }

  async getAllHolidayAvailable(currentDate: string): Promise<Holiday[]> {
    return await this.repo.find({
      where: { holidayDate: MoreThanOrEqual(currentDate) },
    });
  }

  async getOneByDate(holidayDate: string): Promise<Holiday> {
    return await this.repo.findOne({
      where: { holidayDate },
    });
  }

  async getAllByDate(holidayDate: string): Promise<Holiday[]> {
    return await this.repo.find({
      where: { holidayDate },
    });
  }

  async getOneById(holidayId: number): Promise<Holiday> {
    const holiday = await this.repo.findOne({
      where: { holidayId },
    });
    if (!holiday) {
      throw new NotFoundException('No se encontro el día');
    }
    return holiday;
  }

  async createMany(createDto: CreateManyHoliday): Promise<Holiday[]> {
    const holidays: Holiday[] = [];
    for (let i = 0; i < createDto.holidayDates.length; i++) {
      const holiday = this.repo.create({
        holidayDate: createDto.holidayDates[i],
      });
      holidays.push(holiday);
    }

    await this.repo.save(holidays);
    return await this.getAllHoliday();
  }

  async update(holidayId: number, updateDto: HolidayDto): Promise<Holiday> {
    const holiday = await this.getOneById(holidayId);
    holiday.holidayDate = updateDto.holidayDate;
    return await this.repo.save(holiday);
  }

  async delete(holidayId: number): Promise<Holiday> {
    const holiday = await this.getOneById(holidayId);
    return await this.repo.remove(holiday);
  }
}
