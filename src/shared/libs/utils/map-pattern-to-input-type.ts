import { HTMLDateTimeInputType } from "../types";

export function mapPatternToInputType(
  pattern: string
): HTMLDateTimeInputType | "text" {
  const hasYear = pattern.includes("yyyy");
  const hasMonth = pattern.includes("MM");
  const hasDay = pattern.includes("dd");
  const hasHour = pattern.includes("HH") || pattern.includes("hh");
  const hasMinute = pattern.includes("mm");
  const hasSecond = pattern.includes("ss");
  const hasWeek = pattern.includes("W") || pattern.includes("ww");
  const hasTimezone =
    pattern.includes("Z") || pattern.includes("XXX") || pattern.includes("z");

  if (hasWeek && hasYear) return "week";
  if (hasYear && hasMonth && !hasDay && !hasHour) return "month";
  if (hasHour && hasMinute && !hasYear) return "time";
  if (hasYear && hasMonth && hasDay && hasHour && hasMinute && !hasTimezone)
    return "datetime-local";
  if (hasYear && hasMonth && hasDay && !hasHour) return "date";

  return "text";
}
