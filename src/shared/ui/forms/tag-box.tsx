import { XCircle } from "lucide-react";
import React, { ForwardedRef, useImperativeHandle, useState } from "react";
import { ZodType } from "zod";

import { cn, fixedForwardRef, isFalsy, isPopulatedString } from "@/shared/libs";

import { Badge } from "../badge";
import { Input } from "./input";

export type TagBoxHandle<T> = {
  set: (newTags: T[]) => void;
};

export interface TagBoxProps<T>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onTagsChange?: (tags: T[]) => void;
  initialTags?: T[];
  schema?: ZodType<string>;
  displayValue?: (tag: T) => string;
}

export const TagBox = fixedForwardRef(function Component<T>(
  {
    className,
    initialTags = [],
    onTagsChange,
    schema,
    placeholder = "Type and press Enter",
  }: TagBoxProps<T>,
  ref: ForwardedRef<TagBoxHandle<T>>
) {
  const [tags, setTags] = useState<Set<T>>(new Set(initialTags));
  const [inputValue, setInputValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    set: (newTags: T[]) => setTags(new Set(newTags)),
  }));

  function validateTag(tag: T): string | null {
    if (schema) {
      const validationResult = schema.safeParse(tag);
      if (!validationResult.success) {
        return validationResult.error.errors[0]?.message || "Invalid tag";
      }
    }
    return null;
  }

  function addInputAsTag() {
    const tag = inputValue.trim() as unknown as T;
    if (isFalsy(tag)) return;

    const error = validateTag(tag);
    if (isPopulatedString(error)) {
      setValidationError(error);
      return;
    }

    tags.add(tag);
    setTags(new Set(tags));
    setInputValue("");
    onTagsChange?.(Array.from(tags));
  }

  const removeTag = (tagToRemove: T) => {
    if (tags.has(tagToRemove)) {
      tags.delete(tagToRemove);
      setTags(new Set(tags));
      onTagsChange?.(Array.from(tags));
    }
  };

  function handleOnKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      addInputAsTag();
      e.preventDefault();
    }
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    if (validationError) {
      setValidationError(null);
    }
  }

  return (
    <div
      className={cn(
        "bg-background mt-2 flex flex-wrap items-center gap-1 rounded-md",
        className
      )}
    >
      {validationError && (
        <p className="text-destructive mt-1 text-xs italic">
          {validationError}
        </p>
      )}
      <Input
        value={inputValue}
        onChange={handleOnChange}
        onKeyDown={handleOnKeyDown}
        onBlur={addInputAsTag}
        placeholder={placeholder}
      />
      {Array.from(tags).map((tag, _) => (
        <Badge
          key={String(tag)}
          className="text-foreground border-foreground/10 hover:bg-card m-1 bg-transparent transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
        >
          <span className="mr-2 max-w-[130px] truncate">{String(tag)}</span>
          <XCircle
            className="h-4 w-4 cursor-pointer"
            onClick={(event) => {
              event.stopPropagation();
              removeTag(tag);
            }}
          />
        </Badge>
      ))}
    </div>
  );
});
