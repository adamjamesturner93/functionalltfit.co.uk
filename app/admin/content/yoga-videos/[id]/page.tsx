"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import {
  updateYogaVideo,
  getYogaVideoById,
  YogaVideoInput,
  fetchViewStats,
} from "@/app/admin/actions/yoga-videos";
import { ImageUpload } from "@/components/image-upload";
import { VideoUpload } from "@/components/video-upload";
import { del } from "@vercel/blob";
import { deleteMuxAsset } from "@/lib/mux";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

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

type ViewStats = {
  date: string;
  views: number;
};

type Params = {
  id: string;
};
export default function YogaVideoDetailPage() {
  const { id } = useParams<Params>();

  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [yogaVideo, setYogaVideo] = useState<YogaVideoInput | null>(null);
  const [viewStats, setViewStats] = useState<ViewStats[]>([]);
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "6months">(
    "week"
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
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

  useEffect(() => {
    const fetchYogaVideo = async () => {
      try {
        const video = await getYogaVideoById(id);
        if (video) {
          setYogaVideo(video);
          setValue("title", video.title);
          setValue("description", video.description);
          setValue("type", video.type);
          setValue("props", video.props);
          setValue("duration", video.duration);
          setValue("thumbnailUrl", video.thumbnailUrl);
          setValue("url", video.url);
        }
      } catch (error) {
        console.error("Error fetching yoga video:", error);
        setSubmitError("Failed to fetch yoga video");
      }
    };
    fetchYogaVideo();
  }, [id, setValue]);

  useEffect(() => {
    const loadViewStats = async () => {
      try {
        const stats = await fetchViewStats(id, timeFrame);
        setViewStats(stats);
      } catch (error) {
        console.error("Error fetching view stats:", error);
      }
    };

    loadViewStats();
  }, [id, timeFrame]);

  const onSubmit = async (data: FormData) => {
    try {
      if (yogaVideo) {
        // Delete old thumbnail if it's changed
        if (data.thumbnailUrl !== yogaVideo.thumbnailUrl) {
          await del(yogaVideo.thumbnailUrl);
        }

        // Delete old video if it's changed
        if (data.url !== yogaVideo.url) {
          await deleteMuxAsset(yogaVideo.url);
        }
      }

      await updateYogaVideo(id, data as YogaVideoInput);
      router.push("/admin/content/yoga-videos");
    } catch (error) {
      console.error("Error updating yoga video:", error);
      setSubmitError("Failed to update yoga video. Please try again.");
    }
  };

  if (!yogaVideo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Yoga Video Details</h1>

      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Edit Video Details</CardTitle>
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
                defaultValue={[]}
                render={({ field }) => (
                  <MultiSelect
                    options={yogaProps}
                    selected={field.value || []}
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
            <Button type="submit">Update Yoga Video</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>View Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select
              value={timeFrame}
              onValueChange={(value: "week" | "month" | "6months") =>
                setTimeFrame(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-[300px]">
            <LineChart data={viewStats} height={300} width={1100}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#8884d8" />
            </LineChart>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
