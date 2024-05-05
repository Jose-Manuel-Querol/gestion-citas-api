import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Agent } from '../agent/agent.entity';

@Entity()
export class VacationDay {
  @PrimaryGeneratedColumn()
  vacationDayId: number;

  @Column({ type: 'datetime' })
  vacationDayDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Agent, (agent) => agent.vacationDays, {
    onDelete: 'SET NULL',
  })
  agent: Agent;
}
