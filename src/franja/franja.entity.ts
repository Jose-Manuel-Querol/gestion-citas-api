import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Day } from '../day/day.entity';

@Entity()
export class Franja {
  @PrimaryGeneratedColumn()
  franjaId: number;

  @Column()
  startingHour: string;

  @Column()
  endingHour: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Day, (day) => day.franjas, {
    onDelete: 'CASCADE',
  })
  day: Day;
}
