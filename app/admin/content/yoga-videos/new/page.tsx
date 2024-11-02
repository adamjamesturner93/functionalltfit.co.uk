"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createYogaVideo, YogaVideoInput } from "@/app/actions/yoga-videos";
import { ImageUpload } from "@/components/image-upload";
import { VideoUpload } from "@/components/video-upload";

const yogaProps = [
  { value: "mat", label: "Yoga Mat" },
  { value: "block", label: "Yoga Block" },
  { value: "strap", label: "Yoga Strap" },
  { value: "bolster", label: "Bolster" },
  { value: "blanket", label: "Blanket" },
  { value: "chair", label: "Chair" },
];

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["MINDFULNESS", "BUILD", "EXPLORE"]),
  props: z.array(z.string()).min(1, "At least one prop is required"),
  duration: z.number().min(1, "Duration must be at least 1 second"),
  thumbnailUrl: z.string().min(1, "Thumbnail is required"),
  url: z.string().min(1, "Video is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function NewYogaVideoPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "MINDFULNESS",
      props: [],
      duration: 0,
      thumbnailUrl: "",
      url: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createYogaVideo(data as YogaVideoInput);
      router.push("/admin/content/yoga-videos");
    } catch (error) {
      console.error("Error creating yoga video:", error);
      setSubmitError("Failed to create yoga video. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Yoga Video</h1>

      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea id="description" {...register("description")} />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type
              </label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select video type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MINDFULNESS">Mindfulness</SelectItem>
                      <SelectItem value="BUILD">Build</SelectItem>
                      <SelectItem value="EXPLORE">Explore</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="props" className="text-sm font-medium">
                Props
              </label>
              <Controller
                name="props"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={yogaProps}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select props"
                  />
                )}
              />
              {errors.props && (
                <p className="text-red-500 text-sm">{errors.props.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium">
                Duration (in seconds)
              </label>
              <Input
                id="duration"
                type="number"
                {...register("duration", { valueAsNumber: true })}
              />
              {errors.duration && (
                <p className="text-red-500 text-sm">
                  {errors.duration.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Thumbnail</label>
              <Controller
                name="thumbnailUrl"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    onImageUpload={(url) => field.onChange(url)}
                    initialImage={field.value}
                  />
                )}
              />
              {errors.thumbnailUrl && (
                <p className="text-red-500 text-sm">
                  {errors.thumbnailUrl.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Video</label>
              <Controller
                name="url"
                control={control}
                render={({ field }) => (
                  <VideoUpload
                    onVideoUpload={(url) => field.onChange(url)}
                    initialVideo={field.value}
                  />
                )}
              />
              {errors.url && (
                <p className="text-red-500 text-sm">{errors.url.message}</p>
              )}
            </div>
            <Button type="submit">Create Yoga Video</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
