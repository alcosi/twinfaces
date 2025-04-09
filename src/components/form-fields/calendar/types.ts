import { DateRange } from "react-day-picker";

import { FormItemProps } from "../types";

export interface CalendarFormFieldProps extends FormItemProps {
  mode?: "single" | "range";
  numberOfMonths?: number;
  disableFutureDates?: boolean;
  disablePastDates?: boolean;
  minDate?: Date;
  maxDate?: Date;
  defaultValue?: Date | DateRange;
}
