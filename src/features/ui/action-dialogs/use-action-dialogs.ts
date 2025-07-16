"use client";

import { useContext } from "react";

import { RequireFields } from "@/shared/libs";

import { ActionDialogProps, ActionDialogsContext } from "./context";

export function useActionDialogs() {
  const { createDialog } = useContext(ActionDialogsContext);

  function alert(
    props: Omit<RequireFields<ActionDialogProps, "title">, "id" | "type">
  ) {
    createDialog({
      ...props,
      type: "alert",
    });
  }

  function confirm(
    props: Omit<RequireFields<ActionDialogProps, "title">, "id" | "type">
  ) {
    createDialog({
      ...props,
      type: "confirm",
    });
  }

  return { alert, confirm };
}
