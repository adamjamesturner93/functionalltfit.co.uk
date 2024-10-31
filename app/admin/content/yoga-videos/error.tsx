"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="mx-auto max-w-md mt-8">
      <CardHeader>
        <CardTitle>Error Loading Yoga Videos</CardTitle>
        <CardDescription>
          We couldn't load the yoga videos. Please try again.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Error: {error.message}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => reset()}>Try again</Button>
      </CardFooter>
    </Card>
  );
}
