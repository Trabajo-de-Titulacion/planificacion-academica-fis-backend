import { SetMetadata } from '@nestjs/common';
import { RolEntity } from '../entities/rol.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);