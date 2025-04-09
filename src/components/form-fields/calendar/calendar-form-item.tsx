import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/shared/libs";
import {
  Button,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui";
import { Calendar } from "@/shared/ui/calendar";

import { FormItemProps } from "../types";
import { CalendarFormFieldProps } from "./types";

interface CalendarFormItemProps
  extends Omit<CalendarFormFieldProps, "mode" | "defaultValue">,
    FormItemProps {
  fieldValue?: DateRange;
  onChange: (value: DateRange | undefined) => void;
}

export function CalendarFormItem({
  fieldValue,
  onChange,
  label,
  description,
  required,
  numberOfMonths = 2,
  disableFutureDates,
  disablePastDates,
  minDate,
  maxDate,
  inForm,
  inputId,
}: CalendarFormItemProps) {
  const formatDate = (date: Date) => format(date, "LLL dd, y");

  const getButtonText = () => {
    if (!fieldValue?.from) return "Pick a date range";

    return fieldValue.to
      ? `${formatDate(fieldValue.from)} - ${formatDate(fieldValue.to)}`
      : formatDate(fieldValue.from);
  };

  const getDisabledDates = (date: Date) => {
    if (disableFutureDates && date > new Date()) return true;
    if (disablePastDates && date < new Date()) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <FormItem className="flex flex-col">
      {label && (
        <FormLabel>
          {label} {required && <span className="text-red-500">*</span>}
        </FormLabel>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                !fieldValue && "text-muted-foreground"
              )}
              id={inputId}
            >
              {getButtonText()}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={fieldValue?.from || new Date()}
            selected={fieldValue}
            onSelect={onChange}
            numberOfMonths={numberOfMonths}
            disabled={getDisabledDates}
          />
        </PopoverContent>
      </Popover>
      {description && <FormDescription>{description}</FormDescription>}
      {inForm && <FormMessage />}
    </FormItem>
  );
}
