import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/reports.entity';
import { AdminsModule } from './admins/admins.module';
import { UnauthorizedExceptionFilter } from './filters/unauthorized-exception.filter';
import { AdminsAuthService } from './admins/adminAuth.service';
import { ReportsService } from './reports/reports.service';
import { OrdersModule } from './orders/orders.module';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get('DB_HOST'),
          port: +config.get('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_NAME'),
          entities: [__dirname + '/**/*.entity.{ts,js}'],
          synchronize: true,
        };
      },
    }),

    UsersModule,
    ReportsModule,
    AdminsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: UnauthorizedExceptionFilter,
    // },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}

//
// type: 'mysql',
// host: config.get('DB_HOST'),
// port: +config.get('DB_PORT'),
// username: config.get('DB_USERNAME'),
// password: config.get('DB_PASSWORD'),
// database: config.get('DB_NAME'),
// entities: [__dirname + '/../**/*.entity.{ts,js}'],
// synchronize: true,
//
