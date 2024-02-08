import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
  Render,
  Res,
  Redirect,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGaurd } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reporstService: ReportsService) {}

  @Get('/form')
  @Render('carReport')
  async carReport() {
    let name = 'Monu';
    return { name };
  }

  @UseGuards(AuthGuard)
  @Post('/form')
  @Redirect('/reports/cars')
  // @Serialize(ReportDto)
  createReport(
    // @Body('make') make: string,
    // @Body('model') model: string,
    // @Body('price') price: number,
    // @Body('year') year: number,
    // @Body('lgn') lgn: number,
    // @Body('lat') lat: number,
    // @Body('mileage') mileage: number,
    @Body() body: CreateReportDto,
    // @CurrentUser() user: User,
    // @Res() res,
  ) {
    return this.reporstService.create(body);
  }

  @UseGuards(AuthGuard)
  @Get('/cars')
  @Render('cars')
  async cars(@CurrentUser() user: User) {
    const allReports = await this.reporstService.findByUser(user);
    console.log(allReports);
    return { allReports };
  }

  @Get()
  GetEstimateDto(@Query() query: GetEstimateDto) {
    console.log(query);
    return this.reporstService.createEstimate(query);
  }

  // @Patch('/:id')
  // @UseGuards(AdminGaurd)
  // approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
  //   return this.reporstService.changeApproval(id, body.approved);
  // }
}

//
//http://localhost:3333/reports?make=ford&model=mustang&lgn=45&lat=45&year=1981&mileage=20000

// {
//   "price": 15000,
//   "make": "ford",
//   "model": "mustang",
//   "year": 1981,
//   "lgn": 45,
//   "lat": 45,
//   "mileage": 100000

// }

// res.redirect(`/reports/cars?make=${report.make}&model=${report.model}
// &price=${report.price}&year=${report.year}&lgn=${report.lgn}
// &lat=${report.lat}&mileage=${report.mileage}&user=${report.user.userName}`);
