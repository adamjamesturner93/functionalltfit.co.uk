'use client';

import { useEffect, useState, useTransition } from 'react';
import { Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { getUniqueBodyFocuses, getUniqueEquipment } from '@/app/actions/workouts';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
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

export function WorkoutFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [bodyFocuses, setBodyFocuses] = useState<string[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<string[]>([]);

  const [minDuration, setMinDuration] = useState(searchParams.get('minDuration') || '');
  const [maxDuration, setMaxDuration] = useState(searchParams.get('maxDuration') || '');
  const [equipment, setEquipment] = useState(searchParams.get('equipment') || 'all');
  const [muscleGroup, setMuscleGroup] = useState(searchParams.get('muscleGroup') || 'all');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'all');
  const [saved, setSaved] = useState(searchParams.get('saved') === 'true');

  useEffect(() => {
    const fetchFilterOptions = async () => {
      const [focuses, equipmentList] = await Promise.all([
        getUniqueBodyFocuses(),
        getUniqueEquipment(),
      ]);
      setBodyFocuses(focuses);
      setEquipmentOptions(equipmentList);
    };
    fetchFilterOptions();
  }, []);

  const applyFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (minDuration) params.set('minDuration', minDuration);
      else params.delete('minDuration');
      if (maxDuration) params.set('maxDuration', maxDuration);
      else params.delete('maxDuration');
      if (equipment && equipment !== 'all') params.set('equipment', equipment);
      else params.delete('equipment');
      if (muscleGroup && muscleGroup !== 'all') params.set('muscleGroup', muscleGroup);
      else params.delete('muscleGroup');
      if (difficulty && difficulty !== 'all') params.set('difficulty', difficulty);
      else params.delete('difficulty');
      if (saved) params.set('saved', 'true');
      else params.delete('saved');

      router.push(`/workouts?${params.toString()}`);
    });
  };

  const resetFilters = () => {
    setMinDuration('');
    setMaxDuration('');
    setEquipment('all');
    setMuscleGroup('all');
    setDifficulty('all');
    setSaved(false);
    startTransition(() => {
      router.push('/workouts');
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
          <SheetTitle>Filter Workouts</SheetTitle>
          <SheetDescription>Customize your workout search with these filters</SheetDescription>
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
                  placeholder="120"
                  min={0}
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Equipment</h3>
            <Select value={equipment} onValueChange={setEquipment}>
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Equipment</SelectItem>
                {equipmentOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Body Focus</h3>
            <Select value={muscleGroup} onValueChange={setMuscleGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select body focus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Body Focus</SelectItem>
                {bodyFocuses.map((focus) => (
                  <SelectItem key={focus} value={focus}>
                    {focus}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Difficulty</h3>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Difficulty</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
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
                Saved Workouts
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
