import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AppointmentTypeAgent } from '../appointment-type-agent/appointment-type-agent.entity';
import { Day } from '../day/day.entity';
import { Location } from '../location/location.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  appointmentId: number;

  @Column()
  clientName: string;

  @Column({ nullable: true })
  clientLastName: string;

  @Column()
  clientPhoneNumber: string;

  @Column()
  clientAddress: string;

  @Column()
  code: string;

  @Column()
  startingHour: string;

  @Column({ nullable: true })
  endingHour: string;

  @Column({ default: false })
  cancelled: boolean;

  @Column({ nullable: true })
  cancelledBy: string;

  @Column({ nullable: true, type: 'datetime' })
  dayDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => AppointmentTypeAgent,
    (appointmentTypeAgent) => appointmentTypeAgent.appointments,
    {
      onDelete: 'CASCADE',
    },
  )
  appointmentTypeAgent: AppointmentTypeAgent;

  @ManyToOne(() => Location, (location) => location.appointments, {
    onDelete: 'CASCADE',
  })
  location: Location;

  @ManyToOne(() => Day, (day) => day.appointments, {
    onDelete: 'CASCADE',
  })
  day: Day;
}
