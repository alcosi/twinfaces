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

import {
  AdvancedFilterPanels,
  useAdvancedFilterLevels,
} from "@/components/advanced-filters";
import { AdvancedFiltersContext } from "@/components/advanced-filters-context";

import { isPopulatedString } from "@/shared/libs";
import {
  Button,
  Form,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
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
  onCreateSubmit?: (values: unknown) => Promise<void>;
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

  const {
    renderedLevels,
    scrollRef,
    visibleWidth,
    openAdvancedFilters,
    openAdvancedFiltersFromLevel,
    closeFrom,
    reset: resetAdvancedFilters,
  } = useAdvancedFilterLevels();

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
      resetAdvancedFilters();
    },
  }));

  function handleOpenChange(open: boolean) {
    if (!open && dialogForm?.formState.isSubmitting) return;

    updateDialogState({ open: false, rowId: undefined });
    dialogForm?.reset();
    resetAdvancedFilters();
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
      resetAdvancedFilters();
    } catch (error) {
      console.error("Action failed:", error);
      toast.error("Action failed");
    }
  }

  const fallbackTitle = dialogState.rowId ? "Edit" : "Create";

  return dialogForm ? (
    <Sheet open={dialogState.open} onOpenChange={handleOpenChange}>
      <SheetContent
        className="overflow-hidden p-0"
        style={{
          width: `min(${visibleWidth}px, 95vw)`,
          maxWidth: `min(${visibleWidth}px, 95vw)`,
          transitionProperty: "width, max-width",
          transitionDuration: "300ms",
        }}
      >
        <Form {...dialogForm}>
          <div
            ref={scrollRef}
            className="flex h-full w-full overflow-x-auto"
            style={{ scrollBehavior: "smooth" }}
          >
            {/* Main create/edit panel */}
            <form
              className="flex h-full w-[400px] shrink-0 flex-col"
              onSubmit={dialogForm.handleSubmit(handleFormSubmit)}
            >
              <SheetHeader className="px-6 py-4">
                <SheetTitle className="text-base">
                  {isPopulatedString(title) ? title : fallbackTitle}
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 space-y-4 overflow-y-auto px-6 pb-6">
                <AdvancedFiltersContext.Provider
                  value={{ openAdvancedFilters }}
                >
                  {renderFormFields && renderFormFields()}
                </AdvancedFiltersContext.Provider>
              </div>

              <div className="border-border flex justify-end gap-2 border-t px-6 py-4">
                <Button
                  type="submit"
                  loading={dialogForm.formState.isSubmitting}
                  disabled={!dialogForm.formState.isDirty}
                >
                  {isPopulatedString(submitButtonLabel)
                    ? submitButtonLabel
                    : "Save"}
                </Button>
              </div>
            </form>

            {/* Advanced filter panels (stack-based, supports N levels) */}
            <AdvancedFilterPanels
              renderedLevels={renderedLevels}
              openAdvancedFiltersFromLevel={openAdvancedFiltersFromLevel}
              closeFrom={closeFrom}
            />
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  ) : null;
}
