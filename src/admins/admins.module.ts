import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { Admin } from './admin.entity';
import { AdminsAuthService } from './adminAuth.service';
import { ReportsService } from '../reports/reports.service';
import { Report } from 'src/reports/reports.entity';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { OrdersService } from 'src/orders/orders.service';
import { Order } from 'src/orders/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    TypeOrmModule.forFeature([Report]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [AdminsController],
  providers: [
    AdminsService,
    AdminsAuthService,
    ReportsService,
    UsersService,
    OrdersService,
  ],
})
export class AdminsModule {}
