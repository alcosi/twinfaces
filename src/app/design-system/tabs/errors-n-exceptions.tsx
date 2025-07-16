"use client";

import Link from "next/link";

import { clientCookies } from "@/shared/libs";
import { Button, Separator } from "@/shared/ui";

export function ErrorsAndExceptionsTab() {
  const simulate500 = () => {
    throw new Error("Simulated 500 error");
  };

  const simulateAuthCorruption = () => {
    clientCookies.set("authToken", "INVALID_TOKEN");
  };

  return (
    <div className="flex flex-col items-start space-y-4 py-6">
      <h3 className="font-bold">Client-side errors:</h3>

      <Link href={`/non-existent-path-${Date.now()}`} passHref>
        <Button variant="outline">Simulate 404</Button>
      </Link>

      <Button variant="destructive" onClick={simulate500}>
        Simulate 500
      </Button>

      <Button variant="outline" onClick={simulateAuthCorruption}>
        Simulate auth-token corruption
      </Button>

      <Separator />

      <h3 className="font-bold">Server-side errors:</h3>

      {/* TODO1: create button which runs server function on next.js and throw notFound exception */}

      {/* TODO2: create button which runs server function on next.js and throw some 500 eroro */}
    </div>
  );
}
