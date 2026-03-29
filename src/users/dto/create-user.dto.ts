import { Role } from '../../generated/prisma/client';

export class CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role?: Role;
}