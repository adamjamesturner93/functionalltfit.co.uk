import { User as PrismaUser, UserRole } from '@prisma/client';

export interface User extends PrismaUser {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: UserRole;
  membershipType: string;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authCode: string | null;
  authCodeExpires: Date | null;
}
