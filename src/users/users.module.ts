import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { Report } from 'src/reports/reports.entity';
import { ReportsService } from '../reports/reports.service';
import { OrdersService } from 'src/orders/orders.service';
import { Order } from 'src/orders/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Report]),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, ReportsService, OrdersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
