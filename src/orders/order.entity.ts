import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Report } from 'src/reports/reports.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'userId' })
  user: User;
}
