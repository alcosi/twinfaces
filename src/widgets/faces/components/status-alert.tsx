import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react";
import { ReactNode } from "react";

import { cn, isUndefined } from "@/shared/libs";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui";

const variantIcons = {
  default: <AlertCircle className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  warn: <AlertTriangle className="h-4 w-4" />,
  error: <XCircle className="h-4 w-4" />,
} as const;

type Props = {
  icon?: ReactNode;
  message?: string;
  title?: string;
  variant?: keyof typeof variantIcons;
  className?: string | string[];
};

export function StatusAlert({
  icon,
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again later.",
  variant = "default",
  className,
}: Props) {
  const Icon = isUndefined(icon) ? variantIcons[variant] : icon;

  return (
    <Alert
      variant={variant}
      className={cn(
        "grid grid-cols-[1rem_1fr] grid-rows-2 gap-x-2.5",
        className
      )}
    >
      <div className="row-span-2 self-center">{Icon}</div>
      <AlertTitle className="col-start-2">{title}</AlertTitle>
      <AlertDescription className="col-start-2">{message}</AlertDescription>
    </Alert>
  );
}
