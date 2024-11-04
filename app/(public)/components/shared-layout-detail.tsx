import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Dumbbell,
  Star,
  Share2,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface SharedDetailLayoutProps {
  title: string;
  description: string;
  duration: number;
  date?: string;
  type?: string;
  equipment: string[];
  backLink: {
    href: string;
    label: string;
  };
  actionButton: {
    label: string;
    onClick: () => void;
  };
  children: React.ReactNode;
  onBookmark: () => void;
  onShare: () => void;
  // rating: number;
  // reviewCount: number;
}

export function SharedDetailLayout({
  title,
  description,
  duration,
  date,
  type,
  equipment,
  backLink,
  actionButton,
  children,
  onBookmark,
  onShare,
}: // rating,
// reviewCount,
SharedDetailLayoutProps) {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <Link
        href={backLink.href}
        className="inline-flex items-center text-sm mb-6 hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {backLink.label}
      </Link>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-2">
            {type && (
              <Badge variant="outline" className="capitalize">
                {type.toLowerCase()}
              </Badge>
            )}
            {equipment.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-3xl font-bold">{title}</CardTitle>
          <CardDescription className="text-lg">{description}</CardDescription>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" aria-hidden="true" />
              {duration} minutes
            </div>
            {date && (
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                {date}
              </div>
            )}
            <div className="flex items-center">
              <Dumbbell className="mr-2 h-4 w-4" aria-hidden="true" />
              {type}
            </div>
            <div className="flex items-center">
              <Star className="mr-2 h-4 w-4" aria-hidden="true" />
              {/* {rating.toFixed(1)} ({reviewCount} reviews) */}
            </div>
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={onBookmark}
              className="mr-2"
            >
              <Bookmark className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          <Button onClick={actionButton.onClick}>{actionButton.label}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
