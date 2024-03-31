import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Zone } from '../zone/zone.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  addressId: number;

  @Column({ nullable: true })
  addressType: string;

  @Column({ nullable: true })
  code: number;

  @Column()
  addressName: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Zone, (zone) => zone.addresses, {
    onDelete: 'CASCADE',
  })
  zone: Zone;
}
