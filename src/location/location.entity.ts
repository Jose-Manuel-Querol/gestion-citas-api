import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Zone } from '../zone/zone.entity';
import { Appointment } from '../appointment/appointment.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  locationId: number;

  @Column()
  locationName: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  addressNro: string;

  @Column({ nullable: true })
  fullAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Zone, (zone) => zone.locations, {
    onDelete: 'CASCADE',
  })
  zone: Zone;

  @OneToMany(() => Appointment, (appointment) => appointment.location, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  appointments: Appointment[];
}
