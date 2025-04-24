import { HTMLDateTimeInputType } from "../types";

export function formatIntlDate(
  dateInput: Date | string | number,
  format: HTMLDateTimeInputType | "text"
): string {
  if (format === "text") {
    return dateInput.toString();
  }

  const date = new Date(dateInput);
  const locale = navigator.language;
  let options: Intl.DateTimeFormatOptions = {};

  switch (format) {
    case "date":
      options = { dateStyle: "short" };
      break;
    case "time":
      options = { timeStyle: "short" };
      break;
    case "datetime-local":
      options = { dateStyle: "short", timeStyle: "short" };
      break;
    case "month":
      options = { month: "long", year: "numeric" };
      break;
    case "week":
      // TODO: implement proper week formatting (e.g. "2024-W18" or "Week 18 of 2024")
      options = {};
      break;
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}
