import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Report } from 'src/reports/reports.entity';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  adminName: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.admin)
  reports: Report[];
}
