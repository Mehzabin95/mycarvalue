import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGaurd implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return request.session.admin;
  }
}
