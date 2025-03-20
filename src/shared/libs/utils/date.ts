export function formatToTwinfaceDate(
  dateInput: Date | string | number,
  format: "date" | "datetime" | "time" = "datetime"
): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }

  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();

  switch (format) {
    case "datetime":
      return `${formattedDate} | ${formattedTime}`;
    case "time":
      return formattedTime;
    case "date":
    default:
      return formattedDate;
  }
}
