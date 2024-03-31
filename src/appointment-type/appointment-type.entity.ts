import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppointmentTypeAgent } from '../appointment-type-agent/appointment-type-agent.entity';

@Entity()
export class AppointmentType {
  @PrimaryGeneratedColumn()
  appointmentTypeId: number;

  @Column()
  typeName: string;

  @Column()
  duration: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => AppointmentTypeAgent,
    (appointmentTypeAgent) => appointmentTypeAgent.appointmentType,
    {
      cascade: true,
      onDelete: 'SET NULL',
    },
  )
  appointmentTypeAgents: AppointmentTypeAgent[];
}
