import {
  ArgumentsHost,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';

export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    host.switchToHttp().getResponse().redirect('/user/login');
  }
}
