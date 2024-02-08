import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Admin } from 'src/admins/admin.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lgn: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;

  @ManyToOne(() => Admin, (admin) => admin.reports)
  admin: Admin;
}
