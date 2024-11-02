import { Suspense } from "react";
import { getProgrammes } from "@/app/actions/programmes";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitness Programmes | FunctionallyFit",
  description:
    "Explore our range of fitness programmes designed to help you achieve your health and fitness goals.",
  openGraph: {
    title: "Fitness Programmes | FunctionallyFit",
    description:
      "Explore our range of fitness programmes designed to help you achieve your health and fitness goals.",
    type: "website",
    url: "https://functionallyfit.com/programmes",
  },
};

export default async function ProgrammesPage({
  searchParams,
}: {
  searchParams: { search?: string; filter?: string };
}) {
  const { search: searchParam, filter: filterParam } = await searchParams;
  const search = searchParam || "";
  const filter = filterParam || "all";

  const programmes = await getProgrammes(search, filter);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Fitness Programmes</h1>
      <div className="flex gap-4 mb-6">
        <form className="flex gap-4 w-full">
          <Input
            name="search"
            placeholder="Search programmes..."
            defaultValue={search}
            className="max-w-sm"
          />
          <Select name="filter" defaultValue={filter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by intention" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All intentions</SelectItem>
              <SelectItem value="strength">Strength</SelectItem>
              <SelectItem value="cardio">Cardio</SelectItem>
              <SelectItem value="flexibility">Flexibility</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">Apply Filters</Button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense fallback={<div>Loading programmes...</div>}>
          {programmes.map((programme) => (
            <Card key={programme.id}>
              <CardHeader>
                <Image
                  src={programme.thumbnail}
                  alt={programme.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="mb-2">{programme.title}</CardTitle>
                <p className="text-muted-foreground mb-2">
                  {programme.intention}
                </p>
                <p className="text-sm text-muted-foreground">
                  {programme.sessionsPerWeek} sessions per week
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/programmes/${programme.id}`}>
                    View Programme
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </Suspense>
      </div>
    </div>
  );
}
