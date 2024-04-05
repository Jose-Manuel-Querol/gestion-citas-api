import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Zone } from '../zone/zone.entity';
import { AppointmentTypeAgent } from '../appointment-type-agent/appointment-type-agent.entity';

@Entity()
export class Agent {
  @PrimaryGeneratedColumn()
  agentId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true, unique: true })
  slug: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  city: string;

  @Column()
  phoneNumber: string;

  @Column()
  address: string;

  @Column()
  vacationStart: string;

  @Column()
  vacationEnd: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Zone, (zone) => zone.agents, {
    onDelete: 'CASCADE',
  })
  zone: Zone;

  @OneToMany(
    () => AppointmentTypeAgent,
    (appointmentTypeAgent) => appointmentTypeAgent.agent,
    {
      cascade: true,
      onDelete: 'SET NULL',
    },
  )
  appointmentTypeAgents: AppointmentTypeAgent[];
}
