"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { UNICODE_SYMBOLS } from "@/shared/libs";
import { Button, Separator } from "@/shared/ui";

type Props = {
  error: unknown;
  reset?: () => void;
};

export function Error500({ error, reset }: Props) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error500", error);
  }, [error]);

  function handleRetry() {
    // Attempt to recover by re-rendering this segment
    reset?.() ?? router.refresh();
  }

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
          {/* TODO: FIX: clicking on this button does not trigger `logout()` function */}
          <Link href="/" className="">
            <Button>Go back home</Button>
          </Link>

          <Button variant="ghost" onClick={handleRetry}>
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
