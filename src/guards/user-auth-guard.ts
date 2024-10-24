import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { RequestWithUser } from 'src/types/request.interface';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userId = request.headers['user-id'];

    if (!userId) {
      throw new UnauthorizedException('User ID not provided in headers');
    }

    try {
      const user = await this.userService.getUserById(Number(userId));
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Attach the user object to the request
      request.user = user;
      return true;
    } catch (err: any) {
      throw new UnauthorizedException('Invalid user ID ', err.message);
    }
  }
}
