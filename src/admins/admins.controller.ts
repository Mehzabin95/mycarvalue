import {
  Body,
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Query,
  Delete,
  NotFoundException,
  Session,
  UseGuards,
  Render,
  Redirect,
  Res,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsAuthService } from './adminAuth.service';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { AdminGaurd } from 'src/guards/admin.guard';
import { CurrentAdmin } from './decorators/current-admin.decorator';
import { ReportsService } from 'src/reports/reports.service';
import { UsersService } from 'src/users/users.service';
import { OrdersService } from 'src/orders/orders.service';

@Controller('admin')
export class AdminsController {
  constructor(
    private adminsService: AdminsService,
    private adminsAuthService: AdminsAuthService,
    private reportsService: ReportsService,
    private usersService: UsersService,
    private ordersService: OrdersService,
  ) {}

  //
  @Get('/register')
  @Render('admin/adminSignup')
  registerAdmin() {
    return;
  }

  @Post('/register')
  @Redirect('/admin/profile')
  async createAdmin(
    @Body('adminName') adminName: string,
    @Body('phoneNumber') phoneNumber: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Session() session: any,
  ) {
    const admin = await this.adminsAuthService.signup(
      adminName,
      phoneNumber,
      email,
      password,
    );
    session.admin = admin;
  }

  @UseGuards(AdminGaurd)
  @Get('/profile')
  @Render('admin/adminProfile')
  async adminProfile(@CurrentAdmin() currentAdmin) {
    return {
      admin: currentAdmin,
    };
  }

  @Get('/login')
  @Render('admin/adminLogin')
  async adminLogin(@Session() session: any, @Res() res) {
    if (session.admin) {
      res.redirect('/admin/profile');
    }
    return {};
  }

  @Post('/login')
  @Redirect('/admin/alladmins')
  async signin(
    @Body('email') email: string,
    @Body('password') password: string,
    @Session() session: any,
    @Res() res,
  ) {
    if (session.admin) {
      res.redirect('/admin/profile');
    }
    const admin = await this.adminsAuthService.signin(email, password);
    session.admin = admin;

    // res.redirect(`/user/profile?userName=${user.userName}`);
  }
  @Post('/signout')
  @Redirect('/admin/login')
  signOut(@Session() session) {
    session.admin = null;
  }

  @Get('/allusers')
  @Render('admin/client/viewAllusers')
  async viewUsers() {
    const clients = await this.usersService.findAll();
    let viewData = [];
    viewData['clients'] = clients;
    return {
      viewData,
    };
  }

  @Get('/alladmins')
  @Render('admin/viewAllAdmins')
  async viewAdmins() {
    const admins = await this.adminsService.findAll();
    // console.log(admins);
    let viewData = [];
    viewData['admins'] = admins;
    return {
      viewData,
    };
  }

  @Post('/users/:id')
  @Redirect('/admin/allusers')
  async removeuser(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }

  @Get('/allcars')
  @UseGuards(AdminGaurd)
  @Render('admin/allUserCars')
  async viewCars() {
    const reports = await this.reportsService.findAll();
    let viewData = [];
    viewData['reports'] = reports;
    return {
      viewData,
    };
  }

  @Post('/reports/:id')
  @Redirect('/admin/allcars')
  @UseGuards(AdminGaurd)
  approveReport(@Param('id') id: string) {
    return this.reportsService.changeApproval(id);
  }
  // @Get(':id/reports')
  // async getReports(@Param('id') adminId: number) {
  //   const admin = await this.adminsService.findById(adminId);
  //   return admin.reports;
  // }

  @Get('/orders')
  @Render('admin/viewAllOrders')
  @UseGuards(AdminGaurd)
  async viewOrders() {
    const orders = await this.ordersService.findAll();
    let viewData = [];
    viewData['orders'] = orders;
    return {
      viewData,
    };
  }

  @Post('/orders/:id')
  @Redirect('/admin/orders')
  @UseGuards(AdminGaurd)
  async removeorder(@Param('id') id: number) {
    return this.ordersService.remove(+id);
  }

  @Post('/:id')
  @Redirect('/admin/alladmins')
  @UseGuards(AdminGaurd)
  async removeadmin(@Param('id') id: number) {
    return this.adminsService.remove(+id);
  }
}
