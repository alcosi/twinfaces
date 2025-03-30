import { Hammer } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/shared/ui";

export function PG002() {
  return (
    <Alert>
      <Hammer className="h-4 w-4" />
      <AlertTitle>Coming soon</AlertTitle>
      <AlertDescription>
        This page is currently under development.
      </AlertDescription>
    </Alert>
  );
}
