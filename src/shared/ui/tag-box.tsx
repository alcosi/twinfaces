import { cn, fixedForwardRef, isFalsy, isPopulatedString } from "@/shared/libs";
import { XCircle } from "lucide-react";
import React, { ForwardedRef, useImperativeHandle, useState } from "react";
import { ZodType } from "zod";
import { Badge } from "./badge";
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addInputAsTag();
      e.preventDefault();
    }
  };

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    if (validationError) {
      setValidationError(null);
    }
  }

  return (
    <div>
      <div
        className={cn(
          "flex flex-wrap items-center gap-1 rounded-md bg-background p-2",
          className
        )}
      >
        {validationError && (
          <p className="text-destructive text-xs italic mt-1">
            {validationError}
          </p>
        )}
        <Input
          value={inputValue}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
          onBlur={addInputAsTag}
          placeholder={placeholder}
        />
        {Array.from(tags).map((tag, _) => (
          <Badge
            key={String(tag)}
            className="bg-transparent text-foreground border-foreground/10 hover:bg-card m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
          >
            <span className="truncate max-w-[130px] mr-2">{String(tag)}</span>
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
    </div>
  );
});
