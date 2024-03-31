import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Address } from '../address/address.entity';
import { Agent } from '../agent/agent.entity';
import { Location } from '../location/location.entity';

@Entity()
export class Zone {
  @PrimaryGeneratedColumn()
  zoneId: number;

  @Column()
  zoneName: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Address, (address) => address.zone, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  addresses: Address[];

  @OneToMany(() => Location, (location) => location.zone, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  locations: Location[];

  @OneToMany(() => Agent, (agent) => agent.zone, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  agents: Agent[];
}
