import React, { ChangeEvent } from "react";

import { TextFormItem } from "@/components/form-fields";

import { formatToDateTimeLocal } from "@/shared/libs";

export function DatetimeFormItem({
  inputType,
  onChange,
  ...props
}: {
  inputType: string;
  onChange?: (value: string) => void;
}) {
  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    const eventDate = new Date(event.target.value);

    if (inputType === "datetime-local") {
      return onChange?.(formatToDateTimeLocal(eventDate));
    }

    return onChange?.(event.target.value);
  }

  return <TextFormItem {...props} onChange={handleOnChange} type={inputType} />;
}
