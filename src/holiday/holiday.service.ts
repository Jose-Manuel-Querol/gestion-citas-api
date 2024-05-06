import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Holiday } from './holiday.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateManyHoliday } from './dtos/create-many-holidays.dto';

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

  async createMany(createDto: CreateManyHoliday): Promise<Holiday[]> {
    const holidays: Holiday[] = [];
    const currentHolidays = await this.getAllHoliday();
    const currentHolidayDates = currentHolidays.map(
      (holiday) => holiday.holidayDate,
    );
    console.log('currentHolidayDates', currentHolidayDates);
    const newHolidayDates = createDto.holidayDates;
    const holidaysToDelete = currentHolidayDates.filter(
      (holidayDate) => !newHolidayDates.includes(holidayDate),
    );

    console.log('holidaysToDelete', holidaysToDelete);

    if (holidaysToDelete.length > 0) {
      for (let i = 0; i < holidaysToDelete.length; i++) {
        await this.delete(holidaysToDelete[i]);
      }
    }
    for (let i = 0; i < createDto.holidayDates.length; i++) {
      if (!currentHolidayDates.includes(createDto.holidayDates[i])) {
        const holiday = this.repo.create({
          holidayDate: createDto.holidayDates[i],
        });
        holidays.push(holiday);
      }
    }

    await this.repo.save(holidays);
    return await this.getAllHoliday();
  }

  async delete(holidayDate: string): Promise<Holiday> {
    const holiday = await this.getOneByDate(holidayDate);
    console.log('holiday delete', holiday);
    return await this.repo.remove(holiday);
  }
}
