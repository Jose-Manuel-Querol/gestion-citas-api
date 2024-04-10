import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../account/account.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column()
  roleName: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Account, (account) => account.role, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  accounts: Account[];
}
