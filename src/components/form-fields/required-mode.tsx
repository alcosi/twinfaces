"use client";

import { ReactNode, createContext, useContext, useMemo, useState } from "react";

import { Switch } from "@/shared/ui/switch";

export type RequiredFieldsMode = {
  /** While on, only fields the API actually requires are rendered. */
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

export const REQUIRED_FIELDS_MODE_OFF: RequiredFieldsMode = {
  enabled: false,
  setEnabled: () => {},
};

const RequiredFieldsModeContext = createContext<RequiredFieldsMode>(
  REQUIRED_FIELDS_MODE_OFF
);

export function useRequiredFieldsMode() {
  return useContext(RequiredFieldsModeContext);
}

/**
 * Owns the toggle state for one form. Each panel that creates something calls
 * this for itself — required mode is never inherited from the panel that opened
 * it, because the fields it applies to belong to a different entity.
 */
export function useRequiredFieldsModeState(): RequiredFieldsMode {
  const [enabled, setEnabled] = useState(false);
  return useMemo(() => ({ enabled, setEnabled }), [enabled]);
}

export function RequiredFieldsModeProvider({
  value,
  children,
}: {
  value: RequiredFieldsMode;
  children: ReactNode;
}) {
  return (
    <RequiredFieldsModeContext.Provider value={value}>
      {children}
    </RequiredFieldsModeContext.Provider>
  );
}

/**
 * Filters have no required/optional split — every one of them is optional — so
 * required mode must not reach a filter panel and empty it out.
 */
export function RequiredFieldsModeOff({ children }: { children: ReactNode }) {
  return (
    <RequiredFieldsModeContext.Provider value={REQUIRED_FIELDS_MODE_OFF}>
      {children}
    </RequiredFieldsModeContext.Provider>
  );
}

/**
 * Drops a field from the form while required mode is on. The field stays
 * registered, so whatever it defaults to is still submitted.
 */
export function RequiredFieldsGate({
  required,
  children,
}: {
  required?: boolean;
  children: ReactNode;
}) {
  const { enabled } = useRequiredFieldsMode();

  if (enabled && required !== true) return null;

  return <>{children}</>;
}

/**
 * The asterisk next to a required label. In required mode everything on screen
 * is required, so it would only be noise.
 */
export function RequiredMark({ required }: { required?: boolean }) {
  const { enabled } = useRequiredFieldsMode();

  if (required !== true || enabled) return null;

  return <span className="text-destructive">*</span>;
}

export function RequiredFieldsModeToggle() {
  const mode = useRequiredFieldsMode();
  const { enabled, setEnabled } = mode;

  // Nothing above owns the state — an edit sheet, or a filter panel that turned
  // required mode off — so there is nothing here to toggle.
  if (mode === REQUIRED_FIELDS_MODE_OFF) return null;

  return (
    <Switch
      // A view control, not a data one: hiding optional fields is allowed even
      // for someone who may create but not update.
      ignorePermissions
      checked={enabled}
      onCheckedChange={setEnabled}
      aria-label="Required mode"
      title="Required mode — show only the fields that have to be filled in"
    />
  );
}
