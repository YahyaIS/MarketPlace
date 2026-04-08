export class UserEntity {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  listingsCount?: number;
  offersCount?: number;
}
