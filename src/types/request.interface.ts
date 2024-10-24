import { Request } from 'express';
import { User } from 'src/modules/user/interface/user.interface';

export interface RequestWithUser extends Request {
  user?: User;
}
