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
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

import { getProgrammes } from '@/app/actions/programmes';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Define the Programme type based on the returned data structure
interface Programme {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  thumbnail: string;
  sessionsPerWeek: number;
  intention: string;
  weeks: number;
  isSaved: boolean;
}

const fuzzyFilter: FilterFn<Programme> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    const fetchProgrammes = async () => {
      const { programmes } = await getProgrammes();
      setProgrammes(programmes);
    };
    fetchProgrammes();
  }, []);

  const columns = useMemo<ColumnDef<Programme>[]>(
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
        accessorKey: 'intention',
        header: 'Intention',
        filterFn: 'equals',
      },
      {
        accessorKey: 'sessionsPerWeek',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Sessions/Week
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: 'weeks',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Duration (Weeks)
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Created At
              <ArrowUpDown className="ml-2 size-4" />
            </Button>
          );
        },
        cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString(),
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated At',
        cell: ({ row }) => new Date(row.getValue('updatedAt')).toLocaleDateString(),
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const programme = row.original;

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
                <DropdownMenuItem>
                  <Link href={`/admin/content/programmes/${programme.id}`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={`/programmes/${programme.id}`}>View</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: programmes,
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

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto py-10">
        <div className="overflow-hidden rounded-lg bg-surface-grey shadow-md">
          <div className="border-b border-card bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Programmes</h1>
              <Link href="/admin/content/programmes/new">
                <Button>Create New Programme</Button>
              </Link>
            </div>
            <div className="mb-4 flex space-x-4">
              <Input
                placeholder="Search all columns..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-sm"
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
