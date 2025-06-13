"use client";

import Link from "next/link";
import { useEffect } from "react";

import { UNICODE_SYMBOLS } from "@/shared/libs";
import { Button, Separator } from "@/shared/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-10">
        <div className="">
          <h2 className="text-error mt-6 text-6xl font-extrabold">500</h2>
          <p className="text-primary mt-1 text-3xl font-bold">
            Something went wrong!
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Oops! Sorry, we couldn{UNICODE_SYMBOLS.apostrophe}t load the data.
            <br />
            Try refreshing the page or come back a bit later.
          </p>
        </div>

        <div className="space-x-4">
          <Link href="/" className="">
            <Button>Go back home</Button>
          </Link>

          <Button
            variant="ghost"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </Button>
        </div>
      </div>

      <Separator className="mt-4 w-96" />

      <span className="text-muted-foreground mt-4 w-full px-2 text-sm">
        If you think this is a mistake, please contact support
      </span>
    </div>
  );
}
