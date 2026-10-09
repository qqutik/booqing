import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserTypes } from '../decorators/user-types.decorator.js';
import type { AuthenticatedRequest } from '../interfaces/authenticated-request.interface.js';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext) {
    const allowedTypes = this.reflector.getAllAndOverride(UserTypes, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!allowedTypes) {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return allowedTypes.includes(request.user.type);
  }
}
