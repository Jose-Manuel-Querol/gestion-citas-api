import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Holiday {
  @PrimaryGeneratedColumn()
  holidayId: number;

  @Column({ type: 'datetime' })
  holidayDate: string;

  @CreateDateColumn()
  createdAt: Date;
}
