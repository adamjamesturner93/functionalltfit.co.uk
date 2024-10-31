import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExercises } from "@/app/admin/actions/exercises";

type Exercise = {
  id: string;
  variation: string;
  reps: { number: number; weight: number }[];
  tempo: number[];
};

type Block = {
  type: "MULTISET" | "SUPERSET" | "TRISET";
  exercises: Exercise[];
  rest: number;
  gap?: number;
};

type WorkoutBlockFormProps = {
  block: Block;
  onUpdate: (block: Block) => void;
  onRemove: () => void;
};

export function WorkoutBlockForm({
  block,
  onUpdate,
  onRemove,
}: WorkoutBlockFormProps) {
  const [blockData, setBlockData] = useState<Block>(block);
  const [exercises, setExercises] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    // Fetch exercises from API
    const fetchExercises = async () => {
      const data = await getExercises();
      setExercises(data.exercises);
    };
    fetchExercises();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBlockData({ ...blockData, [name]: value });
  };

  const handleExerciseChange = (
    index: number,
    field: keyof Exercise,
    value: any
  ) => {
    const newExercises = [...blockData.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setBlockData({ ...blockData, exercises: newExercises });
  };

  const addExercise = () => {
    setBlockData({
      ...blockData,
      exercises: [
        ...blockData.exercises,
        { id: "", variation: "", reps: [], tempo: [2, 1, 2, 1] },
      ],
    });
  };

  const removeExercise = (index: number) => {
    const newExercises = blockData.exercises.filter((_, i) => i !== index);
    setBlockData({ ...blockData, exercises: newExercises });
  };

  useEffect(() => {
    onUpdate(blockData);
  }, [blockData, onUpdate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Block</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select name="type" value={blockData.type} onChange={handleChange}>
            <option value="MULTISET">Multiset</option>
            <option value="SUPERSET">Superset</option>
            <option value="TRISET">Triset</option>
          </Select>
          <Input
            type="number"
            name="rest"
            value={blockData.rest}
            onChange={handleChange}
            placeholder="Rest Time (seconds)"
          />
          {blockData.type !== "MULTISET" && (
            <Input
              type="number"
              name="gap"
              value={blockData.gap}
              onChange={handleChange}
              placeholder="Gap Time (seconds)"
            />
          )}
          <div className="space-y-4">
            {blockData.exercises.map((exercise, index) => (
              <div key={index} className="border p-4 rounded">
                <Select
                  value={exercise.id}
                  onChange={(e) =>
                    handleExerciseChange(index, "id", e.target.value)
                  }
                >
                  <option value="">Select Exercise</option>
                  {exercises.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </Select>
                <Input
                  value={exercise.variation}
                  onChange={(e) =>
                    handleExerciseChange(index, "variation", e.target.value)
                  }
                  placeholder="Variation"
                />
                <Input
                  value={exercise.reps
                    .map((r) => `${r.number}x${r.weight}`)
                    .join(", ")}
                  onChange={(e) => {
                    const reps = e.target.value.split(",").map((r) => {
                      const [number, weight] = r.trim().split("x");
                      return {
                        number: parseInt(number),
                        weight: parseFloat(weight),
                      };
                    });
                    handleExerciseChange(index, "reps", reps);
                  }}
                  placeholder="Reps (e.g. 10x40, 8x45, 6x50)"
                />
                <Input
                  value={exercise.tempo.join(",")}
                  onChange={(e) =>
                    handleExerciseChange(
                      index,
                      "tempo",
                      e.target.value.split(",").map(Number)
                    )
                  }
                  placeholder="Tempo (e.g. 2,1,2,1)"
                />
                <Button onClick={() => removeExercise(index)}>
                  Remove Exercise
                </Button>
              </div>
            ))}
            <Button onClick={addExercise}>Add Exercise</Button>
          </div>
        </div>
        <Button onClick={onRemove}>Remove Block</Button>
      </CardContent>
    </Card>
  );
}
