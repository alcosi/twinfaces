import Image from "next/image";

import { FaceWT003 } from "@/entities/face";
import { cn } from "@/shared/libs";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui";

const ALERT_VARIANT_MAP = {
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  SUCCESS: "success",
  DEFAULT: "default",
} as const;

export function WT003Alert({ data }: { data: FaceWT003 }) {
  const { titleI18n, messageI18n, icon, level, styleClasses } = data;
  const variant =
    ALERT_VARIANT_MAP[level as keyof typeof ALERT_VARIANT_MAP] ?? "default";

  return (
    <Alert variant={variant} className={cn("flex items-start", styleClasses)}>
      {icon && (
        <Image
          src={icon}
          alt="image"
          width={20}
          height={20}
          className="dark:invert"
        />
      )}
      <div className="pl-2">
        <AlertTitle>{titleI18n}</AlertTitle>
        <AlertDescription>{messageI18n}</AlertDescription>
      </div>
    </Alert>
  );
}
