import React from "react";
import Link from "next/link";
import {
  getYogaVideos,
  YogaVideoFilters,
  YogaVideoSortOption,
} from "@/app/admin/actions/yoga-videos";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { YogaVideoSearch } from "./yoga-video-search";
import { YogaVideoTable } from "./yoga-videos-table";
import { YogaVideoFilters as YogaVideoFiltersComponent } from "./yoga-video-filters";
import { YogaType } from "@prisma/client";

export default async function YogaVideosPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    type?: YogaType;
    props?: string;
    duration?: YogaVideoFilters["duration"];
    sort?: YogaVideoSortOption;
  };
}) {
  const {
    page: pageNumber,
    search: searchParam,
    type: typeParam,
    props: propsParam,
    duration: durationParam,
    sort: sortParam,
  } = await searchParams;
  const page = Math.max(1, Number(pageNumber) || 1);
  const pageSize = 10;
  const search = searchParam || "";
  const filters: YogaVideoFilters = {
    type: typeParam,
    props: propsParam ? propsParam.split(",") : undefined,
    duration: durationParam,
  };
  const sort = sortParam || "newest";

  const { yogaVideos, total } = await getYogaVideos(
    page,
    pageSize,
    search,
    filters,
    sort
  );

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Yoga Videos</h1>
        <Link href="/admin/content/yoga-videos/new">
          <Button>Create New Yoga Video</Button>
        </Link>
      </div>
      <Card>
        <CardContent className="mt-6">
          <div className="space-y-4">
            <YogaVideoSearch />
            <YogaVideoFiltersComponent />
          </div>
          <div className="mt-6">
            <YogaVideoTable yogaVideos={yogaVideos} />
          </div>
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalItems={total}
              pageSize={pageSize}
              baseUrl="/admin/content/yoga-videos"
              searchParams={{
                search: search || undefined,
                type: filters.type,
                props: filters.props?.join(","),
                duration: filters.duration,
                sort,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
