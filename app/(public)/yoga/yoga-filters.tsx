"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { getYogaFilterOptions } from "@/app/actions/yoga-videos";
import { YogaType } from "@prisma/client";

type FilterOptions = {
  types: YogaType[];
  props: string[];
};

export function YogaFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [minDuration, setMinDuration] = useState(
    searchParams.get("minDuration") || ""
  );
  const [maxDuration, setMaxDuration] = useState(
    searchParams.get("maxDuration") || ""
  );
  const [type, setType] = useState<YogaType | "all">(
    (searchParams.get("type") as YogaType) || "all"
  );
  const [props, setProps] = useState(searchParams.get("props") || "all");
  const [savedOnly, setSavedOnly] = useState(
    searchParams.get("saved") === "true"
  );

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    types: [],
    props: [],
  });

  useEffect(() => {
    const fetchFilterOptions = async () => {
      const options = await getYogaFilterOptions();
      setFilterOptions(options);
    };
    fetchFilterOptions();
  }, []);

  const applyFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (minDuration) params.set("minDuration", minDuration);
      else params.delete("minDuration");
      if (maxDuration) params.set("maxDuration", maxDuration);
      else params.delete("maxDuration");
      if (type && type !== "all") params.set("type", type);
      else params.delete("type");
      if (props && props !== "all") params.set("props", props);
      else params.delete("props");
      if (savedOnly) params.set("saved", "true");
      else params.delete("saved");

      router.push(`/yoga?${params.toString()}`);
    });
  };

  const resetFilters = () => {
    setMinDuration("");
    setMaxDuration("");
    setType("all");
    setProps("all");
    setSavedOnly(false);
    startTransition(() => {
      router.push("/yoga");
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Yoga Videos</SheetTitle>
          <SheetDescription>
            Find the perfect practice for your needs
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Duration</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1.5">
                <label htmlFor="min-duration" className="text-sm">
                  Min (minutes)
                </label>
                <Input
                  id="min-duration"
                  type="number"
                  placeholder="0"
                  min={0}
                  value={minDuration}
                  onChange={(e) => setMinDuration(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="max-duration" className="text-sm">
                  Max (minutes)
                </label>
                <Input
                  id="max-duration"
                  type="number"
                  placeholder="90"
                  min={0}
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Type</h3>
            <Select
              value={type}
              onValueChange={(value: string) =>
                setType(value as YogaType | "all")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Type</SelectItem>
                {filterOptions.types.map((yogaType) => (
                  <SelectItem key={yogaType} value={yogaType}>
                    {yogaType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Props Required</h3>
            <Select value={props} onValueChange={setProps}>
              <SelectTrigger>
                <SelectValue placeholder="Select props" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Props</SelectItem>
                {filterOptions.props.map((prop) => (
                  <SelectItem key={prop} value={prop}>
                    {prop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="saved-only"
              checked={savedOnly}
              onCheckedChange={(checked) => setSavedOnly(checked as boolean)}
            />
            <label
              htmlFor="saved-only"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show only saved videos
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={resetFilters} disabled={isPending}>
            Reset
          </Button>
          <Button onClick={applyFilters} disabled={isPending}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
