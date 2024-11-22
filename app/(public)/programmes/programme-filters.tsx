'use client';

import { useEffect, useState, useTransition } from 'react';
import { Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { getUniqueIntentions, getUniqueLengths } from '@/app/actions/programmes';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function ProgrammeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [intentions, setIntentions] = useState<string[]>([]);
  const [lengths, setLengths] = useState<string[]>([]);

  const [intention, setIntention] = useState(searchParams.get('intention') || 'all');
  const [length, setLength] = useState(searchParams.get('length') || 'all');
  const [minSessions, setMinSessions] = useState(searchParams.get('minSessions') || '');
  const [maxSessions, setMaxSessions] = useState(searchParams.get('maxSessions') || '');
  const [saved, setSaved] = useState(searchParams.get('saved') === 'true');

  useEffect(() => {
    const fetchFilterOptions = async () => {
      const [intentionList, lengthList] = await Promise.all([
        getUniqueIntentions(),
        getUniqueLengths(),
      ]);
      setIntentions(intentionList);
      setLengths(lengthList);
    };
    fetchFilterOptions();
  }, []);

  const applyFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (intention && intention !== 'all') params.set('intention', intention);
      else params.delete('intention');
      if (length && length !== 'all') params.set('length', length);
      else params.delete('length');
      if (minSessions) params.set('minSessions', minSessions);
      else params.delete('minSessions');
      if (maxSessions) params.set('maxSessions', maxSessions);
      else params.delete('maxSessions');
      if (saved) params.set('saved', 'true');
      else params.delete('saved');

      router.push(`/programmes?${params.toString()}`);
    });
  };

  const resetFilters = () => {
    setIntention('all');
    setLength('all');
    setMinSessions('');
    setMaxSessions('');
    setSaved(false);
    startTransition(() => {
      router.push('/programmes');
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 size-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Programmes</SheetTitle>
          <SheetDescription>Customize your programme search with these filters</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Intention</h3>
            <Select value={intention} onValueChange={setIntention}>
              <SelectTrigger>
                <SelectValue placeholder="Select intention" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All intentions</SelectItem>
                {intentions.map((item) => (
                  <SelectItem key={item} value={item.toLowerCase()}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Programme Length</h3>
            <RadioGroup value={length} onValueChange={setLength}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-length" />
                <Label htmlFor="all-length">All lengths</Label>
              </div>
              {lengths.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <RadioGroupItem value={item} id={`length-${item}`} />
                  <Label htmlFor={`length-${item}`}>{item}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sessions per Week</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1.5">
                <label htmlFor="min-sessions" className="text-sm">
                  Min
                </label>
                <input
                  id="min-sessions"
                  type="number"
                  placeholder="0"
                  min={0}
                  value={minSessions}
                  onChange={(e) => setMinSessions(e.target.value)}
                  className="w-full rounded border p-2"
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="max-sessions" className="text-sm">
                  Max
                </label>
                <input
                  id="max-sessions"
                  type="number"
                  placeholder="7"
                  min={0}
                  value={maxSessions}
                  onChange={(e) => setMaxSessions(e.target.value)}
                  className="w-full rounded border p-2"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Show Only</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="saved"
                checked={saved}
                onCheckedChange={(checked) => setSaved(checked as boolean)}
              />
              <label
                htmlFor="saved"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Saved Programmes
              </label>
            </div>
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
