import { UserTypeEnum } from '../../users/enums/user-type.enum.js';

export interface JwtPayload {
  sub: number;
  email: string;
  type: UserTypeEnum;
}
