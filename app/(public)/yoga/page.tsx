import { Suspense } from "react";
import { Metadata } from "next";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getYogaVideos, YogaVideoFilters } from "@/app/actions/yoga-videos";
import { YogaFilters } from "./yoga-filters";
import { YogaCard } from "./yoga-card";
import { YogaCardSkeleton } from "./yoga-card-skeleton";
import { Pagination } from "@/components/ui/pagination";
import { YogaType } from "@prisma/client";
import { getCurrentUserId } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: "Yoga Videos | FunctionallyFit",
  description:
    "Explore our collection of yoga videos for mindfulness, strength building, and flexibility.",
};

export default async function YogaPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    type?: string;
    props?: string;
    minDuration?: string;
    maxDuration?: string;
    saved?: string;
  };
}) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 9;
  const search = searchParams.search || "";
  const filters: YogaVideoFilters = {
    type: searchParams.type as YogaType | undefined,
    props: searchParams.props ? searchParams.props.split(",") : undefined,
    duration: getDurationFilter(
      searchParams.minDuration,
      searchParams.maxDuration
    ),
    savedOnly: searchParams.saved === "true",
  };

  const userId = await getCurrentUserId();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yoga Videos</h1>
          <p className="text-muted-foreground">
            Discover mindful movement practices for every level
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <form action="/yoga" method="GET" className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search videos..."
              className="pl-8"
              defaultValue={search}
              aria-label="Search yoga videos"
            />
          </form>
          <YogaFilters />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense
          fallback={Array(pageSize)
            .fill(null)
            .map((_, i) => (
              <YogaCardSkeleton key={i} />
            ))}
        >
          <YogaVideoList
            page={page}
            pageSize={pageSize}
            search={search}
            filters={filters}
            userId={userId}
          />
        </Suspense>
      </div>
    </div>
  );
}

async function YogaVideoList({
  page,
  pageSize,
  search,
  filters,
  userId,
}: {
  page: number;
  pageSize: number;
  search: string;
  filters: YogaVideoFilters;
  userId: string | null;
}) {
  const { yogaVideos, total } = await getYogaVideos(
    page,
    pageSize,
    search,
    filters,
    "newest",
    userId
  );

  if (yogaVideos.length === 0) {
    return (
      <p className="text-center col-span-full">
        No yoga videos found. Try adjusting your search or filters.
      </p>
    );
  }

  return (
    <>
      {yogaVideos.map((video) => (
        <YogaCard
          key={video.id}
          id={video.id}
          title={video.title}
          description={video.description}
          duration={video.duration}
          thumbnailUrl={video.thumbnailUrl}
          type={video.type}
          props={video.props}
          isSaved={video.isSaved}
          userId={userId}
        />
      ))}
      <div className="col-span-full mt-6">
        <Pagination
          totalItems={total}
          pageSize={pageSize}
          currentPage={page}
          baseUrl="/yoga"
        />
      </div>
    </>
  );
}

function getDurationFilter(
  minDuration?: string,
  maxDuration?: string
): YogaVideoFilters["duration"] {
  if (minDuration && maxDuration) {
    const min = parseInt(minDuration);
    const max = parseInt(maxDuration);
    if (max <= 15) return "less15";
    if (min >= 45) return "45plus";
    if (min >= 30 && max <= 45) return "30to45";
    if (min >= 15 && max <= 30) return "15to30";
  }
  return undefined;
}
