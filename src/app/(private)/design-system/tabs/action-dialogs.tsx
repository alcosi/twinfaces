import { useActionDialogs } from "@/features/ui/action-dialogs";
import { Button } from "@/shared/ui";

export function ActionDialogsTab() {
  const { confirm } = useActionDialogs();

  async function onConfirmDialogSuccessAsync() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async function onConfirmDialogCancelAsync() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return (
    <div className="flex max-w-sm flex-col gap-4 p-4">
      <Button
        onClick={() =>
          confirm({
            title: "Confirm Dialog",
            message: "Are you sure you want to do this?",
          })
        }
      >
        Confirm dialog
      </Button>

      <Button
        onClick={() =>
          confirm({
            onSuccess: onConfirmDialogSuccessAsync,
            onCancel: onConfirmDialogCancelAsync,
            title: "Confirm Dialog",
            message: "Are you sure you want to do this?",
          })
        }
      >
        Confirm dialog with async callbacks
      </Button>

      <Button
        onClick={() =>
          confirm({
            onSuccess: async () => {
              confirm({
                title: "Nested Confirm Dialog",
                message: "Are you sure?",
              });
            },
            title: "Double Confirm",
            message: "Are you sure you want to do this?",
          })
        }
      >
        Double confirm dialog
      </Button>
    </div>
  );
}
