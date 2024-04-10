import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { Agent } from '../agent/agent.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  accountId: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  verificationTokenExpiration: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Role, (role) => role.accounts, {
    onDelete: 'SET NULL',
  })
  role: Role;

  @OneToOne(() => Agent, (agent) => agent.account, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  agent: Agent;
}
