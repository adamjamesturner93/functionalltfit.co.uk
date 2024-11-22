'use client';

import { useEffect, useMemo, useState } from 'react';
import { YogaType, YogaVideo } from '@prisma/client';
import { rankItem } from '@tanstack/match-sorter-utils';
import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  deleteYogaVideo,
  getYogaVideos,
  YogaVideoFilters,
  YogaVideoSortOption,
} from '@/app/actions/yoga-videos';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const fuzzyFilter: FilterFn<YogaVideo> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const propOptions = ['Mat', 'Blocks', 'Straps', 'Blanket', 'Bolster', 'Chair', 'Wall'];

const durationOptions = [
  { value: 'less15', label: 'Less than 15 minutes' },
  { value: '15to30', label: '15-30 minutes' },
  { value: '30to45', label: '30-45 minutes' },
  { value: '45plus', label: '45+ minutes' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'mostViewed', label: 'Most Viewed' },
  { value: 'leastViewed', label: 'Least Viewed' },
];

export default function YogaVideosPage() {
  const [yogaVideos, setYogaVideos] = useState<YogaVideo[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filters, setFilters] = useState<YogaVideoFilters>({});
  const [sort, setSort] = useState<YogaVideoSortOption>('newest');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const fetchYogaVideos = async () => {
      const { yogaVideos } = await getYogaVideos(1, 1000, globalFilter, filters, sort);
      setYogaVideos(yogaVideos);
    };
    fetchYogaVideos();
  }, [globalFilter, filters, sort]);

  const columns = useMemo<ColumnDef<YogaVideo>[]>(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Title
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: 'type',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Type
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: 'duration',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Duration
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          );
        },
        cell: ({ row }) => `${Math.floor(row.original.duration / 60)} minutes`,
      },
      {
        accessorKey: 'props',
        header: 'Props',
        cell: ({ row }) => row.original.props.join(', '),
      },
      {
        accessorKey: 'watchCount',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Views
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const yogaVideo = row.original;

          const handleDelete = async () => {
            try {
              await deleteYogaVideo(yogaVideo.id);
              toast({ title: 'Yoga video deleted successfully' });
              router.refresh();
            } catch (error) {
              console.error(error);
              toast({
                title: 'Error deleting yoga video',
                variant: 'destructive',
              });
            }
          };

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => router.push(`/admin/content/yoga-videos/${yogaVideo.id}`)}
                >
                  <Pencil className="mr-2 size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [router, toast],
  );

  const table = useReactTable({
    data: yogaVideos,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const updateFilter = (key: keyof YogaVideoFilters, value: string | string[]) => {
    setFilters((prev) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          return { ...prev, [key]: value };
        } else {
          const { [key]: _, ...rest } = prev;
          return rest;
        }
      } else if (value && value !== 'ALL') {
        return { ...prev, [key]: value };
      } else {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  return (
    <div className="min-h-screen bg-surface">
      {' '}
      <div className="container mx-auto py-10">
        <div className="overflow-hidden rounded-lg bg-surface-grey shadow-md">
          <div className="border-b border-gray-200 bg-surface-light-grey p-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Yoga Videos</h1>
              <Link href="/admin/content/yoga-videos/new">
                <Button>Create New Yoga Video</Button>
              </Link>
            </div>
            <div className="mb-4 flex flex-wrap gap-4">
              <Input
                placeholder="Search all columns..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-sm"
              />
              <Select
                onValueChange={(value) => updateFilter('type', value)}
                defaultValue={searchParams.get('type') || 'ALL'}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  {Object.values(YogaType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <MultiSelect
                options={propOptions.map((prop) => ({
                  label: prop,
                  value: prop,
                }))}
                selected={filters.props || []}
                onChange={(value) => updateFilter('props', value)}
                placeholder="Filter by Props"
              />
              <Select
                onValueChange={(value) => updateFilter('duration', value)}
                defaultValue={searchParams.get('duration') || 'ALL'}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Durations</SelectItem>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => setSort(value as YogaVideoSortOption)}
                defaultValue={sort}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
