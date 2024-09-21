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
import { Franja } from '../franja/franja.entity';

@Entity()
export class Day {
  @PrimaryGeneratedColumn()
  dayId: number;

  @Column()
  dayName: string;

  @Column({ default: false })
  active: boolean;

  @Column({ default: false })
  deleted: boolean;

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

  @OneToMany(() => Franja, (franja) => franja.day, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  franjas: Franja[];
}
