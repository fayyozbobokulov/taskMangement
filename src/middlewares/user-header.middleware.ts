import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class UserHeaderMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers['user-id'];

      if (!userId) {
        throw new BadRequestException('user-id header is required');
      }

      // Get user from database
      const user = await this.userService.getUserById(Number(userId));

      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Attach user type to headers
      req.headers['user-type'] = user.role;

      // Optionally attach the entire user object to request
      (req as any).user = user;

      next();
    } catch (error) {
      next(error);
    }
  }
}
