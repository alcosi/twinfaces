"use client";

import { ReactNode, createContext, useState } from "react";

import { generateUUID } from "@/shared/libs";

import { ConfirmDialog } from "./confirm-dialog";

type ActionDialogContextProps = {
  createDialog: (dialog: Omit<ActionDialogProps, "id">) => void;
};

export const ActionDialogsContext = createContext<ActionDialogContextProps>({
  createDialog: () => {},
});

export type ActionDialogProps = {
  id: string;
  type: "confirm";
  title: string;
  message?: string;
  successButtonText?: string;
  cancelButtonText?: string;
  onSuccess?: () => Promise<void>;
  onCancel?: () => Promise<void>;
};

export function ActionDialogsProvider({ children }: { children: ReactNode }) {
  const [dialogs, setDialogs] = useState<ActionDialogProps[]>([]);

  function createDialog(newDialog: Omit<ActionDialogProps, "id">) {
    const id = generateUUID();
    setDialogs((prevDialogs) => [
      ...prevDialogs,
      {
        ...newDialog,
        id,
        onSuccess: () => onDialogClose(id, newDialog.onSuccess),
        onCancel: () => onDialogClose(id, newDialog.onCancel),
      },
    ]);
  }

  function onDialogClose(
    id: string,
    callback?: () => Promise<void>
  ): Promise<void> {
    if (!callback) {
      scheduleRemoveDialogFromState(id);
      return Promise.resolve();
    }

    return callback()
      .catch((error) => {
        // Optionally: log error or rethrow if you want to handle it
        console.error("Error during dialog callback:", error);
      })
      .finally(() => {
        scheduleRemoveDialogFromState(id);
      });
  }

  function scheduleRemoveDialogFromState(id: string) {
    // let the close animation finish before removing the dialog
    setTimeout(() => {
      setDialogs((prev) => prev.filter((dialog) => dialog.id !== id));
    }, 300);
  }

  return (
    <ActionDialogsContext.Provider value={{ createDialog }}>
      {children}
      <div>
        {dialogs.map((dialog) => (
          <div key={dialog.id}>
            {dialog.type === "confirm" && (
              <ConfirmDialog
                title={dialog.title}
                message={dialog.message}
                confirmButtonText={dialog.successButtonText}
                cancelButtonText={dialog.cancelButtonText}
                onConfirm={dialog.onSuccess}
                onCancel={dialog.onCancel}
              />
            )}
          </div>
        ))}
      </div>
    </ActionDialogsContext.Provider>
  );
}
