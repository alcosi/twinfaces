import { ReactNode } from "react";

export type SelectAdapter<Entity> = {
  getById: (id: string) => Promise<Entity | undefined>;
  getItems: (query: string, options?: unknown) => Promise<Entity[]>;
  getItemKey?: (entity: Entity) => string;
  renderItem: (entity: Entity) => ReactNode | string;
};

export type FormFieldValidationError = {
  key: string;
  message: string;
};

/**
 * All standard HTML input types.
 * See MDN: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types
 */
export type HTMLInputType =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

/**
 * Date and time HTML input types.
 * See MDN: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Date_and_time_formats
 */
export type HTMLDateTimeInputType =
  | "date"
  | "datetime-local"
  | "time"
  | "month"
  | "week";
