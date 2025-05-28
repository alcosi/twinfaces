import { ThemeImage } from "@/shared/ui";

export function DomainLogo({
  iconLight,
  iconDark,
}: {
  iconLight: string;
  iconDark: string;
}) {
  const domainIconUrl = "/favicon.png";

  return (
    <ThemeImage
      className="mx-auto h-14 w-14 rounded-full shadow-md"
      lightSrc={iconLight ?? domainIconUrl}
      darkSrc={iconDark ?? domainIconUrl}
      width={56}
      height={56}
      alt="Domain logo icon"
    />
  );
}
