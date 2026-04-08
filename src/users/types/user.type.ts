import { Role, Session, Listing, Offer } from 'src/generated/prisma/client';

export type User = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  role: Role;
  session?: Session;
  listings?: Listing[];
  offers?: Offer[];
  _count?: {
    listings?: number;
    offers?: number;
  };
};
