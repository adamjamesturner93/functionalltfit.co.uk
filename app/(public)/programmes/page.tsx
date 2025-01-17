import { Suspense } from 'react';
import { Search } from 'lucide-react';
import { Metadata } from 'next';

import { getProgrammes } from '@/app/actions/programmes';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { getCurrentUserId } from '@/lib/auth-utils';

import { ProgrammeCard } from './programme-card';
import { ProgrammeFilters } from './programme-filters';

export const metadata: Metadata = {
  title: 'Fitness Programmes | Functionally Fit',
  description:
    'Explore our range of fitness programmes designed to help you achieve your health and fitness goals.',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProgrammesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = 9;
  const search = typeof params.search === 'string' ? params.search : '';
  const userId = await getCurrentUserId();

  const filters = {
    intention: typeof params.intention === 'string' ? params.intention : undefined,
    length: typeof params.length === 'string' ? params.length : undefined,
    minSessions: typeof params.minSessions === 'string' ? parseInt(params.minSessions) : undefined,
    maxSessions: typeof params.maxSessions === 'string' ? parseInt(params.maxSessions) : undefined,
    saved: params.saved === 'true',
  };

  const { programmes, total } = await getProgrammes(page, pageSize, search, filters, userId!);

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fitness Programmes</h1>
          <p className="text-muted-foreground">
            Choose from our collection of pre-built programmes
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <form className="relative">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
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
              <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200"></div>
            ))}
        >
          {programmes.length === 0 ? (
            <p className="col-span-full text-center">
              No programmes found. Try adjusting your search or filters.
            </p>
          ) : (
            <>
              {programmes.map((programme) => (
                <ProgrammeCard key={programme.id} {...programme} userId={userId} />
              ))}
              <div className="col-span-full mt-6">
                <Pagination
                  totalItems={total}
                  pageSize={pageSize}
                  currentPage={page}
                  baseUrl="/programmes"
                  searchParams={await searchParams}
                />
              </div>
            </>
          )}
        </Suspense>
      </div>
    </div>
  );
}
