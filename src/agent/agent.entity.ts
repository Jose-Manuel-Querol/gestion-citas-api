import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Zone } from '../zone/zone.entity';
import { AppointmentTypeAgent } from '../appointment-type-agent/appointment-type-agent.entity';
import { Account } from '../account/account.entity';

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

  @Column({ nullable: true })
  dni: string;

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

  @OneToOne(() => Account, (account) => account.agent, {
    onDelete: 'SET NULL',
  })
  account: Account;
}
