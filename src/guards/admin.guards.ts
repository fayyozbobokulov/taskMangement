import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_KEY } from '../decorators/admin.decorator';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isAdmin = this.reflector.get<boolean>(
      ADMIN_KEY,
      context.getHandler(),
    );

    if (!isAdmin) {
      return true; // If the @Admin decorator is not present, allow access
    }

    const request = context.switchToHttp().getRequest();
    const userType = request.headers['user-type'];

    if (userType !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }

    return true;
  }
}
