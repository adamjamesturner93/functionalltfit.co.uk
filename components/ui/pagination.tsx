import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  baseUrl: string;
  searchParams?: Record<string, string | string[] | undefined>;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  baseUrl,
  searchParams = {},
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const createPageUrl = async (page: number) => {
    const params = new URLSearchParams();

    // Add all existing search params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value !== undefined) {
        params.append(key, value);
      }
    });

    // Add or update the page param
    params.set('page', page.toString());

    return `${baseUrl}?${params.toString()}`;
  };

  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  const PreviousButton = () => (
    <Button variant="outline" size="sm" disabled={isPreviousDisabled}>
      <ChevronLeft className="mr-2 h-4 w-4" />
      Previous
    </Button>
  );

  const NextButton = () => (
    <Button variant="outline" size="sm" disabled={isNextDisabled}>
      Next
      <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="flex items-center justify-center space-x-2">
      {isPreviousDisabled ? (
        <PreviousButton />
      ) : (
        <Link href={createPageUrl(Math.max(1, currentPage - 1))}>
          <PreviousButton />
        </Link>
      )}
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      {isNextDisabled ? (
        <NextButton />
      ) : (
        <Link href={createPageUrl(Math.min(totalPages, currentPage + 1))}>
          <NextButton />
        </Link>
      )}
    </div>
  );
}
