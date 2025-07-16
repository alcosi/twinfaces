import { ThemeImage } from "@/shared/ui";

export function DomainLogo({
  iconLight,
  iconDark,
}: {
  iconLight: string;
  iconDark: string;
}) {
  return (
    <ThemeImage
      className="mx-auto h-14 w-14 p-0.5"
      lightSrc={iconLight}
      darkSrc={iconDark}
      width={56}
      height={56}
      alt="Domain logo icon"
    />
  );
}
