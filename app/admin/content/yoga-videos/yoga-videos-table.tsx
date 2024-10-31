"use client";

import React from "react";
import Link from "next/link";
import { YogaVideo } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteYogaVideo } from "@/app/admin/actions/yoga-videos";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";

interface YogaVideoTableProps {
  yogaVideos: (YogaVideo & { watchCount: number })[];
}

export function YogaVideoTable({ yogaVideos }: YogaVideoTableProps) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this yoga video?")) {
      try {
        await deleteYogaVideo(id);
        toast({ title: "Yoga video deleted successfully" });
        router.refresh();
      } catch (error) {
        console.error(error);
        toast({ title: "Error deleting yoga video", variant: "destructive" });
      }
    }
  };

  const type = searchParams.get("type");
  const props = searchParams.get("props");
  const duration = searchParams.get("duration");

  return (
    <div>
      {(type || props || duration) && (
        <div className="mb-4 text-sm text-muted-foreground">
          Filtered by: {type && <span className="mr-2">Type: {type}</span>}
          {props && <span className="mr-2">Props: {props}</span>}
          {duration && <span>Duration: {duration}</span>}
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Props</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {yogaVideos.map((video) => (
            <TableRow key={video.id}>
              <TableCell>{video.title}</TableCell>
              <TableCell>{video.type}</TableCell>
              <TableCell>{Math.floor(video.duration / 60)} minutes</TableCell>
              <TableCell>{video.props.join(", ")}</TableCell>
              <TableCell>{video.watchCount}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/admin/content/yoga-videos/${video.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(video.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
