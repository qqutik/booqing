import { Reflector } from '@nestjs/core';
import type { UserTypeEnum } from '../../users/enums/user-type.enum.js';

export const UserTypes = Reflector.createDecorator<UserTypeEnum[]>();
