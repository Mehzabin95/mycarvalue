import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Report } from 'src/reports/reports.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterUpdate()
  update() {}

  @AfterRemove()
  remove() {}
}
