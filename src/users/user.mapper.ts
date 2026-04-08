import { UserEntity } from './entities/user.entity';
import { User } from './types/user.type';

export const mapUser = (user: User): UserEntity => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  listingsCount: user._count?.listings,
  offersCount: user._count?.offers,
});

export type MappedUser = ReturnType<typeof mapUser>;
