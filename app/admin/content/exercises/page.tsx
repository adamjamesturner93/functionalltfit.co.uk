'use client';

import { useEffect, useMemo, useState } from 'react';
import { Exercise, ExerciseMode, ExerciseType } from '@prisma/client';
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

import { ExerciseFilters, getExercises } from '@/app/actions/exercises';
import { deleteExercise } from '@/app/actions/exercises';
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

const fuzzyFilter: FilterFn<Exercise> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const muscleGroups = [
  'Biceps',
  'Triceps',
  'Deltoids',
  'Pectorals',
  'Trapezius',
  'Latissimus Dorsi',
  'Rhomboids',
  'Erector Spinae',
  'Rectus Abdominis',
  'Obliques',
  'Quadriceps',
  'Hamstrings',
  'Calves',
  'Gluteus Maximus',
];

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filters, setFilters] = useState<ExerciseFilters>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const fetchExercises = async () => {
      const { exercises } = await getExercises(1, 1000, globalFilter, filters);
      setExercises(exercises);
    };
    fetchExercises();
  }, [globalFilter, filters]);

  const columns = useMemo<ColumnDef<Exercise>[]>(
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
        accessorKey: 'mode',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Mode
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: 'muscleGroups',
        header: 'Muscle Groups',
        cell: ({ row }) => row.original.muscleGroups.join(', '),
      },
      {
        accessorKey: 'equipment',
        header: 'Equipment',
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const exercise = row.original;

          const handleDelete = async () => {
            try {
              await deleteExercise(exercise.id);
              toast({ title: 'Exercise deleted successfully' });
              router.refresh();
            } catch (error) {
              console.error(error);
              toast({
                title: 'Error deleting exercise',
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
                  onClick={() => router.push(`/admin/content/exercises/${exercise.id}`)}
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
    data: exercises,
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

  const updateFilter = (key: keyof ExerciseFilters, value: string) => {
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
      <div className="container mx-auto py-10">
        <div className="overflow-hidden rounded-lg bg-surface-grey shadow-md">
          <div className="border-b border-gray-200 bg-surface-light-grey p-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Exercises</h1>
              <Link href="/admin/content/exercises/new">
                <Button>Create New Exercise</Button>
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
                  {Object.values(ExerciseType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => updateFilter('mode', value)}
                defaultValue={searchParams.get('mode') || 'ALL'}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Modes</SelectItem>
                  {Object.values(ExerciseMode).map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
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
                  {muscleGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
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
