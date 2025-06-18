"use client";

import Link from "next/link";

import { clientCookies } from "@/shared/libs";
import { Button } from "@/shared/ui";

export function ErrorsAndExceptionsTab() {
  const simulate500 = () => {
    throw new Error("Simulated 500 error");
  };

  const simulateAuthCorruption = () => {
    clientCookies.set("authToken", "INVALID_TOKEN");
  };

  return (
    <div className="flex flex-col items-start space-y-4 py-6">
      <p>Click a button to simulate an error:</p>

      <Link href={`/non-existent-path-${Date.now()}`} passHref>
        <Button variant="outline">Simulate 404</Button>
      </Link>

      <Button variant="destructive" onClick={simulate500}>
        Simulate 500
      </Button>

      <Button variant="outline" onClick={simulateAuthCorruption}>
        Simulate auth-token corruption
      </Button>
    </div>
  );
}
