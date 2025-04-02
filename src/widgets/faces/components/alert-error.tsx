import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/shared/ui";

type Props = {
  message?: string;
  title?: string;
  className?: string;
};

export function AlertError({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again later.",
  className,
}: Props) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
