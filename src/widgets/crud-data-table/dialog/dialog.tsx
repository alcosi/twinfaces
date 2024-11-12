import { Button } from "@/components/base/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/base/dialog";
import { Form } from "@/components/base/form";
import {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useReducer,
  useRef,
} from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

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
  onCreateSubmit?: (values: any) => Promise<void>;
  // TODO: fix `any`
  onUpdateSubmit?: (id: string, values: any) => Promise<void>;
  onSubmitSuccess?: () => void;
};

export const CrudDataTableDialog = forwardRef(Component);

function Component(
  {
    dialogForm,
    renderFormFields,
    onCreateSubmit,
    onUpdateSubmit,
    onSubmitSuccess,
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

  return dialogForm ? (
    <Dialog open={dialogState.open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[100%] sm:max-h-[80%]">
        <DialogHeader>
          <DialogTitle>{dialogState.rowId ? "Edit" : "Create"}</DialogTitle>
        </DialogHeader>

        <Form {...dialogForm}>
          <form onSubmit={dialogForm.handleSubmit(handleFormSubmit)}>
            <div
              className="flex-1 space-y-8 p-1 overflow-y-scroll"
              style={{
                // maxHeight: 80vh minus header and footer heights (var(--header-height))
                maxHeight:
                  "calc(80vh - var(--header-height) - var(--header-height))",
              }}
            >
              {renderFormFields && renderFormFields()}
            </div>

            <DialogFooter className="sm:justify-end py-3">
              <Button
                type="submit"
                loading={dialogForm.formState.isSubmitting}
                disabled={!dialogForm.formState.isDirty}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  ) : null;
}
