"use client";

import { useState, useEffect } from "react";
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
import {
  createYogaVideo,
  updateYogaVideo,
  YogaVideoInput,
  fetchViewStats,
} from "@/app/actions/yoga-videos";
import { ImageUpload } from "@/components/image-upload";
import { VideoUpload } from "@/components/video-upload";
import { del } from "@vercel/blob";
import { Label } from "@/components/ui/label";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
  muxPlaybackId: z.string().min(1, "Video is required"),
  muxAssetId: z.string().min(1, "Video asset ID is required"),
});

type FormData = z.infer<typeof formSchema>;

type ViewStats = {
  date: string;
  views: number;
};

interface YogaVideoFormClientProps {
  initialYogaVideo: YogaVideoInput | null;
  id: string;
}

export default function YogaVideoFormClient({
  initialYogaVideo,
  id,
}: YogaVideoFormClientProps) {
  const router = useRouter();
  const isNewYogaVideo = id === "new";
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [viewStats, setViewStats] = useState<ViewStats[]>([]);
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "6months">(
    "week"
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    reValidateMode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: initialYogaVideo || {
      title: "",
      description: "",
      type: "MINDFULNESS",
      props: [],
      duration: 0,
      thumbnailUrl: "",
      muxPlaybackId: "",
      muxAssetId: "",
    },
  });

  useEffect(() => {
    if (!isNewYogaVideo) {
      const loadViewStats = async () => {
        try {
          const stats = await fetchViewStats(id, timeFrame);
          setViewStats(stats);
        } catch (error) {
          console.error("Error fetching view stats:", error);
        }
      };
      loadViewStats();
    }
  }, [id, timeFrame, isNewYogaVideo]);

  const onSubmit = async (data: FormData) => {
    try {
      if (initialYogaVideo) {
        if (data.thumbnailUrl !== initialYogaVideo.thumbnailUrl) {
          await del(initialYogaVideo.thumbnailUrl);
        }
      }

      if (isNewYogaVideo) {
        await createYogaVideo(data as YogaVideoInput);
      } else {
        await updateYogaVideo(id, data as YogaVideoInput);
      }
      router.push("/admin/content/yoga-videos");
    } catch (error) {
      console.error("Error submitting yoga video:", error);
      setSubmitError("Failed to submit yoga video. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          {isNewYogaVideo ? "Create New Yoga Video" : "Edit Yoga Video"}
        </h1>

        {submitError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Video Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => <Input id="title" {...field} />}
                    />
                    {errors.title && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          id="description"
                          className="min-h-[120px]"
                          {...field}
                        />
                      )}
                    />
                    {errors.description && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select video type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MINDFULNESS">
                              Mindfulness
                            </SelectItem>
                            <SelectItem value="BUILD">Build</SelectItem>
                            <SelectItem value="EXPLORE">Explore</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.type && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.type.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="props">Props</Label>
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
                      <p className="text-destructive text-sm mt-1">
                        {errors.props.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="thumbnail">Thumbnail</Label>
                    <Controller
                      name="thumbnailUrl"
                      control={control}
                      render={({ field }) => (
                        <ImageUpload
                          onImageUpload={(url) => {
                            field.onChange(url);
                            setValue("thumbnailUrl", url);
                          }}
                          initialImage={field.value}
                        />
                      )}
                    />
                    {errors.thumbnailUrl && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.thumbnailUrl.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="video">Video</Label>
                    <Controller
                      name="muxPlaybackId"
                      control={control}
                      render={({ field }) => (
                        <VideoUpload
                          onVideoUpload={(
                            muxPlaybackId,
                            muxAssetId,
                            duration
                          ) => {
                            field.onChange(muxPlaybackId);
                            setValue("muxPlaybackId", muxPlaybackId);
                            setValue("muxAssetId", muxAssetId);
                            setValue("duration", +duration);
                          }}
                          initialVideo={field.value}
                        />
                      )}
                    />
                    {errors.muxPlaybackId && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.muxPlaybackId.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              {isNewYogaVideo ? "Create Yoga Video" : "Update Yoga Video"}
            </Button>
          </div>
        </form>

        {!isNewYogaVideo && (
          <Card className="mt-8">
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
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={viewStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
