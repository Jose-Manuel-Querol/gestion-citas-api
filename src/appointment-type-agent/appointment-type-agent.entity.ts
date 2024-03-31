import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppointmentType } from '../appointment-type/appointment-type.entity';
import { Agent } from '../agent/agent.entity';
import { Appointment } from '../appointment/appointment.entity';
import { Day } from '../day/day.entity';

@Entity()
export class AppointmentTypeAgent {
  @PrimaryGeneratedColumn()
  appointmentTypeAgentId: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => Appointment,
    (appointment) => appointment.appointmentTypeAgent,
    {
      cascade: true,
      onDelete: 'SET NULL',
    },
  )
  appointments: Appointment[];

  @OneToMany(() => Day, (day) => day.appointmentTypeAgent, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  days: Day[];

  @ManyToOne(
    () => AppointmentType,
    (appointmentType) => appointmentType.appointmentTypeAgents,
    {
      onDelete: 'CASCADE',
    },
  )
  appointmentType: AppointmentType;

  @ManyToOne(() => Agent, (agent) => agent.appointmentTypeAgents, {
    onDelete: 'CASCADE',
  })
  agent: Agent;
}
