import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './reports.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createEstimate({ make, model, lgn, lat, year, mileage }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lgn - :lgn BETWEEN -5 AND 5', { lgn })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }

  create(reportDto: CreateReportDto) {
    const report = this.repo.create(reportDto);
    // report.user = user;
    // console.log(report.user);
    return this.repo.save(report);
  }

  async findAll(): Promise<Report[]> {
    return await this.repo.find();
  }

  async getApprovedReports(): Promise<Report[]> {
    return this.repo.find({
      where: { approved: true },
      relations: {
        user: true,
      },
    });
  }

  async findByUser(user: User): Promise<Report[]> {
    return await this.repo.find({
      where: { user: user },
      relations: {
        user: true,
      },
    });
  }

  async changeApproval(id: string) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });

    if (!report) {
      throw new NotFoundException('report not found');
    }
    report.approved = !report.approved;
    return this.repo.save(report);
  }

  async getReportsByUserId(userId: number): Promise<Report[]> {
    return this.repo.find({ where: { user: { id: userId } } });
  }

  async getReportByReportId(id: string): Promise<Report> {
    const report = await this.repo.findOne({
      where: { id: parseInt(id) },
      relations: {
        user: true,
      },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }
}
