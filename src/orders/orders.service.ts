import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Report } from 'src/reports/reports.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private repo: Repository<Order>) {}

  async createOrderFromReport(report: Report, user: User): Promise<void> {
    const newOrder = new Order();
    newOrder.price = report.price;
    newOrder.make = report.make;
    newOrder.model = report.model;
    newOrder.year = report.year;
    newOrder.user = user;

    await this.repo.save(newOrder);
  }

  async findAll(): Promise<Order[]> {
    return await this.repo.find({
      relations: {
        user: true,
      },
    });
  }

  async findOrderByUserId(userId: number): Promise<Order[]> {
    return await this.repo.find({ where: { user: { id: userId } } });
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('iser not found');
    }
    return this.repo.remove(user);
  }
}
