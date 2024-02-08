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
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from './user.entity';
import { ReportsService } from 'src/reports/reports.service';
import { OrdersService } from 'src/orders/orders.service';

@Controller('user')
// @Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private reportsService: ReportsService,
    private ordersService: OrdersService,
  ) {}

  @Get()
  @Render('index')
  async index() {
    return {};
  }
  @Get('/register')
  @Render('user/signup')
  async signup() {
    const users = await this.usersService.findAll();
    let viewData = [];
    viewData['users'] = users;
    return {
      viewData,
    };
  }
  @Post('/register')
  @Redirect('/user/profile')
  async createUser(
    @Body('userName') userName: string,
    @Body('phoneNumber') phoneNumber: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Session() session: any,
  ) {
    const user = await this.authService.signup(
      userName,
      phoneNumber,
      email,
      password,
    );
    session.user = user;
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  @Render('user/profile')
  async profile(@CurrentUser() user) {
    const reports = await this.reportsService.getReportsByUserId(user.id);
    let viewData = [];
    viewData['reports'] = reports;
    return {
      user: user,
      viewData: viewData,
    };
  }

  @Get('/login')
  @Render('user/login')
  async login(@Session() session, @Res() res) {
    if (session.user) {
      res.redirect('/user/profile');
    }
    return {};
  }

  @Post('/login')
  @Redirect('/user/profile')
  async signin(
    @Body('email') email: string,
    @Body('password') password: string,
    @Session() session: any,
    @Res() res,
  ) {
    if (session.user) {
      res.redirect('/user/profile');
    }
    const user = await this.authService.signin(email, password);
    session.user = user;
  }

  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  @Redirect('/user/login')
  signOut(@Session() session, @Res() res) {
    session.user = null;
  }

  @Get('/allapprovedcars')
  @Render('user/allCars')
  async viewApprovedCars() {
    const reports = await this.reportsService.getApprovedReports();

    let viewData = [];
    viewData['reports'] = reports;
    return {
      viewData,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/allapprovedcars/:id')
  @Redirect('/user/allapprovedcars')
  async addToCart(@Param('id') id: string, @CurrentUser() user) {
    const report = await this.reportsService.getReportByReportId(id);
    if (report) {
      await this.ordersService.createOrderFromReport(report, user);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/orders')
  @Render('user/cart-details')
  async allOrders(@CurrentUser() user) {
    const orders = await this.ordersService.findOrderByUserId(user.id);
    let viewData = [];
    viewData['orders'] = orders;
    return {
      user: user,
      viewData,
    };
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeuser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}

//
// @Post('/signup')
// async createUserDb(@Body() body: CreateUserDto, @Session() session: any) {
//   const user = await this.authService.signup(body.email, body.password);
//   session.userID = user.id;
//   return user;
// }
