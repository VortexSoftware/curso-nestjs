import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../constants';

export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
