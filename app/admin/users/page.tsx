import React from "react";
import Link from "next/link";
import { getUsers, UserFilters } from "@/app/admin/actions/users";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { MemberSearch } from "./member-search";
import { MembersTable } from "./member-table";
import { MemberFilters as MemberFiltersComponent } from "./member-filters";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    plan?: string;
  };
}) {
  const {
    page: pageNumber,
    search: searchParam,
    status: statusParam,
    plan: planParam,
  } = await searchParams;
  const page = Math.max(1, Number(pageNumber) || 1);
  const pageSize = 10;
  const search = searchParam || "";
  const filters: UserFilters = {
    status: statusParam as UserFilters["status"],
    plan: planParam as UserFilters["plan"],
  };

  const { users, total } = await getUsers(page, pageSize, search, filters);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link href="/admin/users/new">
          <Button>Create New Member</Button>
        </Link>
      </div>
      <Card>
        <CardContent className="mt-6">
          <div className="space-y-4">
            <MemberSearch />
            <MemberFiltersComponent />
          </div>
          <div className="mt-6">
            <MembersTable members={users} />
          </div>
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalItems={total}
              pageSize={pageSize}
              baseUrl="/admin/users"
              searchParams={{
                search: search || undefined,
                status: filters.status,
                plan: filters.plan,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
