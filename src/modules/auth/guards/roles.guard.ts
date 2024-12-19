import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoleEnums = this.reflector.getAllAndOverride<Role[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoleEnums) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoleEnums.some((role) => user?.role?.includes(role));
  }
}
