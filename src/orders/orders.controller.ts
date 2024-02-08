import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // @Get()
  // async allOrders() {
  //   const orders = await this.ordersService.findAll();
  //   let viewData = [];
  //   viewData['orders'] = orders;
  //   return {
  //     viewData,
  //   };
  // }
}
