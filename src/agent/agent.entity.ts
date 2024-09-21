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
import { VacationDay } from '../vacation-day/vacation-day.entity';

@Entity()
export class Agent {
  @PrimaryGeneratedColumn()
  agentId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true, unique: true })
  slug: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  dni: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  addressNro: string;

  @Column({ nullable: true })
  fullAddress: string;

  @Column({ nullable: true, type: 'datetime' })
  vacationStart: string;

  @Column({ nullable: true, type: 'datetime' })
  vacationEnd: string;

  @Column({ default: false })
  vacation: boolean;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column({ nullable: true, type: 'datetime' })
  activationStart: string;

  @Column({ nullable: true, type: 'datetime' })
  activationEnd: string;

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

  @OneToMany(() => VacationDay, (vacationDay) => vacationDay.agent, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  vacationDays: VacationDay[];

  @OneToOne(() => Account, (account) => account.agent, {
    onDelete: 'SET NULL',
  })
  account: Account;
}
