import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AppointmentTypeAgent } from '../appointment-type-agent/appointment-type-agent.entity';
import { Appointment } from '../appointment/appointment.entity';

@Entity()
export class Day {
  @PrimaryGeneratedColumn()
  dayId: number;

  @Column({ nullable: true })
  dayDate: Date;

  @Column()
  dayName: string;

  @Column()
  startingHour: string;

  @Column()
  endingHour: string;

  @Column({ default: false })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => AppointmentTypeAgent,
    (appointmentTypeAgent) => appointmentTypeAgent.days,
    {
      onDelete: 'CASCADE',
    },
  )
  appointmentTypeAgent: AppointmentTypeAgent;

  @OneToMany(() => Appointment, (appointment) => appointment.day, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  appointments: Appointment[];
}
