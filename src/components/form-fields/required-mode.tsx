"use client";

import { ReactNode, createContext, useContext, useMemo, useState } from "react";

import { Switch } from "@/shared/ui/switch";

export type RequiredFieldsMode = {
  /**
   * While on — the state a create form opens in — only the fields the API
   * actually requires are rendered. The toggle in the header turns it off to
   * bring the optional ones back.
   */
  requiredOnly: boolean;
  setRequiredOnly: (requiredOnly: boolean) => void;
};

/** Every field shown, and no toggle to change that. */
export const REQUIRED_FIELDS_MODE_OFF: RequiredFieldsMode = {
  requiredOnly: false,
  setRequiredOnly: () => {},
};

const RequiredFieldsModeContext = createContext<RequiredFieldsMode>(
  REQUIRED_FIELDS_MODE_OFF
);

export function useRequiredFieldsMode() {
  return useContext(RequiredFieldsModeContext);
}

/**
 * Owns the toggle state for one form, which opens on the required fields alone.
 * Each panel that creates something calls this for itself — the mode is never
 * inherited from the panel that opened it, because the fields it applies to
 * belong to a different entity.
 */
export function useRequiredFieldsModeState(): RequiredFieldsMode {
  const [requiredOnly, setRequiredOnly] = useState(true);
  return useMemo(() => ({ requiredOnly, setRequiredOnly }), [requiredOnly]);
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
 * the mode must not reach a filter panel and empty it out.
 */
export function RequiredFieldsModeOff({ children }: { children: ReactNode }) {
  return (
    <RequiredFieldsModeContext.Provider value={REQUIRED_FIELDS_MODE_OFF}>
      {children}
    </RequiredFieldsModeContext.Provider>
  );
}

/**
 * Drops an optional field while the form shows required fields only. The field
 * stays registered, so whatever it defaults to is still submitted.
 */
export function RequiredFieldsGate({
  required,
  children,
}: {
  required?: boolean;
  children: ReactNode;
}) {
  const { requiredOnly } = useRequiredFieldsMode();

  if (requiredOnly && required !== true) return null;

  return <>{children}</>;
}

/**
 * The asterisk next to a required label. While the form shows required fields
 * only, everything on screen is required and the mark would be noise.
 */
export function RequiredMark({ required }: { required?: boolean }) {
  const { requiredOnly } = useRequiredFieldsMode();

  if (required !== true || requiredOnly) return null;

  return <span className="text-destructive">*</span>;
}

export function RequiredFieldsModeToggle() {
  const mode = useRequiredFieldsMode();
  const { requiredOnly, setRequiredOnly } = mode;

  // Nothing above owns the state — an edit sheet, or a filter panel that turned
  // the mode off — so there is nothing here to toggle.
  if (mode === REQUIRED_FIELDS_MODE_OFF) return null;

  return (
    <Switch
      // A view control, not a data one: showing fewer fields is allowed even for
      // someone who may create but not update.
      ignorePermissions
      checked={!requiredOnly}
      onCheckedChange={(showAll) => setRequiredOnly(!showAll)}
      aria-label="Show all fields"
      title="Show all fields — only the required ones are shown by default"
    />
  );
}
