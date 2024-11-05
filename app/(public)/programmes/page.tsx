import { Suspense } from "react";
import { Metadata } from "next";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getProgrammes } from "@/app/actions/programmes";
import { getCurrentUserId } from "@/lib/auth-utils";
import { ProgrammeCard } from "./programme-card";
import { ProgrammeFilters } from "./programme-filters";
import { Pagination } from "@/components/ui/pagination";

export const metadata: Metadata = {
  title: "Fitness Programmes | FunctionallyFit",
  description:
    "Explore our range of fitness programmes designed to help you achieve your health and fitness goals.",
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ProgrammesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 9;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const userId = await getCurrentUserId();

  const filters = {
    intention:
      typeof searchParams.intention === "string"
        ? searchParams.intention
        : undefined,
    length:
      typeof searchParams.length === "string" ? searchParams.length : undefined,
    minSessions:
      typeof searchParams.minSessions === "string"
        ? parseInt(searchParams.minSessions)
        : undefined,
    maxSessions:
      typeof searchParams.maxSessions === "string"
        ? parseInt(searchParams.maxSessions)
        : undefined,
    saved: searchParams.saved === "true",
  };

  const { programmes, total } = await getProgrammes(
    page,
    pageSize,
    search,
    filters,
    userId!
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Fitness Programmes
          </h1>
          <p className="text-muted-foreground">
            Choose from our collection of pre-built programmes
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <form className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search programmes..."
              className="pl-8"
              defaultValue={search}
              aria-label="Search programmes"
            />
          </form>
          <ProgrammeFilters />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense
          fallback={Array(pageSize)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 animate-pulse rounded-lg"
              ></div>
            ))}
        >
          {programmes.length === 0 ? (
            <p className="text-center col-span-full">
              No programmes found. Try adjusting your search or filters.
            </p>
          ) : (
            <>
              {programmes.map((programme) => (
                <ProgrammeCard
                  key={programme.id}
                  {...programme}
                  userId={userId}
                />
              ))}
              <div className="col-span-full mt-6">
                <Pagination
                  totalItems={total}
                  pageSize={pageSize}
                  currentPage={page}
                  baseUrl="/programmes"
                  searchParams={searchParams}
                />
              </div>
            </>
          )}
        </Suspense>
      </div>
    </div>
  );
}
