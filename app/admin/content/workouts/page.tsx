'use client';

import { useEffect, useMemo, useState } from 'react';
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

import { getWorkouts, WorkoutFilters, WorkoutWithCount } from '@/app/actions/workouts';
import { deleteWorkout } from '@/app/actions/workouts';
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

const fuzzyFilter: FilterFn<WorkoutWithCount> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const equipmentOptions = [
  'Dumbbells',
  'Barbell',
  'Kettlebell',
  'Resistance Bands',
  'Pull-up Bar',
  'Jump Rope',
];

const primaryMuscles = [
  'Full Body',
  'Upper Body',
  'Lower Body',
  'Core',
  'Chest',
  'Back',
  'Arms',
  'Shoulders',
  'Legs',
  'Glutes',
];

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<WorkoutWithCount[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filters, setFilters] = useState<WorkoutFilters>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const { workouts } = await getWorkouts(1, 1000, globalFilter, filters);

      console.log(JSON.stringify(workouts, null, 4));
      setWorkouts(workouts);
    };
    fetchWorkouts();
  }, [globalFilter, filters]);

  const columns = useMemo<ColumnDef<WorkoutWithCount>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Name
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
      },
      {
        accessorKey: 'totalLength',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Total Length
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          );
        },
        cell: ({ row }) => `${Math.floor(row.original.totalLength / 60)} minutes`,
      },
      {
        accessorKey: 'equipment',
        header: 'Equipment',
        cell: ({ row }) =>
          row.original.equipment.length === 0 ? 'Bodyweight' : row.original.equipment.join(', '),
      },
      {
        accessorKey: 'primaryMuscles',
        header: 'Muscle Groups',
        cell: ({ row }) => row.original.primaryMuscles.join(', '),
      },
      {
        accessorKey: '_count.WorkoutActivity',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Times Completed
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const workout = row.original;

          const handleDelete = async () => {
            try {
              await deleteWorkout(workout.id);
              toast({ title: 'Workout deleted successfully' });
              router.refresh();
            } catch (error) {
              console.error(error);
              toast({
                title: 'Error deleting workout',
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
                  onClick={() => router.push(`/admin/content/workouts/${workout.id}`)}
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
    data: workouts,
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

  const updateFilter = (key: keyof WorkoutFilters, value: string) => {
    setFilters((prev) => {
      if (value && value !== 'ALL') {
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
          <div className="border-b border-card bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Workouts</h1>
              <Link href="/admin/content/workouts/new">
                <Button>Create New Workout</Button>
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
                onValueChange={(value) => updateFilter('equipment', value)}
                defaultValue={searchParams.get('equipment') || 'ALL'}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Equipment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Equipment</SelectItem>
                  {equipmentOptions.map((equipment) => (
                    <SelectItem key={equipment} value={equipment}>
                      {equipment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => updateFilter('muscleGroup', value)}
                defaultValue={searchParams.get('muscleGroup') || 'ALL'}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Muscle Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Muscle Groups</SelectItem>
                  {primaryMuscles.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Min Duration (minutes)"
                className="w-[180px]"
                value={filters.minDuration || ''}
                onChange={(e) => updateFilter('minDuration', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max Duration (minutes)"
                className="w-[180px]"
                value={filters.maxDuration || ''}
                onChange={(e) => updateFilter('maxDuration', e.target.value)}
              />
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
