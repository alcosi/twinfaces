import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useReducer,
  useRef,
} from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { isEmptyString, isPopulatedString } from "@/shared/libs";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
} from "@/shared/ui";

export type CrudDataTableDialogRef = {
  // TODO: fix `any`
  open: (row?: any) => void;
};

type DialogState = {
  open: boolean;
  rowId?: string;
};

type DialogProps = {
  dialogForm?: UseFormReturn<any>;
  renderFormFields?: () => ReactNode;
  // TODO: fix `any`
  onCreateSubmit?: (values: unknown) => Promise<void>;
  // TODO: fix `any`
  onUpdateSubmit?: (id: string, values: unknown) => Promise<void>;
  onSubmitSuccess?: () => void;
  title?: string;
  submitButtonLabel?: string;
};

export const CrudDataTableDialog = forwardRef(Component);

function Component(
  {
    dialogForm,
    renderFormFields,
    onCreateSubmit,
    onUpdateSubmit,
    onSubmitSuccess,
    title,
    submitButtonLabel,
  }: DialogProps,
  ref: ForwardedRef<CrudDataTableDialogRef>
) {
  const defaultValues = useRef(dialogForm?.formState.defaultValues).current;

  const [dialogState, updateDialogState] = useReducer(
    (state: DialogState, updates: Partial<DialogState>) => ({
      ...state,
      ...updates,
    }),
    {
      open: false,
      rowId: undefined,
    }
  );

  useImperativeHandle(ref, () => ({
    open: (row) => {
      updateDialogState({ open: true, rowId: row?.id });
      dialogForm?.reset(row ?? defaultValues);
    },
  }));

  function handleOpenChange(open: boolean) {
    if (!open && dialogForm?.formState.isSubmitting) return;

    updateDialogState({ open: false, rowId: undefined });
    dialogForm?.reset();
  }

  async function handleFormSubmit(formValues: unknown) {
    try {
      if (dialogState.rowId) {
        await onUpdateSubmit?.(dialogState.rowId, formValues);
      } else {
        await onCreateSubmit?.(formValues);
      }
      updateDialogState({ open: false, rowId: undefined });
      onSubmitSuccess?.();
    } catch (error) {
      console.error("Action failed:", error);
      toast.error("Action failed");
    }
  }

  const fallbackTitle = dialogState.rowId ? "Edit" : "Create";

  return dialogForm ? (
    <Dialog open={dialogState.open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[100%] sm:max-h-[80%] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isPopulatedString(title) ? title : fallbackTitle}
          </DialogTitle>
        </DialogHeader>

        <Form {...dialogForm}>
          <form onSubmit={dialogForm.handleSubmit(handleFormSubmit)}>
            <div className="max-h-[60vh] space-y-8 overflow-y-auto px-8 py-6">
              {renderFormFields && renderFormFields()}
            </div>

            <DialogFooter className="bg-background rounded-b-md p-6 sm:justify-end">
              <Button
                type="submit"
                loading={dialogForm.formState.isSubmitting}
                disabled={!dialogForm.formState.isDirty}
              >
                {submitButtonLabel && !isEmptyString(submitButtonLabel)
                  ? submitButtonLabel
                  : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  ) : null;
}
