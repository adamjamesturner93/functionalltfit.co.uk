"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  User,
  MembershipStatus,
  MembershipPlan,
  UserRole,
} from "@prisma/client";

export type UserFilters = {
  status?: MembershipStatus | "ALL";
  plan?: MembershipPlan | "ALL";
};

export async function getUsers(
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  filters: UserFilters = {}
): Promise<{ users: User[]; total: number }> {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const searchTerms = search.split(" ").filter(Boolean);

  const where: any = {};

  if (searchTerms.length > 0) {
    where.OR = searchTerms.map((term) => ({
      OR: [
        { name: { contains: term, mode: "insensitive" } },
        { email: { contains: term, mode: "insensitive" } },
      ],
    }));
  }

  if (filters.status && filters.status !== "ALL") {
    where.membershipStatus = filters.status;
  }

  if (filters.plan && filters.plan !== "ALL") {
    where.membershipPlan = filters.plan;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { name: "asc" },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

export type UserInput = {
  name: string;
  email: string;
  dateOfBirth?: Date | null;
  membershipStatus: MembershipStatus;
  membershipPlan: MembershipPlan;
  role: UserRole;
};

export async function createUser(data: UserInput): Promise<User> {
  const user = await prisma.user.create({
    data,
  });
  revalidatePath("/admin/users");
  return user;
}

export async function updateUser(id: string, data: UserInput): Promise<User> {
  const user = await prisma.user.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
  return user;
}

export async function deleteUser(id: string): Promise<User> {
  const user = await prisma.user.delete({
    where: { id },
  });
  revalidatePath("/admin/users");
  return user;
}
