import Image from "next/image";

import { FaceWT003 } from "@/entities/face";

import { StatusAlert } from "../../../components";

const ALERT_VARIANT_MAP = {
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  SUCCESS: "success",
  DEFAULT: "default",
} as const;

export function WT003Alert({ data }: { data: FaceWT003 }) {
  const { titleI18n, messageI18n, icon, level, styleClasses } = data;
  const variant = ALERT_VARIANT_MAP[level as keyof typeof ALERT_VARIANT_MAP];

  return (
    <StatusAlert
      variant={variant}
      icon={
        icon && (
          <Image
            src={icon}
            alt="image"
            width={16}
            height={16}
            className="dark:invert"
          />
        )
      }
      title={titleI18n}
      message={messageI18n}
      className={styleClasses}
    />
  );
}
